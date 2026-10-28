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

const categories = [
  "All",
  "Anime",
  "Animation",
  "Drawing",
  "Music",
  "Gaming",
];

const trending = [
  {
    id: "1",
    title: "LOOPA Originals",
    creator: "LOOPA",
    views: "12K views",
    category: "Anime",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "2",
    title: "Anime Art Showcase",
    creator: "Creators",
    views: "8.4K views",
    category: "Drawing",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "3",
    title: "Animation Community",
    creator: "Fan Creators",
    views: "6.1K views",
    category: "Animation",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];


function DiscoverPreview({
  uri,
  active,
}: {
  uri: string;
  active: boolean;
}) {
  const [finished, setFinished] = React.useState(false);

  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;
  });

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (active && !finished) {
      try {
        player.currentTime = 0;
        player.play();
      } catch {
        // Keep the Discover card usable if preview playback fails.
      }

      timer = setTimeout(() => {
        player.pause();
        setFinished(true);
      }, 5000);
    } else {
      player.pause();
    }

    return () => {
      if (timer) clearTimeout(timer);
      player.pause();
    };
  }, [active, finished, player]);

  return (
    <View style={styles.thumbnail}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      {!active || finished ? (
        <View style={styles.previewOverlay}>
          <Text style={styles.play}>▶</Text>
          <Text style={styles.previewLabel}>
            {finished ? "Preview ended · Tap to watch" : "Video preview"}
          </Text>
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

  const filteredTrending = trending.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.creator.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

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


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        scrollEventThrottle={100}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>DISCOVER</Text>
            <Text style={styles.title}>Explore</Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.icon}>✦</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search LOOPA"
            placeholderTextColor="#777C8E"
            style={styles.input}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.category,
                  active && styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {filteredTrending.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyDescription}>
              Try another search or choose a different category.
            </Text>
          </View>
        )}

        {filteredTrending.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.82}
            style={styles.card}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setCardLayouts((previous) => ({
                ...previous,
                [item.id]: { y, height },
              }));
            }}
            onPress={() =>
              router.push({
                pathname: "/watch",
                params: {
                  uri: item.uri,
                  title: item.title,
                  creator: item.creator,
                },
              })
            }
          >
            <DiscoverPreview
              uri={item.uri}
              active={activePreviewId === item.id}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.creator}>{item.creator}</Text>

              <Text style={styles.views}>{item.views}</Text>

              <View style={styles.cardBottom}>
                <Text style={styles.tag}>{item.category.toUpperCase()} · DEMO</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.creatorSection}>
          <Text style={styles.sectionTitle}>Creators to discover</Text>

          <View style={styles.creatorCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>F</Text>
            </View>

            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>LOOPA Creators</Text>
              <Text style={styles.creatorDescription}>
                Discover artists, animators and fans.
              </Text>
            </View>

            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 20,
  },

  smallText: {
    color: "#91A8D6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 3,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(16,42,131,0.42)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    color: "#00D9FF",
    fontSize: 21,
  },

  searchBox: {
    height: 52,
    borderRadius: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,42,131,0.30)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
  },

  searchIcon: {
    color: "#00D9FF",
    fontSize: 25,
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },

  categories: {
    paddingVertical: 18,
    gap: 9,
  },

  category: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: "rgba(16,42,131,0.22)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.16)",
  },

  categoryActive: {
    backgroundColor: "#00D9FF",
    borderColor: "#00D9FF",
  },

  categoryText: {
    color: "#969BAA",
    fontSize: 12,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#07112F",
  },

  communityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "rgba(16,42,131,0.34)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
  },

  communityIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,217,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.36)",
    alignItems: "center",
    justifyContent: "center",
  },

  communityIconText: {
    color: "#00D9FF",
    fontSize: 20,
    fontWeight: "900",
  },

  communityInfo: {
    flex: 1,
    marginLeft: 12,
  },

  communityTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  communityDescription: {
    color: "#C2D4F5",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  communityArrow: {
    color: "#00D9FF",
    fontSize: 26,
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  seeAll: {
    color: "#9EA3B3",
    fontSize: 13,
  },

  card: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 12,
    borderRadius: 22,
    backgroundColor: "rgba(16,42,131,0.28)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.20)",
  },

  previewOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5,6,10,0.38)",
  },

  previewLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },

  thumbnail: {
    width: 112,
    height: 112,
    borderRadius: 18,
    backgroundColor: "#102A83",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  thumbnailGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(120,100,255,0.16)",
  },

  play: {
    color: "#FFFFFF",
    fontSize: 22,
  },

  cardInfo: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 5,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  creator: {
    color: "#C2D4F5",
    fontSize: 12,
    marginTop: 6,
  },

  views: {
    color: "#91A8D6",
    fontSize: 11,
    marginTop: 6,
  },

  cardBottom: {
    marginTop: 12,
  },

  tag: {
    color: "#00D9FF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  creatorSection: {
    marginTop: 20,
  },

  creatorCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,42,131,0.28)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.20)",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,217,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  creatorInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },

  creatorName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  creatorDescription: {
    color: "#C2D4F5",
    fontSize: 11,
    marginTop: 4,
  },

  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "rgba(0,217,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.48)",
  },

  followText: {
    color: "#00D9FF",
    fontSize: 11,
    fontWeight: "800",
  },


  emptyState: {
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(16,42,131,0.22)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.18)",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyDescription: {
    color: "#C2D4F5",
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 18,
  },

  bottomSpace: {
    height: 35,
  },
});
