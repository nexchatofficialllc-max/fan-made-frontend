import { useEffect, useState } from "react";
import { Modal, View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react";
import { getWhisperConversation, sendWhisper, MAX_WHISPER_MESSAGES, Whisper } from "../lib/whispers";

type Props = {
  visible: boolean;
  onClose: () => void;
  commentId: string;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
};

export default function WhisperSheet({ visible, onClose, commentId, recipientId, recipientName, currentUserId }: Props) {
  const [messages, setMessages] = useState<Whisper[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = MAX_WHISPER_MESSAGES - messages.length;
  const isFull = remaining <= 0;

  useEffect(() => {
    if (!visible) return;
    getWhisperConversation(commentId, currentUserId, recipientId).then(setMessages).catch(() => {});
  }, [visible, commentId]);

  async function handleSend() {
    if (!text.trim() || isFull) return;
    setLoading(true);
    try {
      const { message } = await sendWhisper(commentId, currentUserId, recipientId, text);
      setMessages((prev) => [...prev, message]);
      setText("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Whisper to {recipientName}</Text>
              <Text style={styles.subtitle}>Private • Only you two can see this • {remaining} / {MAX_WHISPER_MESSAGES} left</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No whispers yet. Say something private.</Text>}
            renderItem={({ item }) => {
              const isMine = item.sender_id === currentUserId;
              return (
                <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
                  <Text style={[styles.bubbleText, isMine ? styles.mineText : styles.theirsText]}>{item.text}</Text>
                </View>
              );
            }}
          />

          {isFull ? (
            <View style={styles.limitBox}>
              <Text style={styles.limitText}>This Whisper hit 20 messages.</Text>
              <Text style={styles.limitSub}>Continue in Heylo to keep chatting.</Text>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Whisper something private..."
                placeholderTextColor="#888"
                style={styles.input}
                maxLength={500}
                multiline
              />
              <Pressable onPress={handleSend} disabled={loading || !text.trim()} style={[styles.sendBtn, !text.trim() && styles.sendDisabled]}>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", maxHeight: "85%", minHeight: "60%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.15)" },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  subtitle: { color: "#aaa", fontSize: 12, marginTop: 4 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  closeText: { color: "#fff", fontSize: 14 },
  list: { padding: 16 },
  empty: { color: "#888", textAlign: "center", marginTop: 32 },
  bubble: { maxWidth: "80%", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginBottom: 8 },
  mine: { alignSelf: "flex-end", backgroundColor: "#fff" },
  theirs: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  bubbleText: { fontSize: 15 },
  mineText: { color: "#000" },
  theirsText: { color: "#fff" },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)" },
  input: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, color: "#fff", maxHeight: 100 },
  sendBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendDisabled: { opacity: 0.4 },
  sendText: { color: "#000", fontWeight: "700" },
  limitBox: { padding: 16, alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)" },
  limitText: { color: "#fff", fontWeight: "700" },
  limitSub: { color: "#aaa", marginTop: 4 },
});