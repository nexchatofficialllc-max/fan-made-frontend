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
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

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

      <Animated.View entering={FadeInUp.duration(400)} style={styles.videoInfo}>
        <Text style={styles.creator}>@{item.creator}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <View style={styles.glassAction}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.actionIcon}>♡</Text>
          </View>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <View style={styles.glassAction}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.actionIcon}>◌</Text>
          </View>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <View style={styles.glassAction}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.actionIcon}>↗</Text>
          </View>
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

  const searchScale = useSharedValue(1);
  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

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
        <Animated.View entering={FadeInDown.duration(300)}>
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
                style={[styles.topTabButton, mode === "manga" && styles.topTabActive]}
                onPress={() => setMode("manga")}
                accessibilityRole="button"
                accessibilityLabel="Manga"
                hitSlop={8}
              >
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={27}
                  color={mode === "manga" ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
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

            <Animated.View style={searchAnimatedStyle}>
              <Pressable
                style={styles.searchButton}
                onPressIn={() => { searchScale.value = withSpring(0.88, { damping: 8, stiffness: 200 }); }}
                onPressOut={() => { searchScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
                onPress={() => router.push("/search")}
                accessibilityRole="button"
                accessibilityLabel="Search LOOPA"
                hitSlop={10}
              >
                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
                <MaterialCommunityIcons name="magnify" size={29} color="#FFFFFF" />
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>
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
    backgroundColor: "#000000",
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