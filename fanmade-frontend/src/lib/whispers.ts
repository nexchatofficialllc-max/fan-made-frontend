import { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";

type Props = { visible: boolean; onClose: () => void; commentId: string; recipientId: string; recipientName: string; currentUserId: string };

export default function WhisperSheet({ visible, onClose, recipientName }: Props) {
  const [text, setText] = useState("");
  function send() {
    if (!text.trim()) return;
    setText("");
    onClose();
  }
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Whisper to @{recipientName}</Text>
            <Pressable onPress={onClose}><Text style={styles.close}>Close</Text></Pressable>
          </View>
          <Text style={styles.sub}>Only you and @{recipientName} can see this whisper.</Text>
          <View style={styles.inputRow}>
            <TextInput value={text} onChangeText={setText} placeholder="Write a whisper..." placeholderTextColor="#888" style={styles.input} multiline />
            <Pressable onPress={send} style={styles.sendBtn}><Text style={styles.sendText}>Send</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.15)" },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" },
  close: { color: "#fff", fontSize: 15 },
  sub: { color: "#aaa", fontSize: 12, padding: 16 },
  inputRow: { flexDirection: "row", gap: 8, padding: 12 },
  input: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, color: "#fff", maxHeight: 100 },
  sendBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#000", fontWeight: "700" },
});