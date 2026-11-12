import React from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const DEMO_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const recommendations = [
  { id: "rec-1", title: "Amazing Anime Fight Animation", creator: "AnotherCreator", views: "8.4K views", uri: DEMO_VIDEO },
  { id: "rec-2", title: "My First Original Anime", creator: "FanCreator", views: "5.2K views", uri: DEMO_VIDEO },
  { id: "rec-3", title: "Anime Art Showcase", creator: "LOOPA Creator", views: "3.1K views", uri: DEMO_VIDEO },
];

const INITIAL_COMMENTS = [
  { id: "c1", user: "@maya", text: "This fight scene is insane 🔥", likes: 42, liked: false },
  { id: "c2", user: "@fami", text: "Fami here — this creator uses fast cuts + strong key poses. Want similar creators?", likes: 18, liked: false, isFami: true },
  { id: "c3", user: "@kofi", text: "Looping this all day", likes: 9, liked: false },
];

export default function WatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri?: string; title?: string; creator?: string }>();

  const uri = typeof params.uri === "string" ? params.uri : "";
  const title = typeof params.title === "string" ? params.title : "Video";
  const creator = typeof params.creator === "string" ? params.creator : "LOOPA Creator";

  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(1240);
  const [saved, setSaved] = React.useState(false);
  const [isFan, setIsFan] = React.useState(false);
  const [showComments, setShowComments] = React.useState(true);
  const [showDesc, setShowDesc] = React.useState(false);
  const [comments, setComments] = React.useState(INITIAL_COMMENTS);
  const [commentText, setCommentText] = React.useState("");
  const [doubleTapHeart, setDoubleTapHeart] = React.useState(false);
  const lastTap = React.useRef(0);

  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = false;
  });

  React.useEffect(() => {
    if (uri) player.play();
    return () => player.pause();
  }, [player, uri]);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleVideoTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double-tap = Like
      if (!liked) toggleLike();
      setDoubleTapHeart(true);
      setTimeout(() => setDoubleTapHeart(false), 800);
    }
    lastTap.current = now;
  };

  const openRecommendation = (item: (typeof recommendations)[number]) => {
    player.pause();
    router.replace({ pathname: "/watch", params: { uri: item.uri, title: item.title, creator: item.creator } });
  };

  const shareVideo = async () => {
    try { await Share.share({ message: `${title} — by @${creator} on LOOPA` }); } catch {}
  };

  const postComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [{ id: `c-${Date.now()}`, user: "@you", text, likes: 0, liked: false }, ...prev]);
    setCommentText("");
  };

  const askFami = () => {
    setComments((prev) => [
      { id: `fami-${Date.now()}`, user: "@fami", text: `Fami here — "${title}" is by @${creator}. This is anime / animation style with high energy cuts. Want me to find similar loops?`, likes: 0, liked: false, isFami: true },
      ...prev,
    ]);
    setShowComments(true);
  };

  const likeComment = (id: string) => {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.backButton}>
            <Text style={styles.backText}>‹  Back</Text>
          </Pressable>
          <Text style={styles.brand}>LOOPA</Text>
          <Pressable onPress={askFami} style={styles.famiTop}><Text style={styles.famiTopText}>@fami</Text></Pressable>
        </View>

        <Pressable onPress={handleVideoTap} style={styles.videoArea}>
          {uri ? (
            <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls />
          ) : (
            <View style={styles.noVideo}><Text style={styles.info}>This video has no playable URL yet.</Text></View>
          )}
          {doubleTapHeart && (
            <View style={styles.bigHeart}><Text style={styles.bigHeartText}>♥</Text></View>
          )}
          <View style={styles.loopBadge}><Text style={styles.loopBadgeText}>↻ LOOP</Text></View>
        </Pressable>

        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>12K views • 1.2K likes • Loopa</Text>

          <Pressable onPress={() => setShowDesc((v) => !v)} style={styles.descBox}>
            <Text style={styles.descText} numberOfLines={showDesc ? undefined : 2}>
              Anime & animation loop by @{creator}. Double-tap video to like. Tap @fami in comments to ask anything about this video. {showDesc ? "Full description: This loop was made for Loopa fans who love fast anime fights, clean key poses and replayable moments. Fan this creator to see more in your feed." : ""}
            </Text>
            <Text style={styles.moreText}>{showDesc ? "Show less" : "More..."}</Text>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable onPress={toggleLike} style={[styles.action, styles.glass, liked && styles.actionSelected]}>
              <Text style={styles.actionText}>{liked ? "♥" : "♡"} {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}</Text>
            </Pressable>
            <Pressable onPress={() => setShowComments((v) => !v)} style={[styles.action, styles.glass, showComments && styles.actionSelected]}>
              <Text style={styles.actionText}>▤ Comments • {comments.length}</Text>
            </Pressable>
            <Pressable onPress={() => setSaved((v) => !v)} style={[styles.action, styles.glass, saved && styles.actionSelected]}>
              <Text style={styles.actionText}>{saved ? "▣ Saved" : "▢ Save"}</Text>
            </Pressable>
            <Pressable onPress={shareVideo} style={[styles.action, styles.glass]}>
              <Text style={styles.actionText}>↗ Share</Text>
            </Pressable>
          </View>

          <View style={styles.creatorRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{creator.trim().charAt(0).toUpperCase() || "L"}</Text></View>
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>@{creator}</Text>
              <Text style={styles.creatorSubtitle}>Anime & animation creator • 12.4k Fans</Text>
            </View>
            <Pressable onPress={() => setIsFan((v) => !v)} style={[styles.fanButton, isFan && styles.fanningButton]}>
              <Text style={[styles.fanText, isFan && styles.fanningText]}>{isFan ? "✓ Fan" : "+ Fan"}</Text>
            </Pressable>
          </View>

          {showComments && (
            <View style={styles.commentsPanel}>
              <View style={styles.commentsHeader}>
                <Text style={styles.sectionTitle}>Comments • {comments.length}</Text>
                <Pressable onPress={askFami} style={styles.askFami}><Text style={styles.askFamiText}>Ask @fami</Text></Pressable>
              </View>

              <View style={styles.commentInputRow}>
                <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>Y</Text></View>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Add a comment..."
                  placeholderTextColor="#AAAAAA"
                  style={styles.commentInput}
                  onSubmitEditing={postComment}
                  returnKeyType="send"
                />
                <Pressable onPress={postComment} style={[styles.sendBtn, !commentText.trim() && styles.sendDisabled]}>
                  <Text style={styles.sendText}>Send</Text>
                </Pressable>
              </View>

              {comments.map((c) => (
                <View key={c.id} style={[styles.comment, c.isFami && styles.famiComment]}>
                  <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{c.user[1]?.toUpperCase() || "U"}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commentUser}>{c.user} {c.isFami ? <Text style={styles.famiTag}>• FAMI</Text> : null}</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                    <Pressable onPress={() => likeComment(c.id)}><Text style={styles.commentLike}>{c.liked ? "♥" : "♡"} {c.likes} • Reply</Text></Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.muted}>Discover more anime, animation and fan creations.</Text>

          {recommendations.map((item) => (
            <Pressable key={item.id} onPress={() => openRecommendation(item)} style={styles.recommendation}>
              <View style={styles.thumbnail}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(0,0,0,0.55)"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.thumbnailLabel}>LOOPA</Text>
                <Text style={styles.thumbnailPlay}>▶</Text>
              </View>
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>{item.title}</Text>
                <Text style={styles.muted}>@{item.creator}</Text>
                <Text style={styles.muted}>{item.views}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  page: { paddingBottom: 28 },
  topBar: { minHeight: 52, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { paddingVertical: 10, paddingRight: 12 },
  backText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  brand: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  famiTop: { backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  famiTopText: { color: "#000000", fontSize: 12, fontWeight: "800" },
  videoArea: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000000", overflow: "hidden", position: "relative" },
  noVideo: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  info: { color: "#FFFFFF", textAlign: "center" },
  bigHeart: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  bigHeartText: { color: "#FFFFFF", fontSize: 90 },
  loopBadge: { position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(0,0,0,0.6)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  loopBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  details: { paddingHorizontal: 16, paddingTop: 16 },
  title: { color: "#FFFFFF", fontSize: 21, fontWeight: "800" },
  meta: { color: "#AAAAAA", fontSize: 12, marginTop: 7 },
  descBox: { marginTop: 12, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 14, padding: 12 },
  descText: { color: "#FFFFFF", fontSize: 13, lineHeight: 19 },
  moreText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800", marginTop: 6 },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16, marginBottom: 20 },
  action: { borderRadius: 22, paddingHorizontal: 12, paddingVertical: 10 },
  glass: { backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", overflow: "hidden" },
  actionSelected: { backgroundColor: "#FFFFFF" },
  actionText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  creatorRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#000000", fontSize: 18, fontWeight: "800" },
  creatorInfo: { flex: 1 },
  creatorName: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  creatorSubtitle: { color: "#AAAAAA", fontSize: 11, marginTop: 4 },
  fanButton: { backgroundColor: "#FFFFFF", borderRadius: 22, paddingHorizontal: 17, paddingVertical: 10 },
  fanText: { color: "#000000", fontSize: 12, fontWeight: "800" },
  fanningButton: { backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  fanningText: { color: "#FFFFFF" },
  commentsPanel: { marginTop: 8, padding: 14, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", gap: 12 },
  commentsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  askFami: { backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  askFamiText: { color: "#000000", fontSize: 11, fontWeight: "800" },
  commentInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  miniAvatarText: { color: "#000000", fontSize: 14, fontWeight: "900" },
  commentInput: { flex: 1, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9, color: "#FFFFFF", fontSize: 13 },
  sendBtn: { backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999 },
  sendDisabled: { opacity: 0.4 },
  sendText: { color: "#000000", fontSize: 12, fontWeight: "800" },
  comment: { flexDirection: "row", gap: 10, paddingTop: 4 },
  famiComment: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  commentUser: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  famiTag: { color: "#AAAAAA", fontSize: 10 },
  commentText: { color: "#FFFFFF", fontSize: 13, lineHeight: 18, marginTop: 3 },
  commentLike: { color: "#AAAAAA", fontSize: 11, marginTop: 4, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 18 },
  sectionTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginBottom: 6 },
  muted: { color: "#AAAAAA", fontSize: 12, lineHeight: 18 },
  recommendation: { flexDirection: "row", gap: 12, marginTop: 16 },
  thumbnail: { width: "44%", aspectRatio: 16 / 9, borderRadius: 12, overflow: "hidden", backgroundColor: "#000000", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", alignItems: "center", justifyContent: "center" },
  thumbnailLabel: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  thumbnailPlay: { color: "#FFFFFF", fontSize: 14, marginTop: 4 },
  recommendationInfo: { flex: 1, justifyContent: "center", gap: 4 },
  recommendationTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", lineHeight: 19 },
});