import { useVideoPlayer, VideoView } from "expo-video";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import CommentsSheet from "../../components/CommentsSheet";
import ShareSheet from "../../components/ShareSheet";
import { toggleSave } from "../../lib/saved";

type HomeMode = "forYou" | "library" | "creators";

const TEST_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const videos = [
  {
    id: "demo-1",
    uri: TEST_VIDEO,
    creator: "LOOPA Creator",
    title: "Your first LOOPA video",
    description: "Video feed preview",
  },
  {
    id: "demo-2",
    uri: TEST_VIDEO,
    creator: "LOOPA Creator",
    title: "More content coming",
    description: "This will later come from LOOPA content.",
  },
];

const libraryItems = [
  { id: "lib-1", title: "My First Comic", author: "LOOPA Creator", pages: "24 pages", kind: "Comic" },
  { id: "lib-2", title: "A Small Book", author: "Fan Creator", pages: "48 pages", kind: "Book" },
];

function FeedVideo({
  item,
  active,
  isLiked,
  isSaved,
  onLike,
  onComment,
  onShare,
  onSave,
  bottomOffset,
}: {
  item: (typeof videos)[number];
  active: boolean;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  bottomOffset: number;
}) {
  const player = useVideoPlayer(item.uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  useEffect(() => {
    if (active) {
      player.play();
    } else {
      player.pause();
    }
  }, [active, player]);

  return (
    <View style={styles.videoPage}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      <View style={styles.darkOverlay} />

      <View style={[styles.videoInfo, { bottom: 105 + bottomOffset }]}>
        <Text style={styles.creator}>@{item.creator}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Like / Comment / Share / Save — clean icons, no emojis */}
      <View style={[styles.actions, { bottom: 120 + bottomOffset }]}>
        <Pressable style={styles.actionButton} onPress={onLike}>
          <View style={[styles.glassAction, isLiked && styles.glassActionActive]}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <MaterialCommunityIcons name={isLiked ? "heart" : "heart-outline"} size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onComment}>
          <View style={styles.glassAction}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <MaterialCommunityIcons name="message-text-outline" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onShare}>
          <View style={styles.glassAction}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <MaterialCommunityIcons name="share-variant-outline" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onSave}>
          <View style={[styles.glassAction, isSaved && styles.glassActionActive]}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <MaterialCommunityIcons name={isSaved ? "bookmark" : "bookmark-outline"} size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>{isSaved ? "Saved" : "Save"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<HomeMode>("forYou");
  const [activeIndex, setActiveIndex] = useState(0);

  const [currentUserId] = useState("current-user-id");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [shareFor, setShareFor] = useState<(typeof videos)[number] | null>(null);

  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const firstVisible = viewableItems[0];
      if (firstVisible?.index != null) {
        setActiveIndex(firstVisible.index);
      }
    }
  ).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  async function handleSave(id: string) {
    try {
      const r = await toggleSave(id, currentUserId);
      setSavedIds((p) => (r.saved ? [...p, id] : p.filter((x) => x !== id)));
    } catch {
      setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    }
  }

  return (
    <View style={styles.container}>
      {mode === "library" ? (
        <View style={[styles.libraryPage, { height }]}>
          <Text style={styles.libraryLabel}>LIBRARY</Text>
          <Text style={styles.libraryTitle}>Library</Text>
          <Text style={styles.libraryText}>
            Comics, books and stories will open in its own vertical reader here.
          </Text>
          <Text style={styles.libraryHint}>
            Share your comic or book in Library. LOOPA content will connect here later.
          </Text>

          <View style={styles.libraryList}>
            {libraryItems.map((book) => (
              <View key={book.id} style={styles.libraryCard}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.45)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
                <View style={styles.libraryIcon}>
                  <MaterialCommunityIcons name="book-open-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.libraryInfo}>
                  <Text style={styles.libraryCardTitle}>{book.title}</Text>
                  <Text style={styles.libraryCardMeta}>{book.author} • {book.pages}</Text>
                  <Text style={styles.libraryCardKind}>{book.kind.toUpperCase()}</Text>
                </View>
                <Pressable style={styles.libraryShare} onPress={() => setShareFor({ id: book.id, uri: TEST_VIDEO, creator: book.author, title: book.title, description: book.pages } as any)}>
                  <MaterialCommunityIcons name="share-variant-outline" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ) : mode === "creators" ? (
        <View style={[styles.libraryPage, { height }]}>
          <Text style={styles.libraryLabel}>CREATORS</Text>
          <Text style={styles.libraryTitle}>Creators</Text>
          <Text style={styles.libraryText}>
            Discover LOOPA creators here when the creator feed is connected.
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <FeedVideo
              item={item}
              active={index === activeIndex}
              isLiked={likedIds.includes(item.id)}
              isSaved={savedIds.includes(item.id)}
              onLike={() => setLikedIds((p) => (p.includes(item.id) ? p.filter((x) => x !== item.id) : [...p, item.id]))}
              onComment={() => setCommentsFor(item.id)}
              onShare={() => setShareFor(item)}
              onSave={() => handleSave(item.id)}
              bottomOffset={insets.bottom}
            />
          )}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />
      )}

      <SafeAreaView pointerEvents="box-none" style={styles.uiLayer} edges={["top"]}>
        <View>
          <View style={styles.topBar}>
            <View style={styles.topTabs}>
              <Pressable
                style={[styles.topTabButton, mode === "forYou" && styles.topTabActive]}
                onPress={() => setMode("forYou")}
                accessibilityRole="button"
                accessibilityLabel="For You"
                hitSlop={8}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <MaterialCommunityIcons
                  name="home-outline"
                  size={27}
                  color={mode === "forYou" ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
                />
              </Pressable>

              <Pressable
                style={[styles.topTabButton, mode === "library" && styles.topTabActive]}
                onPress={() => setMode("library")}
                accessibilityRole="button"
                accessibilityLabel="Library"
                hitSlop={8}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <MaterialCommunityIcons
                  name="library"
                  size={27}
                  color={mode === "library" ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
                />
              </Pressable>

              <Pressable
                style={[styles.topTabButton, mode === "creators" && styles.topTabActive]}
                onPress={() => setMode("creators")}
                accessibilityRole="button"
                accessibilityLabel="Creators"
                hitSlop={8}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={29}
                  color={mode === "creators" ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.searchButton}
              onPress={() => router.push("/search")}
              accessibilityRole="button"
              accessibilityLabel="Search LOOPA"
              hitSlop={10}
            >
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <MaterialCommunityIcons name="magnify" size={29} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {commentsFor && <CommentsSheet visible={!!commentsFor} onClose={() => setCommentsFor(null)} contentId={commentsFor} currentUserId={currentUserId} />}
      {shareFor && <ShareSheet visible={!!shareFor} onClose={() => setShareFor(null)} videoId={shareFor.id} title={shareFor.title} authorName={shareFor.creator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  videoPage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    position: "relative",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  uiLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingLeft: 18,
    paddingRight: 12,
    backgroundColor: "transparent",
  },
  topTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topTabButton: {
    minWidth: 42,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topTabActive: {
    borderColor: "rgba(255,255,255,0.70)",
    backgroundColor: "rgba(255,255,255,0.18)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
  searchButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 15,
  },
  videoInfo: {
    position: "absolute",
    left: 18,
    right: 90,
    bottom: 105,
  },
  creator: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  description: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
  },
  actions: {
    position: "absolute",
    right: 12,
    bottom: 120,
    alignItems: "center",
    gap: 18,
  },
  actionButton: {
    alignItems: "center",
    minWidth: 58,
  },
  glassAction: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  glassActionActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(255,255,255,0.60)",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 68,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
  },
  navIcon: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 22,
  },
  navText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },
  activeNav: {
    color: "#FFFFFF",
  },
  libraryPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#000000",
  },
  libraryLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
  },
  libraryTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
  },
  libraryText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },
  libraryHint: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  libraryList: {
    width: "100%",
    marginTop: 24,
    gap: 10,
  },
  libraryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  libraryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  libraryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  libraryCardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  libraryCardMeta: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 3,
  },
  libraryCardKind: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 5,
  },
  libraryShare: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
});