import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import CommentsSheet from "../components/CommentsSheet";
import ShareSheet from "../components/ShareSheet";
import { toggleSave } from "../lib/saved";

const content = [
  { id: "1", title: "Welcome to Loopa", creator: "Loopa", description: "Create, watch and share your favorite content.", likes: 0, comments: 0 },
  { id: "2", title: "Fan Content", creator: "Creators", description: "Discover what the community is creating.", likes: 0, comments: 0 },
  { id: "3", title: "Trending Now", creator: "Loopa", description: "See what people are enjoying right now.", likes: 0, comments: 0 },
];

export default function HomeScreen() {
  const createScale = useSharedValue(1);
  const createAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createScale.value }],
  }));

  // === Like / Comments / Share / Save state — this is where everything stays ===
  const [currentUserId] = useState("current-user-id"); // Replace with your real auth uid later
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [shareFor, setShareFor] = useState<(typeof content)[0] | null>(null);

  const isLiked = (id: string) => likedIds.includes(id);
  const isSaved = (id: string) => savedIds.includes(id);

  async function handleSave(id: string) {
    try {
      const r = await toggleSave(id, currentUserId);
      setSavedIds((prev) => (r.saved ? [...prev, id] : prev.filter((x) => x !== id)));
    } catch {
      // Fallback for demo content that isn't in Supabase yet — just toggle locally
      setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.smallText}>WELCOME BACK</Text>
              <Text style={styles.logo}>LOOPA</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero — Glass */}
        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.hero}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />
            <View style={styles.glow} />
            <Text style={styles.heroTitle}>Create.{"\n"}Share.{"\n"}Belong.</Text>
            <Text style={styles.heroText}>Your community. Your creativity. Your Loopa.</Text>
            <Animated.View style={createAnimatedStyle}>
              <TouchableOpacity
                style={styles.createButton}
                onPressIn={() => { createScale.value = withSpring(0.95, { damping: 8, stiffness: 200 }); }}
                onPressOut={() => { createScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
              >
                <Text style={styles.createButtonText}>＋ Create Content</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Section */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
        </Animated.View>

        {/* Content cards — NOW WITH REAL ACTIONS */}
        {content.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInUp.duration(400).delay(120 + index * 80)}>
            <TouchableOpacity activeOpacity={0.8} style={styles.card}>
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.45)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
              <View style={styles.thumbnail}><Text style={styles.play}>▶</Text></View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.creator}>{item.creator}</Text>
                <Text style={styles.description}>{item.description}</Text>

                {/* Like / Comments / Share / Save — this replaces your fake stats row */}
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => setLikedIds((prev) => (prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]))} style={styles.actionBtn}>
                    <Text style={styles.actionText}>{isLiked(item.id) ? "❤️" : "♡"} {item.likes + (isLiked(item.id) ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setCommentsFor(item.id)} style={styles.actionBtn}>
                    <Text style={styles.actionText}>💬 Comments</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShareFor(item)} style={styles.actionBtn}>
                    <Text style={styles.actionText}>↗ Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSave(item.id)} style={styles.actionBtn}>
                    <Text style={styles.actionText}>{isSaved(item.id) ? "🔖 Saved ✓" : "📑 Save"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Overlays — they overlap the feed, you never leave Home */}
      {commentsFor && (
        <CommentsSheet visible={!!commentsFor} onClose={() => setCommentsFor(null)} contentId={commentsFor} currentUserId={currentUserId} />
      )}
      {shareFor && (
        <ShareSheet visible={!!shareFor} onClose={() => setShareFor(null)} videoId={shareFor.id} title={shareFor.title} authorName={shareFor.creator} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 12, paddingBottom: 22 },
  smallText: { color: "#AAAAAA", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  logo: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", letterSpacing: 3, marginTop: 3 },
  iconButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 19 },
  hero: { minHeight: 300, borderRadius: 30, padding: 26, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)", shadowColor: "#FFFFFF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 16, elevation: 8, justifyContent: "flex-end" },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)" },
  glow: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(255,255,255,0.10)", top: -70, right: -50 },
  heroTitle: { color: "#FFFFFF", fontSize: 40, lineHeight: 44, fontWeight: "900", letterSpacing: -1 },
  heroText: { color: "#AAAAAA", fontSize: 14, lineHeight: 21, marginTop: 15, maxWidth: 280 },
  createButton: { alignSelf: "flex-start", marginTop: 22, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(255,255,255,0.70)" },
  createButtonText: { color: "#000000", fontSize: 14, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 14 },
  sectionTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  seeAll: { color: "#AAAAAA", fontSize: 13 },
  card: { flexDirection: "row", padding: 10, marginBottom: 12, borderRadius: 22, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  thumbnail: { width: 105, height: 115, borderRadius: 17, backgroundColor: "#111111", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  play: { color: "#FFFFFF", fontSize: 22 },
  cardInfo: { flex: 1, paddingLeft: 14, paddingVertical: 5 },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  creator: { color: "#AAAAAA", fontSize: 12, marginTop: 5 },
  description: { color: "#AAAAAA", fontSize: 12, lineHeight: 17, marginTop: 7 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  actionBtn: { backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  actionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  bottomSpace: { height: 30 },
});