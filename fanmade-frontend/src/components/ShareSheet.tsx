import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Share as RNShare, Clipboard } from "react-native";

type Props = {
  visible: boolean;
  videoId: string;
  videoTitle: string;
  creatorUsername: string;
  onClose: () => void;
  onShareToHeylo: (friendId: string) => void;
  friends: { id: string; username: string }[];
};

export function ShareSheet({ visible, videoId, videoTitle, creatorUsername, onClose, onShareToHeylo, friends }: Props) {
  const [copied, setCopied] = useState(false);
  if (!visible) return null;

  const link = `https://loopa.app/video/${videoId}`;

  const copyLink = async () => {
    Clipboard.setString(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareOutside = async () => {
    await RNShare.share({ message: `${videoTitle} — @${creatorUsername} on Loopa\n${link}` });
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={styles.dismiss} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Share</Text>
        <Text style={styles.subtitle}>{videoTitle} • @{creatorUsername}</Text>

        {/* Copy Link */}
        <Pressable style={styles.row} onPress={copyLink}>
          <Text style={styles.rowIcon}>🔗</Text>
          <View><Text style={styles.rowTitle}>{copied ? "Copied!" : "Copy Link"}</Text><Text style={styles.rowSub}>{link}</Text></View>
        </Pressable>

        {/* Outside Loopa */}
        <Pressable style={styles.row} onPress={shareOutside}>
          <Text style={styles.rowIcon}>↗</Text>
          <View><Text style={styles.rowTitle}>Share Outside Loopa</Text><Text style={styles.rowSub}>WhatsApp, X, Messages...</Text></View>
        </Pressable>

        {/* Heylo */}
        <Text style={styles.section}>Share to Heylo</Text>
        {friends.map(f => (
          <Pressable key={f.id} style={styles.row} onPress={() => onShareToHeylo(f.id)}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{f.username[0]?.toUpperCase()}</Text></View>
            <Text style={styles.rowTitle}>@{f.username}</Text>
            <Text style={styles.send}>Send →</Text>
          </Pressable>
        ))}
        {friends.length === 0 && <Text style={styles.empty}>No Heylo friends yet.</Text>}

        <Pressable style={styles.closeBtn} onPress={onClose}><Text style={styles.closeText}>Close</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, justifyContent: "flex-end", zIndex: 50 },
  dismiss: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "rgba(20,20,20,0.92)", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 32, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)", alignSelf: "center", marginBottom: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4, marginBottom: 16 },
  section: { color: "#fff", fontSize: 14, fontWeight: "600", marginTop: 18, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  rowIcon: { fontSize: 20 },
  rowTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  rowSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#000", fontWeight: "700" },
  send: { color: "#fff", marginLeft: "auto", fontWeight: "600" },
  empty: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8 },
  closeBtn: { marginTop: 18, backgroundColor: "#fff", borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  closeText: { color: "#000", fontWeight: "700" },
});