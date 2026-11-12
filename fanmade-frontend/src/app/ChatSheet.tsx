import { useState } from "react";
import { Modal, View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type Message = { id: string; fromMe: boolean; text: string; time: string };
type Props = { visible: boolean; onClose: () => void; friendName: string };

export default function ChatSheet({ visible, onClose, friendName }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", fromMe: false, text: "Hey! Saw your loop 🔥", time: "10:12" },
    { id: "2", fromMe: true, text: "Thank you! Made a new one too", time: "10:14" },
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: Date.now().toString(), fromMe: true, text: text.trim(), time: "Now" }]);
    setText("");
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          {/* Glass background */}
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.topReflection} pointerEvents="none" />

          <View style={styles.header}>
            <Pressable onPress={onClose}><Text style={styles.back}>‹ Back</Text></Pressable>
            <View style={styles.headerCenter}>
              <Text style={styles.name}>{friendName}</Text>
              <Text style={styles.e2ee}>🔒 End-to-End Encrypted</Text>
            </View>
            <View style={{ width: 50 }} />
          </View>

          <FlatList data={messages} keyExtractor={(m) => m.id} contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.fromMe ? styles.mine : styles.theirs]}>
                <Text style={[styles.bubbleText, item.fromMe ? styles.mineText : styles.theirsText]}>{item.text}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput value={text} onChangeText={setText} placeholder="Message..." placeholderTextColor="#888" style={styles.input} multiline />
            <Pressable onPress={send} style={styles.sendBtn}><Text style={styles.sendText}>Send</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "rgba(0,0,0,0.35)", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", overflow: "hidden", maxHeight: "92%", minHeight: "85%" },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)", zIndex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.15)" },
  back: { color: "#fff", fontSize: 16 },
  headerCenter: { alignItems: "center" },
  name: { color: "#fff", fontSize: 17, fontWeight: "700" },
  e2ee: { color: "#aaa", fontSize: 11, marginTop: 2 },
  list: { padding: 16 },
  bubble: { maxWidth: "80%", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginBottom: 8 },
  mine: { alignSelf: "flex-end", backgroundColor: "#fff" },
  theirs: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  bubbleText: { fontSize: 15 },
  mineText: { color: "#000" },
  theirsText: { color: "#fff" },
  time: { fontSize: 10, color: "#888", marginTop: 4, textAlign: "right" },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)" },
  input: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, color: "#fff", maxHeight: 100 },
  sendBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#000", fontWeight: "700" },
});