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
import { SafeAreaView } from "react-native-safe-area-context";

type HomeMode = "forYou" | "manga" | "creators";

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

function FeedVideo({
  item,
  active,
}: {
  item: (typeof videos)[number];
  active: boolean;
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

      <View style={styles.videoInfo}>
        <Text style={styles.creator}>@{item.creator}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>♡</Text>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>◌</Text>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗</Text>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [mode, setMode] = useState<HomeMode>("forYou");
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <View style={styles.container}>
      {mode === "manga" ? (
        <View style={[styles.mangaPage, { height }]}>
          <Text style={styles.mangaLabel}>MANGA</Text>
          <Text style={styles.mangaTitle}>Manga feed</Text>
          <Text style={styles.mangaText}>
            Manga will open in its own vertical reader here.
          </Text>
          <Text style={styles.mangaHint}>
            LOOPA content will connect here later.
          </Text>
        </View>
      ) : mode === "creators" ? (
        <View style={[styles.mangaPage, { height }]}>
          <Text style={styles.mangaLabel}>CREATORS</Text>
          <Text style={styles.mangaTitle}>Creators</Text>
          <Text style={styles.mangaText}>
            Discover LOOPA creators here when the creator feed is connected.
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <FeedVideo item={item} active={index === activeIndex} />
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

      <SafeAreaView pointerEvents="box-none" style={styles.uiLayer}>
        <View style={styles.topBar}>
          <View style={styles.topTabs}>
            <Pressable
              style={styles.topTabButton}
              onPress={() => setMode("forYou")}
              accessibilityRole="button"
              accessibilityLabel="For You"
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={27}
                color={mode === "forYou" ? "#00D9FF" : "rgba(194,212,245,0.65)"}
              />
            </Pressable>

            <Pressable
              style={styles.topTabButton}
              onPress={() => setMode("manga")}
              accessibilityRole="button"
              accessibilityLabel="Manga"
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={27}
                color={mode === "manga" ? "#00D9FF" : "rgba(194,212,245,0.65)"}
              />
            </Pressable>

            <Pressable
              style={styles.topTabButton}
              onPress={() => setMode("creators")}
              accessibilityRole="button"
              accessibilityLabel="Creators"
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="account-group-outline"
                size={29}
                color={mode === "creators" ? "#00D9FF" : "rgba(194,212,245,0.65)"}
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
            <MaterialCommunityIcons
              name="magnify"
              size={29}
              color="#00D9FF"
            />
          </Pressable>
        </View>

      </SafeAreaView>
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
    gap: 22,
  },

  topTabButton: {
    minWidth: 42,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.12)",
    backgroundColor: "rgba(16,42,131,0.12)",
  },

  searchButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.42)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.38)",
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

  actionIcon: {
    color: "#FFFFFF",
    fontSize: 29,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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

  mangaPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    backgroundColor: "#08090E",
  },

  mangaLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
  },

  mangaTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
  },

  mangaText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },

  mangaHint: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
