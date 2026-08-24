import React from "react";
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
    title: "Fan Made Originals",
    creator: "Fan Made",
    views: "12K views",
  },
  {
    id: "2",
    title: "Anime Art Showcase",
    creator: "Creators",
    views: "8.4K views",
  },
  {
    id: "3",
    title: "Animation Community",
    creator: "Fan Creators",
    views: "6.1K views",
  },
];

export default function ExploreScreen() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
            placeholder="Search Fan Made"
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

        {trending.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.82}
            style={styles.card}
          >
            <View style={styles.thumbnail}>
              <View style={styles.thumbnailGlow} />
              <Text style={styles.play}>▶</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.creator}>{item.creator}</Text>

              <Text style={styles.views}>{item.views}</Text>

              <View style={styles.cardBottom}>
                <Text style={styles.tag}>FAN CONTENT</Text>
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
              <Text style={styles.creatorName}>Fan Made Creators</Text>
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
    backgroundColor: "#05060A",
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
    color: "#777C8E",
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
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    color: "#FFFFFF",
    fontSize: 21,
  },

  searchBox: {
    height: 52,
    borderRadius: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
  },

  searchIcon: {
    color: "#A9ADBB",
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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  categoryActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  categoryText: {
    color: "#969BAA",
    fontSize: 12,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#07080D",
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
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  thumbnail: {
    width: 112,
    height: 112,
    borderRadius: 18,
    backgroundColor: "#151722",
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
    color: "#9EA3B3",
    fontSize: 12,
    marginTop: 6,
  },

  views: {
    color: "#777C8E",
    fontSize: 11,
    marginTop: 6,
  },

  cardBottom: {
    marginTop: 12,
  },

  tag: {
    color: "#8E93A3",
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
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.12)",
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
    color: "#777C8E",
    fontSize: 11,
    marginTop: 4,
  },

  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  followText: {
    color: "#07080D",
    fontSize: 11,
    fontWeight: "800",
  },

  bottomSpace: {
    height: 35,
  },
});
