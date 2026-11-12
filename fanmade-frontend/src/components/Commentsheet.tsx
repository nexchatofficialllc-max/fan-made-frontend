import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Modal } from "react";
import { getComments, addComment, likeComment, replyToComment, askFami, Comment } from "../lib/comments";
import WhisperSheet from "./WhisperSheet";

type Props = { visible: boolean; onClose: () => void; contentId: string; currentUserId: string };

export default function CommentsSheet({ visible, onClose, contentId, currentUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"comment" | "fami">("comment");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [whisperFor, setWhisperFor] = useState<Comment | null>(null);

  async function refresh() {
    const data = await getComments(contentId);
    setComments(data);
  }

  useEffect(() => { if (visible) refresh(); }, [visible]);

  async function handleSend() {
    if (!text.trim()) return;
    try {
      if (replyTo) await replyToComment(replyTo.id, currentUserId, text);
      else if (mode === "fami") await askFami(contentId, currentUserId, text);
      else await addComment(contentId, currentUserId, text);
      setText(""); setReplyTo(null); setMode("comment");
      refresh();
    } catch (e: any) { alert(e.message); }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No comments yet. Be first.</Text>}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.user}>{item.is_fami ? "@fami 🤖" : `@${item.author?.username ?? "Creator"}`}</Text>
                <Text style={styles.text}>{item.text}</Text>
                <View style={styles.actions}>
                  <Pressable onPress={async () => { await likeComment(item.id, currentUserId); refresh(); }}>
                    <Text style={styles.action}>❤ Like</Text>
                  </Pressable>
                  <Pressable onPress={() => { setReplyTo(item); setMode("comment"); }}>
                    <Text style={styles.action}>↩ Reply</Text>
                  </Pressable>
                  {item.author_id !== currentUserId && (
                    <Pressable onPress={() => setWhisperFor(item)}>
                      <Text style={styles.action}>Whisper</Text>
                    </Pressable>
                  )}
                </View>
                {item.replies?.map((r) => (
                  <View key={r.id} style={styles.reply}>
                    <Text style={styles.user}>↳ @{r.author?.username ?? "Creator"}</Text>
                    <Text style={styles.text}>{r.text}</Text>
                  </View>
                ))}
              </View>
            )}
          />

          {replyTo && <Text style={styles.replying}>Replying to @{replyTo.author?.username} • Tap ✕ to cancel</Text>}

          <View style={styles.modeRow}>
            <Pressable onPress={() => { setMode("comment"); setReplyTo(null); }} style={[styles.modeBtn, mode === "comment" && styles.modeActive]}>
              <Text style={[styles.modeText, mode === "comment" && styles.modeTextActive]}>💬 Comment</Text>
            </Pressable>
            <Pressable onPress={() => { setMode("fami"); setReplyTo(null); }} style={[styles.modeBtn, mode === "fami" && styles.modeActive]}>
              <Text style={[styles.modeText, mode === "fami" && styles.modeTextActive]}>🤖 Ask @fami</Text>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput value={text} onChangeText={setText} placeholder={replyTo ? "Write reply..." : mode === "fami" ? "Ask @fami..." : "Add a comment..."} placeholderTextColor="#888" style={styles.input} multiline />
            <Pressable onPress={handleSend} style={styles.sendBtn}><Text style={styles.sendText}>Send</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      {whisperFor && (
        <WhisperSheet
          visible={!!whisperFor}
          onClose={() => setWhisperFor(null)}
          commentId={whisperFor.id}
          recipientId={whisperFor.author_id}
          recipientName={whisperFor.author?.username ?? "Creator"}
          currentUserId={currentUserId}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", maxHeight: "90%", minHeight: "70%" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.15)" },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  close: { color: "#fff", fontSize: 16 },
  list: { padding: 16 },
  empty: { color: "#888", textAlign: "center", marginTop: 32 },
  comment: { marginBottom: 16 },
  user: { color: "#fff", fontWeight: "700", fontSize: 13 },
  text: { color: "#fff", fontSize: 15, marginTop: 4 },
  actions: { flexDirection: "row", gap: 16, marginTop: 8 },
  action: { color: "#aaa", fontSize: 13 },
  reply: { marginLeft: 16, marginTop: 10, borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.2)", paddingLeft: 10 },
  replying: { color: "#aaa", fontSize: 12, paddingHorizontal: 16, paddingBottom: 4 },
  modeRow: { flexDirection: "row", gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  modeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  modeActive: { backgroundColor: "#fff" },
  modeText: { color: "#fff", fontSize: 13 },
  modeTextActive: { color: "#000" },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)" },
  input: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, color: "#fff", maxHeight: 100 },
  sendBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#000", fontWeight: "700" },
});