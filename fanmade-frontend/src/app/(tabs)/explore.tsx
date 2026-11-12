import React from "react";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useWindowDimensions } from "react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import CommentsSheet from "../../components/CommentsSheet";
import ShareSheet from "../../components/ShareSheet";
import { toggleSave } from "../../lib/saved";

const categories = ["All", "Anime", "Animation", "Drawing", "Music", "Gaming"];

const trending = [
  { id: "1", title: "LOOPA Originals", creator: "LOOPA", views: "12K views", category: "Anime", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "2", title: "Anime Art Showcase", creator: "Creators", views: "8.4K views", category: "Drawing", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "3", title: "Animation Community", creator: "Fan Creators", views: "6.1K views", category: "Animation", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
];

function DiscoverPreview({ uri, active }: { uri: string; active: boolean }) {
  const [finished, setFinished] = React.useState(false);
  const player = useVideoPlayer(uri, (videoPlayer) => { videoPlayer.loop = false; videoPlayer.muted = true; });
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (active && !finished) {
      try { player.currentTime = 0; player.play(); } catch {}
      timer = setTimeout(() => { player.pause(); setFinished(true); }, 5000);
    } else { player.pause(); }
    return () => { if (timer) clearTimeout(timer); player.pause(); };
  }, [active, finished, player]);
  return (
    <View style={styles.thumbnail}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      {!active || finished ? (
        <View style={styles.previewOverlay}>
          <Text style={styles.play}>▶</Text>
          <Text style={styles.previewLabel}>{finished ? "Preview ended · Tap to watch" : "Video preview"}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const [scrollY, setScrollY] = React.useState(0);
  const [cardLayouts, setCardLayouts] = React.useState<Record<string, { y: number; height: number }>>({});
  const [viewportHeight, setViewportHeight] = React.useState(screenHeight);

  // === Like / Comments / Share / Save — same system as Home ===
  const [currentUserId] = React.useState("current-user-id");
  const [likedIds, setLikedIds] = React.useState<string[]>([]);
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [commentsFor, setCommentsFor] = React.useState<string | null>(null);
  const [shareFor, setShareFor] = React.useState<(typeof trending)[0] | null>(null);

  const filteredTrending = trending.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.creator.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activePreviewId = filteredTrending
    .map((item) => {
      const layout = cardLayouts[item.id];
      if (!layout) return null;
      const center = layout.y + layout.height / 2;
      const visibleY = center - scrollY;
      const isVisible = visibleY >= 0 && visibleY <= viewportHeight;
      return isVisible ? { id: item.id, distance: Math.abs(visibleY - viewportHeight / 2) } : null;
    })
    .filter((item): item is { id: string; distance: number } => item !== null)
    .sort((a, b) => a.distance - b.distance)[0]?.id;

  async function handleSave(id: string) {
    try {
      const r = await toggleSave(id, currentUserId);
      setSavedIds((p) => (r.saved ? [...p, id] : p.filter((x) => x !== id)));
    } catch {
      setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)} scrollEventThrottle={100} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.header}>
            <View><Text style={styles.smallText}>DISCOVER</Text><Text style={styles.title}>Explore</Text></View>
            <View style={styles.headerIcon}><BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /><Text style={styles.icon}>✦</Text></View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(60)}>
          <View style={styles.searchBox}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput value={search} onChangeText={setSearch} placeholder="Search LOOPA" placeholderTextColor="#AAAAAA" style={styles.input} />
          </View>
        </Animated.View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)} style={[styles.category, active && styles.categoryActive]}>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        {filteredTrending.length === 0 && (
          <View style={styles.emptyState}><Text style={styles.emptyTitle}>No results found</Text><Text style={styles.emptyDescription}>Try another search or choose a different category.</Text></View>
        )}

        {filteredTrending.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInUp.duration(400).delay(100 + index * 80)}>
            {/* Card is now a View, not a button — so Like / Comments / Share / Save don't also trigger Watch */}
            <View style={styles.card}
              onLayout={(e) => { const { y, height } = e.nativeEvent.layout; setCardLayouts((p) => ({ ...p, [item.id]: { y, height } })); }}
            >
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.45)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
              {/* Tap video / title → Watch */}
              <TouchableOpacity activeOpacity={0.82} style={styles.watchArea} onPress={() => router.push({ pathname: "/watch", params: { uri: item.uri, title: item.title, creator: item.creator } })}>
                <DiscoverPreview uri={item.uri} active={activePreviewId === item.id} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.creator}>{item.creator}</Text>
                  <Text style={styles.views}>{item.views}</Text>
                  <View style={styles.cardBottom}><Text style={styles.tag}>{item.category.toUpperCase()} · DEMO</Text></View>
                </View>
              </TouchableOpacity>

              {/* Like / Comments / Share / Save — under the card info, same as Home */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setLikedIds((p) => (p.includes(item.id) ? p.filter((x) => x !== item.id) : [...p, item.id]))} style={styles.actionBtn}>
                  <Text style={styles.actionText}>{likedIds.includes(item.id) ? "❤️ Like" : "♡ Like"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCommentsFor(item.id)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>💬 Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShareFor(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>↗ Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSave(item.id)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>{savedIds.includes(item.id) ? "🔖 Saved ✓" : "📑 Save"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <View style={styles.creatorSection}>
            <Text style={styles.sectionTitle}>Creators to discover</Text>
            <View style={styles.creatorCard}>
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.45)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
              <View style={styles.avatar}><Text style={styles.avatarText}>F</Text></View>
              <View style={styles.creatorInfo}><Text style={styles.creatorName}>LOOPA Creators</Text><Text style={styles.creatorDescription}>Discover artists, animators and fans.</Text></View>
              <TouchableOpacity style={styles.followButton}><Text style={styles.followText}>View</Text></TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {commentsFor && <CommentsSheet visible={!!commentsFor} onClose={() => setCommentsFor(null)} contentId={commentsFor} currentUserId={currentUserId} />}
      {shareFor && <ShareSheet visible={!!shareFor} onClose={() => setShareFor(null)} videoId={shareFor.id} title={shareFor.title} authorName={shareFor.creator} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 12, paddingBottom: 20 },
  smallText: { color: "#AAAAAA", fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 3 },
  headerIcon: { width: 46, height: 46, borderRadius: 23, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center" },
  icon: { color: "#FFFFFF", fontSize: 21 },
  searchBox: { height: 52, borderRadius: 18, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  searchIcon: { color: "#FFFFFF", fontSize: 25, marginRight: 8 },
  input: { flex: 1, color: "#FFFFFF", fontSize: 14 },
  categories: { paddingVertical: 18, gap: 9 },
  category: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  categoryActive: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  categoryText: { color: "#AAAAAA", fontSize: 12, fontWeight: "700" },
  categoryTextActive: { color: "#000000" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, marginBottom: 14 },
  sectionTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "800" },
  seeAll: { color: "#AAAAAA", fontSize: 13 },
  card: { padding: 10, marginBottom: 12, borderRadius: 22, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  watchArea: { flexDirection: "row" },
  previewOverlay: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.38)" },
  previewLabel: { color: "#FFFFFF", fontSize: 11, fontWeight: "700", marginTop: 8, textAlign: "center" },
  thumbnail: { width: 112, height: 112, borderRadius: 18, backgroundColor: "#111111", alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  play: { color: "#FFFFFF", fontSize: 22 },
  cardInfo: { flex: 1, paddingLeft: 14, paddingVertical: 5 },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  creator: { color: "#AAAAAA", fontSize: 12, marginTop: 6 },
  views: { color: "#AAAAAA", fontSize: 11, marginTop: 6 },
  cardBottom: { marginTop: 12 },
  tag: { color: "#FFFFFF", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.12)" },
  actionBtn: { backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  actionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  creatorSection: { marginTop: 20 },
  creatorCard: { marginTop: 14, padding: 14, borderRadius: 22, flexDirection: "row", alignItems: "center", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  creatorInfo: { flex: 1, paddingHorizontal: 12 },
  creatorName: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  creatorDescription: { color: "#AAAAAA", fontSize: 11, marginTop: 4 },
  followButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(255,255,255,0.70)" },
  followText: { color: "#000000", fontSize: 11, fontWeight: "800" },
  emptyState: { paddingVertical: 28, paddingHorizontal: 18, alignItems: "center", borderRadius: 20, backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  emptyTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  emptyDescription: { color: "#AAAAAA", fontSize: 12, textAlign: "center", marginTop: 7, lineHeight: 18 },
  bottomSpace: { height: 35 },
});