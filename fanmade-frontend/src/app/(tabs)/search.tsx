import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Real searchable data — same LOOPA content as Home + Explore
const allContent = [
  { id: "v1", type: "Video", title: "LOOPA Originals", creator: "LOOPA", category: "Anime", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "v2", type: "Video", title: "Anime Art Showcase", creator: "Creators", category: "Drawing", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "v3", type: "Video", title: "Animation Community", creator: "Fan Creators", category: "Animation", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "v4", type: "Video", title: "Your first LOOPA video", creator: "LOOPA Creator", category: "Anime", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "v5", type: "Video", title: "More content coming", creator: "LOOPA Creator", category: "Anime", uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
];

const allCreators = [
  { id: "c1", name: "LOOPA", handle: "@loopa", bio: "Official LOOPA" },
  { id: "c2", name: "LOOPA Creators", handle: "@loopacreators", bio: "Artists, animators and fans" },
  { id: "c3", name: "jake.loopa", handle: "@jake.loopa", bio: "Makes loops" },
  { id: "c4", name: "sunpathwalker", handle: "@sunpathwalker", bio: "Calm strolls" },
  { id: "c5", name: "danceflow_", handle: "@danceflow_", bio: "Dance loops" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filteredVideos = isSearching
    ? allContent.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.creator.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      )
    : allContent;

  const filteredCreators = isSearching
    ? allCreators.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q)
      )
    : allCreators;

  const hasResults = filteredVideos.length > 0 || filteredCreators.length > 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <View style={[styles.content, { paddingBottom: 120 + insets.bottom }]}>
        <View>
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Search</Text>
        </View>

        <View>
          <View style={styles.searchBox}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.18)",
                "rgba(255,255,255,0.05)",
                "rgba(0,0,0,0.55)",
              ]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} pointerEvents="none" />
            <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search LOOPA"
              placeholderTextColor="#888888"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={10}>
                <MaterialCommunityIcons name="close-circle" size={22} color="#AAAAAA" />
              </Pressable>
            )}
          </View>
        </View>

        {!isSearching && (
          <Text style={styles.hint}>Search creators, videos, posts and more.</Text>
        )}

        <ScrollView showsVerticalScrollIndicator={false} style={styles.results}>
          {isSearching && !hasResults && (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="magnify" size={32} color="#FFFFFF" />
              <Text style={styles.emptyTitle}>No results for "{query}"</Text>
              <Text style={styles.emptyText}>Try another name, title or category like Anime, Drawing or Animation.</Text>
            </View>
          )}

          {filteredCreators.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{isSearching ? "Creators" : "Creators to discover"}</Text>
              {filteredCreators.map((c) => (
                <Pressable key={c.id} style={styles.creatorCard} onPress={() => router.push("/profile")}>
                  <View style={styles.creatorAvatar}>
                    <Text style={styles.creatorAvatarText}>{c.name[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.creatorInfo}>
                    <Text style={styles.creatorName}>{c.name}</Text>
                    <Text style={styles.creatorHandle}>{c.handle} • {c.bio}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#AAAAAA" />
                </Pressable>
              ))}
            </>
          )}

          {filteredVideos.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{isSearching ? "Videos" : "Trending videos"}</Text>
              {filteredVideos.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.videoCard}
                  onPress={() => router.push({ pathname: "/watch", params: { uri: item.uri, title: item.title, creator: item.creator } })}
                >
                  <View style={styles.videoThumb}>
                    <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{item.title}</Text>
                    <Text style={styles.videoMeta}>{item.creator} • {item.category}</Text>
                    <Text style={styles.videoTag}>{item.type.toUpperCase()}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#AAAAAA" />
                </Pressable>
              ))}
            </>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  smallLabel: {
    color: "#AAAAAA",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 24,
  },
  searchBox: {
    height: 52,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  hint: {
    color: "#AAAAAA",
    fontSize: 13,
    marginTop: 12,
  },
  results: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 10,
  },
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  creatorAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  creatorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  creatorName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  creatorHandle: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 3,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  videoThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  videoMeta: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 4,
  },
  videoTag: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 6,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
  query: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  bottomSpace: { height: 20 },
});