import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  Image,
  ScrollView,
  Modal,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getFamiAvatar } from "../lib/fami-avatar";
import * as Clipboard from "expo-clipboard";

type ChatMessage = {
  id: string;
  sender: "user" | "fami" | "support";
  text: string;
  createdAt: string;
  vote?: "like" | "dislike";
  deleted?: boolean;
};

const FAMI_MESSAGES_KEY = "loopa_fami_messages";
const FAMI_API_URL = "https://fan-made-backend-2.onrender.com";

async function askFamiOnline(message: string, history: ChatMessage[]): Promise<string> {
  const response = await fetch(`${FAMI_API_URL}/fami/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.slice(-12).map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: item.text,
      })),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Fami could not respond.");
  }

  if (!data?.reply) {
    throw new Error("Fami returned an empty response.");
  }

  return data.reply;
}

function getFamiReply(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("hello") ||
    lowerMessage === "hi" ||
    lowerMessage.startsWith("hi ")
  ) {
    return "Heyyy! 🌸 I'm Fami. What can I help you with?";
  }

  if (lowerMessage.includes("help")) {
    return "Of course! 🌸 Tell me what's happening with LOOPA and we'll figure it out together. No need to panic, okay?";
  }

  if (
    lowerMessage.includes("account") ||
    lowerMessage.includes("login") ||
    lowerMessage.includes("sign in")
  ) {
    return "Gotcha. Let's take this step by step. ✨ Tell me what's going wrong with your LOOPA account.";
  }

  if (
    lowerMessage.includes("loopa") ||
    lowerMessage.includes("fan made")
  ) {
    return "Yep! 🌸 You're talking to Fami, LOOPA's little support assistant. I'm here to help you find your way around.";
  }

  if (
    lowerMessage.includes("anime") ||
    lowerMessage.includes("manga")
  ) {
    return "Ooh, anime territory! ✨ Tell me what you're trying to do and I'll see how I can help.";
  }

  if (
    lowerMessage.includes("thank") ||
    lowerMessage.includes("thanks")
  ) {
    return "Anytime! 🌸 That's what I'm here for.";
  }

  return "Hmm, I don't have enough info yet 😅. Tell me a little more and I'll try to help.";
}

export default function FamiScreen() {
  const router = useRouter();
  const [famiImage, setFamiImage] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [thinking, setThinking] = React.useState(false);
  const [thinkingLabel, setThinkingLabel] = React.useState("Thinking... ✨");
  const [supportActive, setSupportActive] = React.useState(false);
  const [supportConnected, setSupportConnected] = React.useState(false);
  const [reviewVisible, setReviewVisible] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [satisfaction, setSatisfaction] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);
  const [messagesLoaded, setMessagesLoaded] = React.useState(false);
  const chatScrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const loadFamiData = async () => {
      const savedAvatar = await getFamiAvatar();

      if (savedAvatar) {
        setFamiImage(savedAvatar);
      }

      const savedMessages = await AsyncStorage.getItem(
        FAMI_MESSAGES_KEY
      );

      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);

          if (Array.isArray(parsedMessages)) {
            setMessages(parsedMessages);
          }
        } catch {
          await AsyncStorage.removeItem(FAMI_MESSAGES_KEY);
        }
      }

      setMessagesLoaded(true);
    };

    loadFamiData();
  }, []);

  React.useEffect(() => {
    if (!messagesLoaded) {
      return;
    }

    AsyncStorage.setItem(
      FAMI_MESSAGES_KEY,
      JSON.stringify(messages)
    ).catch(() => {});
  }, [messages, messagesLoaded]);

  React.useEffect(() => {
    if (!messagesLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, thinking, messagesLoaded]);

  const handleEditMessage = (item: ChatMessage) => {
    setEditingMessageId(item.id);
    setMessage(item.text);
  };

  const handleDeleteMessage = (id: string) => {
    Alert.alert("Delete message?", "Only this message will be removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setMessages((current) => current.map((item) =>
            item.id === id
              ? { ...item, text: "You deleted this message", deleted: true, vote: undefined }
              : item
          ));
          setSelectedMessageId(null);
          if (editingMessageId === id) {
            setEditingMessageId(null);
            setMessage("");
          }
        },
      },
    ]);
  };

  const handleCopyMessage = async (text: string) => {
  try {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Fami's reply was copied.");
  } catch {
    Alert.alert("Copy failed", "Please try again.");
  }
};

const handleForwardMessage = async (text: string) => {
  try {
    await Share.share({ message: text });
  } catch {
    Alert.alert("Forward failed", "Please try again.");
  }
};

const handleVote = (id: string, vote: "like" | "dislike") => {
    setMessages((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, vote: item.vote === vote ? undefined : vote }
          : item
      )
    );
  };

  const handleSend = async () => {
    const cleanedMessage = message.trim();

    if (!cleanedMessage || thinking || reviewVisible) {
      return;
    }

    if (editingMessageId) {
      setMessages((current) =>
        current.map((item) =>
          item.id === editingMessageId
            ? { ...item, text: cleanedMessage }
            : item
        )
      );
      setEditingMessageId(null);
      setMessage("");
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: cleanedMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setThinking(true);
    setThinkingLabel("Thinking... ✨");

    const lowerMessage = cleanedMessage.toLowerCase();
    const wantsHuman =
      lowerMessage.includes("human") ||
      lowerMessage.includes("support team") ||
      lowerMessage.includes("support agent") ||
      lowerMessage.includes("real person") ||
      lowerMessage.includes("talk to someone") ||
      lowerMessage.includes("connect me") ||
      lowerMessage.includes("agent");

    if (wantsHuman && !supportConnected) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setThinkingLabel("Connecting to LOOPA Support Team...");

      await new Promise((resolve) => setTimeout(resolve, 1800));

      setThinkingLabel("Connected ✓");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const supportMessage: ChatMessage = {
        id: `support-${Date.now()}`,
        sender: "support",
        text: "Hi! 👋 I'm from the LOOPA Support Team. What happened?",
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, supportMessage]);
      setSupportActive(true);
      setSupportConnected(true);
      setThinking(false);
      return;
    }

    let reply: string;

    if (supportActive) {
      reply = "Got it. I'm here with you. 🌸 The Support Team can see this conversation too.";
    } else {
      try {
        const currentMessages = [...messages, userMessage];
        reply = await askFamiOnline(cleanedMessage, currentMessages);
      } catch (error) {
        console.error("Fami online request failed:", error);
        const errorMessage = error instanceof Error ? error.message : String(error); reply = `Network debug: ${errorMessage}`;
      }
    }

    const delay = 3000 + Math.floor(Math.random() * 2001);

    await new Promise((resolve) => setTimeout(resolve, delay));

    const famiMessage: ChatMessage = {
      id: `fami-${Date.now()}`,
      sender: "fami",
      text: reply,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, famiMessage]);
    setThinking(false);
  };

  const handleResolveSupport = () => {
    setSupportActive(false);
    setReviewVisible(true);
    setThinking(false);
    setThinkingLabel("Thinking... ✨");
  };

  const handleSubmitReview = () => {
    if (!rating || !satisfaction) {
      return;
    }

    setReviewSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Pressable
          style={styles.profileButton}
          onPress={() => setProfileVisible(true)}
        >
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Fami</Text>
        </Pressable>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        ref={chatScrollRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <View style={styles.welcomeArea}>
            <View style={styles.avatar}>
              {famiImage ? (
                <Image
                  source={{ uri: famiImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>🌸</Text>
              )}
            </View>

            <Text style={styles.welcomeTitle}>
              Hey! I'm Fami ✨
            </Text>

            <Text style={styles.welcomeText}>
              I'm here to help you with LOOPA.
            </Text>
          </View>
        ) : null}

        {messages.map((item) => (
          <View
            key={item.id}
            style={[
              styles.messageRow,
              item.sender === "user"
                ? styles.userRow
                : styles.famiRow,
            ]}
          >
            <View style={styles.messageGroup}>
              {item.sender === "user" && selectedMessageId === item.id && !item.deleted ? (
                <View style={[styles.messageActions, styles.actionsAbove]}>
                  <Pressable style={styles.actionButton} onPress={() => handleEditMessage(item)} disabled={thinking}>
                    <Text style={styles.actionText}>✏️ Edit</Text>
                  </Pressable>
                </View>
              ) : null}
              <Pressable
                style={[
                  styles.messageBubble,
                  item.sender === "user" ? styles.userBubble : styles.famiBubble,
                ]}
                onPress={() => setSelectedMessageId((current) => current === item.id ? null : item.id)}
              >
              {item.sender === "fami" ? (
                <Text style={styles.famiLabel}>Fami 🌸</Text>
              ) : item.sender === "support" ? (
                <Text style={styles.supportLabel}>LOOPA Support Team 🛟</Text>
              ) : null}

              <Text
                style={[
                  styles.messageText,
                  item.sender === "user" && styles.userBubbleText,
                ]}
              >
                {item.text}
              </Text>

              <Text
                style={
                  item.sender === "user"
                    ? styles.userTime
                    : styles.famiTime
                }
              >
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>

              </Pressable>
              {selectedMessageId === item.id && !item.deleted ? (
                <View style={styles.messageActions}>
                  {item.sender === "user" ? (
                    <Pressable style={styles.actionButton} onPress={() => handleDeleteMessage(item.id)} disabled={thinking}>
                      <Text style={styles.actionText}>🗑️ Delete</Text>
                    </Pressable>
                  ) : item.sender === "fami" ? (
                    <>
                      <Pressable
                        style={styles.actionButton}
                        onPress={() => handleCopyMessage(item.text)}
                      >
                        <Text style={styles.actionText}>📋 Copy</Text>
                      </Pressable>
                      <Pressable
                        style={styles.actionButton}
                        onPress={() => handleForwardMessage(item.text)}
                      >
                        <Text style={styles.actionText}>↗️ Forward</Text>
                      </Pressable>
                      <Pressable style={[styles.actionButton, item.vote === "like" && styles.selectedAction]} onPress={() => handleVote(item.id, "like")}>
                        <Text style={styles.actionText}>{item.vote === "like" ? "👍 Liked" : "👍 Like"}</Text>
                      </Pressable>
                      <Pressable style={[styles.actionButton, item.vote === "dislike" && styles.selectedAction]} onPress={() => handleVote(item.id, "dislike")}>
                        <Text style={styles.actionText}>{item.vote === "dislike" ? "👎 Disliked" : "👎 Dislike"}</Text>
                      </Pressable>
                    </>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        ))}

        {thinking ? (
          <View style={[styles.messageRow, styles.famiRow]}>
            <View style={[styles.messageBubble, styles.famiBubble]}>
              <Text style={styles.famiLabel}>
                {thinkingLabel.includes("Support Team")
                  ? "LOOPA Support 🛟"
                  : "Fami 🌸"}
              </Text>
              <Text style={styles.thinkingText}>
                {thinkingLabel}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={profileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.profileOverlay}>
          <Pressable
            style={styles.profileBackdrop}
            onPress={() => setProfileVisible(false)}
          />

          <View style={styles.profileSheet}>
            <View style={styles.profileHandle} />

            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                {famiImage ? (
                  <Image
                    source={{ uri: famiImage }}
                    style={styles.profileAvatarImage}
                  />
                ) : (
                  <Text style={styles.profileAvatarText}>🌸</Text>
                )}
              </View>

              <View style={styles.profileHeaderText}>
                <Text style={styles.profileName}>Fami</Text>
                <Text style={styles.profileSubtitle}>
                  LOOPA Support Assistant
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.profileScroll}
              contentContainerStyle={styles.profileContent}
            >
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>
                  Description
                </Text>
                <Text style={styles.profileSectionText}>
                  Fami is LOOPA's support assistant. She helps users
                  understand problems, find solutions, and connect with
                  the LOOPA Support Team when human help is needed.
                </Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>
                  Memory
                </Text>
                <Text style={styles.profileSectionText}>
                  Fami remembers this conversation on this device so
                  you can leave and come back without losing your chat.
                </Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>
                  Support Team
                </Text>
                <Text style={styles.profileSectionText}>
                  Unresolved support problems can be passed to the
                  official LOOPA Support Team.
                </Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>
                  Account
                </Text>
                <Text style={styles.profileSectionText}>
                  This is an official LOOPA support conversation.
                </Text>
              </View>

              <View style={styles.membersCard}>
                <Text style={styles.profileSectionTitle}>
                  Members · 3
                </Text>

                <Text style={styles.memberText}>👤 You</Text>
                <Text style={styles.memberText}>🌸 Fami</Text>
                <Text style={styles.memberText}>
                  🛟 LOOPA Support Team
                </Text>

                <Text style={styles.privateText}>
                  🔒 Only these members can see this support
                  conversation.
                </Text>
              </View>

              <Pressable
                style={styles.closeProfileButton}
                onPress={() => setProfileVisible(false)}
              >
                <Text style={styles.closeProfileText}>Done</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {supportActive ? (
        <View style={styles.supportBar}>
          <View style={styles.supportStatus}>
            <Text style={styles.supportStatusTitle}>
              LOOPA Support Team connected ✓
            </Text>
            <Text style={styles.supportStatusText}>
              Fami and the Support Team are helping in this conversation.
            </Text>
          </View>

          <Pressable
            style={styles.resolveButton}
            onPress={handleResolveSupport}
          >
            <Text style={styles.resolveButtonText}>
              End & Resolve
            </Text>
          </Pressable>
        </View>
      ) : null}

      {reviewVisible ? (
        <View style={styles.reviewCard}>
          {!reviewSubmitted ? (
            <>
              <Text style={styles.reviewTitle}>
                Looks like everything is sorted now, senpai! ✨
              </Text>

              <Text style={styles.reviewQuestion}>
                How was your support experience?
              </Text>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    style={styles.starButton}
                    onPress={() => setRating(star)}
                  >
                    <Text style={styles.starText}>
                      {star <= rating ? "★" : "☆"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.satisfactionRow}>
                {[
                  "👍 Yes, satisfied",
                  "😐 It was okay",
                  "👎 No, not satisfied",
                ].map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.satisfactionButton,
                      satisfaction === option &&
                        styles.satisfactionButtonSelected,
                    ]}
                    onPress={() => setSatisfaction(option)}
                  >
                    <Text
                      style={[
                        styles.satisfactionText,
                        satisfaction === option &&
                          styles.satisfactionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                style={styles.feedbackInput}
                placeholder="Optional feedback..."
                placeholderTextColor="#777C8E"
                value={feedback}
                onChangeText={setFeedback}
                multiline
              />

              <Pressable
                style={[
                  styles.submitReviewButton,
                  (!rating || !satisfaction) &&
                    styles.submitReviewButtonDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={!rating || !satisfaction}
              >
                <Text style={styles.submitReviewText}>
                  Submit Review
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.reviewThanks}>
              <Text style={styles.reviewThanksText}>
                Thank you, senpai! 😂🌸
              </Text>
              <Text style={styles.reviewThanksSubtext}>
                Your feedback helps the LOOPA Support Team improve.
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
          placeholderTextColor="#777C8E"
          value={message}
          onChangeText={setMessage}
          editable={!thinking}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />

        <Pressable
          style={[
            styles.sendButton,
            thinking && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={thinking}
        >
          <Text style={styles.sendText}>{editingMessageId ? "✓" : "➤"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },

  header: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,217,255,0.22)",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 38,
  },

  smallLabel: {
    color: "#91A8D6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 1,
  },

  profileButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  headerSpacer: {
    flex: 1,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 24,
  },

  welcomeArea: {
    flex: 1,
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.34)",
    marginBottom: 20,
  },

  avatarText: {
    fontSize: 38,
  },

  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  welcomeText: {
    color: "#91A8D6",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  messageGroup: {
    maxWidth: "100%",
    alignItems: "flex-start",
  },
  messageActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    padding: 3,
    borderRadius: 14,
    backgroundColor: "rgba(16,42,131,0.24)",
  },
  actionsAbove: {
    marginTop: 0,
    marginBottom: 6,
  },
  actionButton: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(16,42,131,0.40)",
  },
  selectedAction: {
    backgroundColor: "rgba(0,217,255,0.22)",
  },
  actionText: {
    color: "#C2D4F5",
    fontSize: 11,
  },
  messageRow: {
    width: "100%",
    marginBottom: 12,
  },

  userRow: {
    alignItems: "flex-end",
  },

  famiRow: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#00D9FF",
    borderBottomRightRadius: 5,
  },

  famiBubble: {
    backgroundColor: "rgba(16,42,131,0.42)",
    borderBottomLeftRadius: 5,
  },

  famiLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  supportLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  messageText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
  },

  userBubbleText: {
    color: "#07112F",
  },

  famiTime: {
    color: "#91A8D6",
    fontSize: 10,
    marginTop: 6,
  },

  userTime: {
    color: "#666666",
    fontSize: 10,
    marginTop: 6,
  },

  thinkingText: {
    color: "#AAAAAA",
    fontSize: 15,
    fontStyle: "italic",
  },

  profileOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  profileBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  profileSheet: {
    backgroundColor: "#101014",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
    paddingTop: 10,
  },

  profileHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "#55555F",
    marginBottom: 18,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingBottom: 18,
  },

  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.34)",
    overflow: "hidden",
  },

  profileAvatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  profileAvatarText: {
    fontSize: 30,
  },

  profileHeaderText: {
    marginLeft: 14,
    flex: 1,
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  profileSubtitle: {
    color: "#91A8D6",
    fontSize: 13,
    marginTop: 4,
  },

  profileScroll: {
    flexGrow: 0,
  },

  profileContent: {
    paddingHorizontal: 22,
    paddingBottom: 28,
  },

  profileSection: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },

  profileSectionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 7,
  },

  profileSectionText: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
  },

  membersCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(16,42,131,0.40)",
  },

  memberText: {
    color: "#DDDDDD",
    fontSize: 14,
    marginTop: 8,
  },

  privateText: {
    color: "#91A8D6",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },

  closeProfileButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#00D9FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  closeProfileText: {
    color: "#07112F",
    fontSize: 15,
    fontWeight: "800",
  },

  supportBar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,217,255,0.22)",
  },

  supportStatus: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(16,42,131,0.40)",
    marginBottom: 8,
  },

  supportStatusTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  supportStatusText: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  resolveButton: {
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    marginBottom: 4,
  },

  resolveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  reviewCard: {
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#101014",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  reviewTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23,
  },

  reviewQuestion: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 6,
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  starButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  starText: {
    color: "#FFFFFF",
    fontSize: 28,
  },

  satisfactionRow: {
    marginTop: 6,
  },

  satisfactionButton: {
    minHeight: 42,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  satisfactionButtonSelected: {
    backgroundColor: "#00D9FF",
  },

  satisfactionText: {
    color: "#DDDDDD",
    fontSize: 13,
  },

  satisfactionTextSelected: {
    color: "#07112F",
    fontWeight: "800",
  },

  feedbackInput: {
    minHeight: 72,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(16,42,131,0.40)",
    fontSize: 14,
    marginTop: 10,
    textAlignVertical: "top",
  },

  submitReviewButton: {
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: "#00D9FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  submitReviewButtonDisabled: {
    opacity: 0.4,
  },

  submitReviewText: {
    color: "#07112F",
    fontSize: 14,
    fontWeight: "800",
  },

  reviewThanks: {
    alignItems: "center",
    paddingVertical: 8,
  },

  reviewThanksText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  reviewThanksSubtext: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,217,255,0.22)",
  },

  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    color: "#FFFFFF",
    backgroundColor: "rgba(16,42,131,0.34)",
    fontSize: 15,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D9FF",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendText: {
    color: "#07112F",
    fontSize: 20,
    fontWeight: "800",
  },
});
