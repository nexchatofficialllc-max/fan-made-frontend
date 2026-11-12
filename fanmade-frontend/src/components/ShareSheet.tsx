import { Modal, View, Text, Pressable, StyleSheet, Share } from "react";

type Props = { visible: boolean; onClose: () => void; videoId: string; title: string; authorName: string };

export default function ShareSheet({ visible, onClose, videoId, title, authorName }: Props) {
  const link = `https://loopa.app/watch/${videoId}`;

  async function shareToHeylo() {
    // Heylo share = send link as Heylo message, same account
    alert(`Shared to Heylo: ${title} by @${authorName}`);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Share this loop</Text>
          <Text style={styles.sub}>@{authorName} • {title}</Text>

          <Pressable style={styles.row} onPress={() => Share.share({ message: `${title} by @${authorName} — ${link}` })}>
            <Text style={styles.rowIcon}>🔗</Text><Text style={styles.rowText}>Copy Link</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={shareToHeylo}>
            <Text style={styles.rowIcon}>💬</Text><Text style={styles.rowText}>Share to Heylo</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={() => Share.share({ message: link })}>
            <Text style={styles.rowIcon}>↗</Text><Text style={styles.rowText}>Share Outside Loopa</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", padding: 16, paddingBottom: 32 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)", alignSelf: "center", marginBottom: 12 },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  sub: { color: "#aaa", fontSize: 13, marginTop: 4, marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: 16, padding: 14, marginBottom: 8 },
  rowIcon: { fontSize: 18 },
  rowText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});