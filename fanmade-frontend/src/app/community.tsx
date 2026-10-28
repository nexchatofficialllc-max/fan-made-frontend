import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { getMyAccountType } from "../lib/account-system";
import { supabase } from "../lib/supabase";

type Poll = {
  question: string;
  options: string[];
};

type Message = {
  id: string;
  username: string;
  text: string;
  time: string;
  createdAt?: string;
  mine?: boolean;
  reply?: string;
  edited?: boolean;
  poll?: Poll;
};

const REACTIONS = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
  "🙂","🙃","😉","😌","😍","🥰","😘","😎","🤩","🥳",
  "🤔","🤗","🫡","😮","😲","😱","😭","😢","😡","🤬",
  "😴","🤯","🫠","❤️","🧡","💛","💚","💙","💜","🖤",
  "🤍","🤎","🩷"
];

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const initialMessages: Message[] = [
  {
    id: "1",
    username: "loopafan",
    text: "Welcome to the LOOPA Community 👋",
    time: "7:46 AM",
  },
  {
    id: "2",
    username: "nex",
    text: "Good to see everyone here 😎",
    time: "7:48 AM",
    mine: true,
  },
  {
    id: "3",
    username: "Samloko",
    text: "How far?",
    time: "7:50 AM",
  },
  {
    id: "4",
    username: "loopafan",
    text: "What's going on here?",
    time: "8:02 AM",
  },
];

