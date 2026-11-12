import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react";
import CommentsSheet from "./CommentsSheet";
import ShareSheet from "./ShareSheet";
import { toggleSave } from "../lib/saved";

type Props = {
  videoId: string;
  title: string;
  authorId: string;
  authorName: string;
  currentUserId: string;
  likesCount: number;
  commentsCount: number;
};

export default function VideoActions({ videoId, title, authorId, authorName, currentUserId, likesCount, commentsCount }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <View style={styles.column}>
      {/* Like */}
      <Pressable onPress={() => setLiked(!liked)} style={styles.btn}>
        <Text style={styles.icon}>{liked ? "❤️" : "🤍"}</Text>
        <Text style={styles.count}>{likesCount + (liked ? 1 : 0)}</Text>
        <Text style={styles.label}>Like</Text>
      </Pressable>

      {/* Comments — opens CommentsSheet */}
      <Pressable onPress={() => setCommentsOpen(true)} style={styles.btn}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{commentsCount}</Text>
        <Text style={styles.label}>Comments</Text>
      </Pressable>

      {/* Share — opens ShareSheet */}
      <Pressable onPress={() => setShareOpen(true)} style={styles.btn}>
        <Text style={styles.icon}>↗</Text>
        <Text style={styles.label}>Share</Text>
      </Pressable>

      {/* Save */}
      <Pressable
        onPress={async () => {
          const r = await toggleSave(videoId, currentUserId);
          setSaved(r.saved);
        }}
        style={styles.btn}
      >
        <Text style={styles.icon}>{saved ? "🔖" : "📑"}</Text>
        <Text style={styles.label}>{saved ? "Saved ✓" : "Save"}</Text>
      </Pressable>

      <CommentsSheet visible={commentsOpen} onClose={() => setCommentsOpen(false)} contentId={videoId} currentUserId={currentUserId} />
      <ShareSheet visible={shareOpen} onClose={() => setShareOpen(false)} videoId={videoId} title={title} authorName={authorName} />
    </View>
  );
}

const styles = StyleSheet.create({
  column: { position: "absolute", right: 12, bottom: 120, gap: 12, alignItems: "center" },
  btn: { backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center", minWidth: 64 },
  icon: { fontSize: 20 },
  count: { color: "#fff", fontSize: 12, fontWeight: "700", marginTop: 2 },
  label: { color: "#fff", fontSize: 11, marginTop: 2 },
});