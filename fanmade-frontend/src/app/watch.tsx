import React from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { SafeAreaView } from "react-native-safe-area-context";

const DEMO_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const recommendations = [
  {
    id: "rec-1",
    title: "Amazing Anime Fight Animation",
    creator: "AnotherCreator",
    views: "8.4K views",
    uri: DEMO_VIDEO,
  },
  {
    id: "rec-2",
    title: "My First Original Anime",
    creator: "FanCreator",
    views: "5.2K views",
    uri: DEMO_VIDEO,
  },
  {
    id: "rec-3",
    title: "Anime Art Showcase",
    creator: "LOOPA Creator",
    views: "3.1K views",
    uri: DEMO_VIDEO,
  },
];

export default function WatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    uri?: string;
    title?: string;
    creator?: string;
  }>();

  const uri = typeof params.uri === "string" ? params.uri : "";
  const title = typeof params.title === "string" ? params.title : "Video";
  const creator =
    typeof params.creator === "string" ? params.creator : "LOOPA Creator";

  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [following, setFollowing] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = false;
  });

  React.useEffect(() => {
    if (uri) player.play();
    return () => player.pause();
  }, [player, uri]);

  const openRecommendation = (item: (typeof recommendations)[number]) => {
    player.pause();
    router.replace({
      pathname: "/watch",
      params: {
        uri: item.uri,
        title: item.title,
        creator: item.creator,
      },
    });
  };

  const shareVideo = async () => {
    try {
      await Share.share({
        message: `${title} — by ${creator}`,
      });
    } catch {
      // Sharing can be unavailable on some devices.
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹  Back</Text>
          </Pressable>
          <Text style={styles.brand}>LOOPA</Text>
        </View>

        <View style={styles.videoArea}>
          {uri ? (
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              nativeControls
            />
          ) : (
            <View style={styles.noVideo}>
              <Text style={styles.info}>
                This video has no playable URL yet.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>12K views · Demo video</Text>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => setLiked((value) => !value)}
              style={[styles.action, liked && styles.actionSelected]}
            >
              <Text style={styles.actionText}>
                {liked ? "♥ Liked" : "♡ Like"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowComments((value) => !value)}
              style={[styles.action, showComments && styles.actionSelected]}
            >
              <Text style={styles.actionText}>▤ Comments</Text>
            </Pressable>

            <Pressable
              onPress={() => setSaved((value) => !value)}
              style={[styles.action, saved && styles.actionSelected]}
            >
              <Text style={styles.actionText}>
                {saved ? "▣ Saved" : "▢ Save"}
              </Text>
            </Pressable>

            <Pressable onPress={shareVideo} style={styles.action}>
              <Text style={styles.actionText}>↗ Share</Text>
            </Pressable>
          </View>

          <View style={styles.creatorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {creator.trim().charAt(0).toUpperCase() || "L"}
              </Text>
            </View>

            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>@{creator}</Text>
              <Text style={styles.creatorSubtitle}>
                Anime & animation creator
              </Text>
            </View>

            <Pressable
              onPress={() => setFollowing((value) => !value)}
              style={[styles.followButton, following && styles.followingButton]}
            >
              <Text
                style={[
                  styles.followText,
                  following && styles.followingText,
                ]}
              >
                {following ? "Following" : "Follow"}
              </Text>
            </Pressable>
          </View>

          {showComments && (
            <View style={styles.commentsPanel}>
              <Text style={styles.sectionTitle}>Comments</Text>
              <Text style={styles.muted}>
                Comments will appear here when connected to LOOPA's backend.
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.muted}>
            Discover more anime, animation and fan creations.
          </Text>

          {recommendations.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => openRecommendation(item)}
              style={styles.recommendation}
            >
              <View style={styles.thumbnail}>
                <View style={styles.thumbnailGlow} />
                <Text style={styles.thumbnailLabel}>LOOPA</Text>
                <Text style={styles.thumbnailPlay}>▶</Text>
              </View>

              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.creator}</Text>
                <Text style={styles.muted}>{item.views}</Text>
              </View>
            </Pressable>
          ))}

          <Text style={styles.footerNote}>
            Demo recommendations · Real creator videos and thumbnails will
            connect when content storage is ready.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05060A",
  },
  page: {
    paddingBottom: 28,
  },
  topBar: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    paddingVertical: 10,
    paddingRight: 12,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  videoArea: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  noVideo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  info: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  details: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  meta: {
    color: "#9298A8",
    fontSize: 12,
    marginTop: 7,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  action: {
    backgroundColor: "#20222B",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionSelected: {
    backgroundColor: "#45304D",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333747",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  creatorSubtitle: {
    color: "#9298A8",
    fontSize: 11,
    marginTop: 4,
  },
  followButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 10,
  },
  followText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "800",
  },
  followingButton: {
    backgroundColor: "#333747",
  },
  followingText: {
    color: "#FFFFFF",
  },
  commentsPanel: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#151720",
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#272A35",
    marginVertical: 18,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  muted: {
    color: "#9298A8",
    fontSize: 12,
    lineHeight: 18,
  },
  recommendation: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  thumbnail: {
    width: "44%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222333",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#34304F",
  },
  thumbnailLabel: {
    color: "#C8B7FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  thumbnailPlay: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
  },
  recommendationInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
  },
  footerNote: {
    color: "#777C8E",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 22,
  },
});