export default function Community() {
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getMyAccountType()
      .then((type) => {
        if (active) {
          setAccountType(type);
        }
      })
      .catch(() => {
        if (active) {
          setAccountType(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [reaction, setReaction] = useState<Record<string, string>>({});
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  async function loadCommunityMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const [
      { data: messageRows, error: messageError },
      { data: pollRows, error: pollError },
    ] = await Promise.all([
      supabase
        .from("community_messages")
        .select(
          "id, account_id, content, created_at, edited_at, reply_to_message_id"
        )
        .order("created_at", { ascending: true }),

      supabase.rpc("get_community_polls"),
    ]);

    if (messageError) {
      console.error("Community messages load failed:", messageError);
      return;
    }

    if (pollError) {
      console.error("Community polls load failed:", pollError);
      return;
    }

    const onlineMessages: Message[] = [];

    if (messageRows && messageRows.length > 0) {
      const accountIds = [
        ...new Set(messageRows.map((message) => message.account_id)),
      ];

      const { data: profiles, error: profileError } = await supabase
        .from("public_profiles")
        .select("id, username, account_type")
        .in("id", accountIds);

      if (profileError) {
        console.error("Community profiles load failed:", profileError);
        return;
      }

      const profileMap = new Map(
        (profiles || []).map((profile) => [profile.id, profile])
      );

      onlineMessages.push(
        ...messageRows.map((message) => {
          const profile = profileMap.get(message.account_id);

          return {
            id: message.id,
            username: profile?.username || "LOOPA User",
            text: message.content,
            time: formatMessageTime(message.created_at),
            createdAt: message.created_at,
            mine: message.account_id === user.id,
            edited: Boolean(message.edited_at),
          };
        })
      );
    }

    const groupedPolls = new Map<
      string,
      {
        postId: string;
        question: string;
        options: Array<{
          index: number;
          text: string;
          votes: number;
        }>;
      }
    >();

    for (const row of pollRows || []) {
      const existing = groupedPolls.get(row.post_id);

      if (existing) {
        existing.options.push({
          index: row.option_index,
          text: row.option_text,
          votes: Number(row.vote_count || 0),
        });
      } else {
        groupedPolls.set(row.post_id, {
          postId: row.post_id,
          question: row.question,
          options: [
            {
              index: row.option_index,
              text: row.option_text,
              votes: Number(row.vote_count || 0),
            },
          ],
        });
      }
    }

    for (const poll of groupedPolls.values()) {
      poll.options.sort((a, b) => a.index - b.index);

      onlineMessages.push({
        id: poll.postId,
        username: "LOOPA Community",
        text: "",
        time: "",
        mine: false,
        poll: {
          question: poll.question,
          options: poll.options.map((option) => option.text),
        },
      });

      poll.options.forEach((option) => {
        setPollVotes((current) => ({
          ...current,
          [`${poll.postId}-${option.index}`]: option.votes,
        }));
      });
    }

    setMessages(onlineMessages);
  }

  useEffect(() => {
    loadCommunityMessages();
  }, []);


  const [pollMenuOpen, setPollMenuOpen] = useState(false);
  const [pollComposerOpen, setPollComposerOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOption1, setPollOption1] = useState("");
  const [pollOption2, setPollOption2] = useState("");
  const [pollOption3, setPollOption3] = useState("");
  const [pollOption4, setPollOption4] = useState("");
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [selectedPollOption, setSelectedPollOption] = useState<Record<string, number>>({});
  const lastTap = useRef<Record<string, number>>({});

  function openProfile(username: string) {
    router.push({
      pathname: "/community-profile" as any,
      params: { username },
    });
  }

  function handleMessagePress(message: Message) {
    const now = Date.now();
    const previous = lastTap.current[message.id] || 0;

    if (now - previous < 500) {
      setSelectedMessage(message);
      setReactionPickerOpen(true);
      lastTap.current[message.id] = 0;
      return;
    }

    lastTap.current[message.id] = now;
  }

  function chooseReaction(value: string) {
    if (!selectedMessage) return;

    setReaction((current) => ({
      ...current,
      [selectedMessage.id]: value,
    }));

    setReactionPickerOpen(false);
    setSelectedMessage(null);
  }

  async function createPoll() {
    if (accountType?.toLowerCase() !== "creator") {
      setPollMenuOpen(false);
      setPollComposerOpen(false);
      return;
    }

    const question = pollQuestion.trim();
    const options = [
      pollOption1.trim(),
      pollOption2.trim(),
      pollOption3.trim(),
      pollOption4.trim(),
    ].filter(Boolean);

    if (!question || options.length < 3) {
      return;
    }

    const { data: postId, error: createError } = await supabase.rpc(
      "create_community_poll",
      {
        p_question: question,
        p_options: options,
      }
    );

    if (createError) {
      console.error("Community poll creation failed:", createError);
      return;
    }

    const { data: pollRows, error: pollsError } = await supabase.rpc(
      "get_community_polls"
    );

    if (pollsError) {
      console.error("Community poll loading failed:", pollsError);
      return;
    }

    const createdRows = (pollRows || []).filter(
      (row: { post_id: string }) => row.post_id === postId
    );

    if (createdRows.length === 0) {
      console.error("Created poll could not be found.");
      return;
    }

    const createdPoll = createdRows[0];

    const pollMessage: Message = {
      id: createdPoll.post_id,
      username: "nex",
      text: "",
      time: "Now",
      mine: true,
      poll: {
        question: createdPoll.question,
        options: createdRows
          .sort(
            (a: { option_index: number }, b: { option_index: number }) =>
              a.option_index - b.option_index
          )
          .map((row: { option_text: string }) => row.option_text),
      },
    };

    setMessages((current) => [...current, pollMessage]);

    setPollQuestion("");
    setPollOption1("");
    setPollOption2("");
    setPollOption3("");
    setPollOption4("");
    setPollComposerOpen(false);
    setPollMenuOpen(false);
  }

  async function votePoll(messageId: string, optionIndex: number) {
    if (selectedPollOption[messageId] !== undefined) {
      return;
    }

    const { data: pollRows, error: pollsError } = await supabase.rpc(
      "get_community_polls"
    );

    if (pollsError) {
      console.error("Community poll loading failed:", pollsError);
      return;
    }

    const matchingRows = (pollRows || []).filter(
      (row: { post_id: string }) => row.post_id === messageId
    );

    const selectedRow = matchingRows.find(
      (row: { option_index: number }) => row.option_index === optionIndex
    );

    if (!selectedRow) {
      console.error("Community poll option could not be found.");
      return;
    }

    const { error: voteError } = await supabase.rpc(
      "vote_on_community_poll",
      {
        p_poll_id: selectedRow.poll_id,
        p_option_id: selectedRow.option_id,
      }
    );

    if (voteError) {
      console.error("Community poll vote failed:", voteError);
      return;
    }

    setSelectedPollOption((current) => ({
      ...current,
      [messageId]: optionIndex,
    }));

    setPollVotes((current) => ({
      ...current,
      [`${messageId}-${optionIndex}`]:
        (current[`${messageId}-${optionIndex}`] || 0) + 1,
    }));
  }

  async function sendMessage() {
    const value = text.trim();
    if (!value) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Community send blocked: no authenticated Supabase user.");
      return;
    }

    const { data, error } = await supabase
      .from("community_messages")
      .insert({
        account_id: user.id,
        content: value,
      })
      .select("id, content, created_at")
      .single();

    if (error) {
      console.error("Community message send failed:", error);
      return;
    }

    const newMessage: Message = {
      id: data.id,
      username: "nex",
      text: data.content,
      time: formatMessageTime(data.created_at),
      createdAt: data.created_at,
      mine: true,
      reply: replyTo ? replyTo.text : undefined,
    };

    setMessages((current) => [...current, newMessage]);
    setText("");
    setReplyTo(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(16,42,131,0.62)",
            "rgba(7,17,47,0.90)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>LOOPA Community</Text>
          <Text style={styles.headerSubtitle}>Community chat</Text>
        </View>

        <Pressable
          onPress={() => setMenuOpen(true)}
          style={styles.headerButton}
          accessibilityLabel="Community menu"
        >
          <Text style={styles.more}>⋮</Text>
        </Pressable>
      </View>

      <BlurView intensity={55} tint="dark" style={styles.pinned}>
        <Text style={styles.pin}>📌</Text>
        <View style={styles.pinnedText}>
          <Text style={styles.pinnedTitle}>LOOPA Community</Text>
          <Text style={styles.pinnedMessage}>
            Welcome! Chat, share ideas and meet other LOOPA members.
          </Text>
        </View>
      </BlurView>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.unread}>
          <Text style={styles.unreadText}>4 unread messages</Text>
        </View>

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.mine && styles.messageRowMine,
            ]}
          >
            {!message.mine && (
              <Pressable
                onPress={() => openProfile(message.username)}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {message.username.charAt(0).toUpperCase()}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => handleMessagePress(message)}
              onLongPress={() => setReplyTo(message)}
              style={[
                styles.bubble,
                message.mine ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <BlurView
                intensity={42}
                tint="dark"
                style={[
                  styles.bubbleGlass,
                  message.mine ? styles.myBubbleGlass : styles.otherBubbleGlass,
                ]}
              >
              <Pressable onPress={() => openProfile(message.username)}>
                <Text
                  style={[
                    styles.username,
                    message.mine && styles.myUsername,
                  ]}
                >
                  @{message.username}
                </Text>
              </Pressable>

              {message.reply && (
                <View style={styles.replyPreview}>
                  <Text style={styles.replyLabel}>Replying to</Text>
                  <Text numberOfLines={1} style={styles.replyText}>
                    {message.reply}
                  </Text>
                </View>
              )}

              {message.poll && (
                <View style={styles.pollCard}>
                  <Text style={styles.pollQuestion}>
                    {message.poll.question}
                  </Text>

                  {message.poll.options.map((option, index) => {
                    const selected =
                      selectedPollOption[message.id] === index;
                    const votes =
                      pollVotes[`${message.id}-${index}`] || 0;

                    return (
                      <Pressable
                        key={`${message.id}-${index}`}
                        onPress={() => votePoll(message.id, index)}
                        style={[
                          styles.pollOption,
                          selected && styles.pollOptionSelected,
                        ]}
                      >
                        <View style={styles.pollRadio}>
                          {selected && <View style={styles.pollRadioDot} />}
                        </View>

                        <Text style={styles.pollOptionText}>
                          {option}
                        </Text>

                        {selected && (
                          <Text style={styles.pollVoteCount}>
                            {votes}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}

                  <Text style={styles.pollHint}>
                    Tap one option to vote
                  </Text>
                </View>
              )}

              {message.text ? (
                <Text style={styles.messageText}>{message.text}</Text>
              ) : null}

              <View style={styles.messageMeta}>
                {reaction[message.id] && (
                  <Text style={styles.reaction}>{reaction[message.id]}</Text>
                )}
                <Text style={styles.time}>
                  {message.time}
                  {message.edited ? "  Edited" : ""}
                </Text>
              </View>
              </BlurView>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarText}>
            <Text style={styles.replyBarTitle}>
              Replying to @{replyTo.username}
            </Text>
            <Text numberOfLines={1} style={styles.replyBarMessage}>
              {replyTo.text}
            </Text>
          </View>
          <Pressable onPress={() => setReplyTo(null)}>
            <Text style={styles.close}>×</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={pollMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPollMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPollMenuOpen(false)}
        >
          <Pressable style={styles.createSheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Create</Text>

            {accountType?.toLowerCase() === "creator" && (
              <Pressable
                style={styles.createItem}
                onPress={() => {
                  setPollMenuOpen(false);
                  setPollComposerOpen(true);
                }}
              >
                <Text style={styles.createIcon}>📊</Text>
                <Text style={styles.createItemText}>Poll</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.createItem}
              onPress={() => setPollMenuOpen(false)}
            >
              <Text style={styles.createIcon}>×</Text>
              <Text style={styles.createItemText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={pollComposerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPollComposerOpen(false)}
      >
        <View style={styles.pollModal}>
          <View style={styles.pollComposer}>
            <View style={styles.pollHeader}>
              <Text style={styles.sheetTitle}>Create Poll</Text>
              <Pressable onPress={() => setPollComposerOpen(false)}>
                <Text style={styles.close}>×</Text>
              </Pressable>
            </View>

            <TextInput
              value={pollQuestion}
              onChangeText={setPollQuestion}
              placeholder="Ask a question"
              placeholderTextColor="#777"
              style={styles.pollInput}
            />

            <TextInput
              value={pollOption1}
              onChangeText={setPollOption1}
              placeholder="Option 1"
              placeholderTextColor="#777"
              style={styles.pollInput}
            />

            <TextInput
              value={pollOption2}
              onChangeText={setPollOption2}
              placeholder="Option 2"
              placeholderTextColor="#777"
              style={styles.pollInput}
            />

            <TextInput
              value={pollOption3}
              onChangeText={setPollOption3}
              placeholder="Option 3"
              placeholderTextColor="#777"
              style={styles.pollInput}
            />

            <TextInput
              value={pollOption4}
              onChangeText={setPollOption4}
              placeholder="Option 4 (optional)"
              placeholderTextColor="#777"
              style={styles.pollInput}
            />

            <Text style={styles.pollHelp}>
              Add 3 or 4 choices.
            </Text>

            <Pressable
              onPress={createPoll}
              style={[
                styles.createPollButton,
                (!pollQuestion.trim() ||
                  [pollOption1, pollOption2, pollOption3]
                    .filter((value) => value.trim()).length < 3) &&
                  styles.createPollButtonDisabled,
              ]}
            >
              <Text style={styles.createPollText}>Create Poll</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={reactionPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setReactionPickerOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setReactionPickerOpen(false)}
        >
          <Pressable style={styles.reactionSheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>React to message</Text>

            <View style={styles.reactionGrid}>
              {REACTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => chooseReaction(emoji)}
                  style={styles.reactionChoice}
                >
                  <Text style={styles.reactionChoiceText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMenuOpen(false)}
        >
          <Pressable style={styles.menuSheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Community</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setInfoOpen(true);
              }}
            >
              <Text style={styles.menuItemText}>Community info</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => setNotificationsOn((value) => !value)}
            >
              <Text style={styles.menuItemText}>
                {notificationsOn ? "Mute notifications" : "Turn notifications on"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => setMenuOpen(false)}
            >
              <Text style={styles.menuItemText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={infoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setInfoOpen(false)}
        >
          <Pressable style={styles.infoSheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>LOOPA Community</Text>
            <Text style={styles.infoText}>
              Chat with other LOOPA members, reply to messages and react with emojis.
            </Text>
            <Text style={styles.infoText}>
              Notifications: {notificationsOn ? "On" : "Off"}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setInfoOpen(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <BlurView intensity={55} tint="dark" style={styles.composer}>
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(16,42,131,0.30)", "rgba(7,17,47,0.48)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={styles.emojiButton}
            accessibilityLabel="Emoji"
            onPress={() =>
              Alert.alert("Emoji", "The emoji picker will be added in a later update.")
            }
          >
            <BlurView intensity={35} tint="dark" style={styles.buttonGlassContent}>
              <Text style={styles.composerIcon}>😊</Text>
            </BlurView>
          </Pressable>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message the community..."
            placeholderTextColor="#91A8D6"
            multiline
            style={styles.input}
          />

          <Pressable
            onPress={() => setPollMenuOpen(true)}
            style={styles.createButton}
            accessibilityLabel="Create poll or post"
          >
            <BlurView intensity={30} tint="dark" style={styles.buttonGlassContent}>
              <Text style={styles.composerIcon}>＋</Text>
            </BlurView>
          </Pressable>

          {text.trim().length > 0 ? (
            <Pressable
              onPress={sendMessage}
              style={styles.sendButton}
              accessibilityLabel="Send message"
            >
              <Text style={styles.sendText}>➤</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Voice notes",
                  "Voice recording isn't enabled yet. Your microphone button will be connected when audio recording is added."
                )
              }
              style={styles.voiceButton}
              accessibilityLabel="Voice notes"
            >
              <BlurView intensity={38} tint="dark" style={styles.buttonGlassContent}>
                <Text style={styles.voiceIcon}>🎙️</Text>
              </BlurView>
            </Pressable>
          )}
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(7,17,47,0.70)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,217,255,0.42)",
    overflow: "hidden",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    color: "#fff",
    fontSize: 42,
    lineHeight: 42,
  },
  more: {
    color: "#fff",
    fontSize: 30,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#91A8D6",
    fontSize: 12,
    marginTop: 2,
  },
  pinned: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "rgba(16,42,131,0.34)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,217,255,0.34)",
  },
  pin: {
    fontSize: 22,
    marginRight: 10,
  },
  pinnedText: {
    flex: 1,
  },
  pinnedTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  pinnedMessage: {
    color: "#C2D4F5",
    fontSize: 13,
    marginTop: 3,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    padding: 12,
    paddingBottom: 18,
  },
  unread: {
    alignSelf: "center",
    backgroundColor: "rgba(16,42,131,0.40)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.32)",
    borderRadius: 18,
    marginVertical: 12,
  },
  unreadText: {
    color: "#C2D4F5",
    fontSize: 12,
    fontWeight: "600",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  messageRowMine: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,217,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  bubbleGlass: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  myBubbleGlass: {
    backgroundColor: "rgba(0,217,255,0.10)",
    borderColor: "rgba(0,217,255,0.38)",
  },
  otherBubbleGlass: {
    backgroundColor: "rgba(16,42,131,0.30)",
    borderColor: "rgba(190,220,255,0.22)",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  username: {
    color: "#00D9FF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  myUsername: {
    color: "#00D9FF",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 3,
  },
  time: {
    color: "#91A8D6",
    fontSize: 10,
  },
  reaction: {
    fontSize: 15,
    marginRight: 5,
  },
  replyPreview: {
    backgroundColor: "rgba(0,217,255,0.10)",
    borderLeftWidth: 3,
    borderLeftColor: "#00D9FF",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.18)",
    padding: 7,
    marginBottom: 7,
    borderRadius: 8,
  },
  replyLabel: {
    color: "#C2D4F5",
    fontSize: 10,
    fontWeight: "700",
  },
  replyText: {
    color: "#C2D4F5",
    fontSize: 12,
    marginTop: 2,
  },
  pollCard: {
    marginTop: 2,
    marginBottom: 4,
    backgroundColor: "rgba(7,17,47,0.40)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.32)",
    borderRadius: 14,
    padding: 11,
    minWidth: 230,
  },
  pollQuestion: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 9,
  },
  pollOption: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "rgba(125,230,255,0.28)",
    backgroundColor: "rgba(16,42,131,0.20)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 7,
  },
  pollOptionSelected: {
    borderColor: "rgba(0,217,255,0.32)",
    backgroundColor: "rgba(16,42,131,0.42)",
  },
  pollRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  pollRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00D9FF",
  },
  pollOptionText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  pollVoteCount: {
    color: "#C2D4F5",
    fontSize: 12,
  },
  pollHint: {
    color: "#91A8D6",
    fontSize: 10,
    marginTop: 8,
  },
  createSheet: {
    backgroundColor: "rgba(12,29,76,0.97)",
    marginHorizontal: 18,
    marginBottom: 90,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.52)",
    borderRadius: 20,
    padding: 10,
    elevation: 12,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  createItem: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },
  createIcon: {
    fontSize: 20,
    width: 34,
  },
  createItemText: {
    color: "#fff",
    fontSize: 15,
  },
  pollModal: {
    flex: 1,
    backgroundColor: "rgba(3,8,28,0.80)",
    justifyContent: "flex-end",
  },
  pollComposer: {
    backgroundColor: "rgba(7,17,47,0.97)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 28,
  },
  pollHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pollInput: {
    minHeight: 46,
    backgroundColor: "rgba(16,42,131,0.28)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
    color: "#FFFFFF",
    borderRadius: 11,
    paddingHorizontal: 13,
    marginTop: 9,
    fontSize: 15,
  },
  pollHelp: {
    color: "#91A8D6",
    fontSize: 12,
    marginTop: 8,
  },
  createPollButton: {
    minHeight: 48,
    backgroundColor: "#00D9FF",
    borderWidth: 1,
    borderColor: "rgba(190,245,255,0.90)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    elevation: 5,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.30,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 2 },
  },
  createPollButtonDisabled: {
    opacity: 0.45,
  },
  createPollText: {
    color: "#07112F",
    fontWeight: "700",
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(3,8,28,0.76)",
    justifyContent: "flex-end",
  },
  reactionSheet: {
    backgroundColor: "rgba(12,29,76,0.98)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.48)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 24,
    elevation: 14,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.17,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -3 },
  },
  menuSheet: {
    backgroundColor: "rgba(12,29,76,0.97)",
    marginHorizontal: 18,
    marginTop: 90,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.52)",
    borderRadius: 20,
    padding: 10,
    elevation: 12,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  infoSheet: {
    backgroundColor: "rgba(12,29,76,0.98)",
    marginHorizontal: 24,
    marginTop: 180,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.48)",
    borderRadius: 22,
    padding: 20,
    elevation: 12,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  reactionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reactionChoice: {
    width: "16.66%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  reactionChoiceText: {
    fontSize: 25,
  },
  menuItem: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 15,
  },
  infoText: {
    color: "#C2D4F5",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: "rgba(0,217,255,0.88)",
    borderWidth: 1,
    borderColor: "rgba(190,245,255,0.75)",
    borderRadius: 14,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.22,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 1 },
  },
  closeButtonText: {
    color: "#07112F",
    fontWeight: "700",
  },
  replyBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,42,131,0.34)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,217,255,0.32)",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  replyBarText: {
    flex: 1,
  },
  replyBarTitle: {
    color: "#C2D4F5",
    fontSize: 11,
    fontWeight: "700",
  },
  replyBarMessage: {
    color: "#C2D4F5",
    fontSize: 13,
    marginTop: 2,
  },
  close: {
    color: "#C2D4F5",
    fontSize: 28,
    paddingHorizontal: 8,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,217,255,0.48)",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: "rgba(7,17,47,0.42)",
    borderWidth: 1,
    borderColor: "rgba(125,230,255,0.40)",
    color: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 10,
    fontSize: 16,
  },
  buttonGlassContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    overflow: "hidden",
  },
  emojiButton: {
    width: 40,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.24)",
    borderWidth: 1,
    borderColor: "rgba(190,245,255,0.58)",
    borderRadius: 17,
    overflow: "hidden",
    marginRight: 5,
    elevation: 5,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
  },
  createButton: {
    width: 36,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.24)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
    borderRadius: 16,
    overflow: "hidden",
    marginLeft: 3,
  },
  composerIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    textShadowColor: "rgba(0,217,255,0.65)",
    textShadowRadius: 5,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#00D9FF",
    borderWidth: 1,
    borderColor: "#8BF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    elevation: 5,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.38,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(0,217,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(0,217,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: 5,
    elevation: 9,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.55,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  voiceIcon: {
    fontSize: 25,
    color: "#FFFFFF",
    textShadowColor: "#00D9FF",
    textShadowRadius: 8,
    includeFontPadding: false,
  },
  sendText: {
    color: "#07112F",
    fontSize: 19,
    fontWeight: "800",
  },
});
