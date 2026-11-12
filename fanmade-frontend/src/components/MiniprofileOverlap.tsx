import { Modal, View, Text, Pressable, StyleSheet, Image } from "react";

type Props = { visible: boolean; onClose: () => void; authorId: string; username: string; avatarUrl?: string; fansCount: number; isFan: boolean; onToggleFan: () => void; onViewFullProfile: () => void };

export default function MiniProfileOverlay({ visible, onClose, username, avatarUrl, fansCount, isFan, onToggleFan, onViewFullProfile }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          <Image source={{ uri: avatarUrl || "https://via.placeholder.com/100" }} style={styles.avatar} />
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.fans}>{fansCount} Fans</Text>
          <Pressable onPress={onToggleFan} style={[styles.fanBtn, isFan && styles.fanActive]}>
            <Text style={[styles.fanText, isFan && styles.fanTextActive]}>{isFan ? "Fan ✓" : "Become a Fan"}</Text>
          </Pressable>
          <Pressable onPress={onViewFullProfile} style={styles.viewBtn}>
            <Text style={styles.viewText}>View Full Profile →</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 320, backgroundColor: "#111", borderRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", padding: 20, alignItems: "center" },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: "#fff" },
  username: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 12 },
  fans: { color: "#aaa", fontSize: 13, marginTop: 4 },
  fanBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginTop: 16 },
  fanActive: { backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  fanText: { color: "#000", fontWeight: "700" },
  fanTextActive: { color: "#fff" },
  viewBtn: { marginTop: 14 },
  viewText: { color: "#fff", fontWeight: "600" },
});