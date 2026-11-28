import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

type Props = { visible?: boolean; onClose?: () => void };

export default function ShareSheet({ visible = false, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <Text style={styles.title}>Share this Loop</Text>
          <Text style={styles.sub}>By Loop Studio — Loopa</Text>
          <Pressable style={styles.btn} onPress={onClose}><Text style={styles.btnText}>Copy Link</Text></Pressable>
          <Pressable style={styles.btn} onPress={onClose}><Text style={styles.btnText}>Share to Heylo</Text></Pressable>
          <Pressable onPress={onClose}><Text style={styles.close}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "rgba(0,0,0,0.35)", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", overflow: "hidden", padding: 20, gap: 12 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", textAlign: "center" },
  sub: { color: "#aaa", fontSize: 12, textAlign: "center" },
  btn: { backgroundColor: "#fff", borderRadius: 20, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#000", fontWeight: "700" },
  close: { color: "#fff", textAlign: "center", marginTop: 6 },
});