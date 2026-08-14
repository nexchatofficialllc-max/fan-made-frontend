import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const content = [
  {
    id: "1",
    title: "Welcome to Fan Made",
    creator: "Fan Made",
    description: "Create, watch and share your favorite content.",
  },
  {
    id: "2",
    title: "Fan Content",
    creator: "Creators",
    description: "Discover what the community is creating.",
  },
  {
    id: "3",
    title: "Trending Now",
    creator: "Fan Made",
    description: "See what people are enjoying right now.",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>WELCOME BACK</Text>
            <Text style={styles.logo}>FAN MADE</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.glow} />

          <Text style={styles.heroTitle}>
            Create.
            {"\n"}
            Share.
            {"\n"}
            Belong.
          </Text>

          <Text style={styles.heroText}>
            Your community. Your creativity. Your Fan Made.
          </Text>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>＋ Create Content</Text>
          </TouchableOpacity>
        </View>

        {/* Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For You</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Content cards */}
        {content.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={styles.card}
          >
            <View style={styles.thumbnail}>
              <Text style={styles.play}>▶</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.creator}>
                {item.creator}
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <View style={styles.stats}>
                <Text style={styles.stat}>♡ 0</Text>
                <Text style={styles.stat}>💬 0</Text>
                <Text style={styles.stat}>👁 0</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07080D",
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
    paddingBottom: 22,
  },

  smallText: {
    color: "#777C8E",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 3,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 19,
  },

  hero: {
    minHeight: 300,
    borderRadius: 30,
    padding: 26,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    justifyContent: "flex-end",
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(120,100,255,0.18)",
    top: -70,
    right: -50,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1,
  },

  heroText: {
    color: "#A9ADBB",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 15,
    maxWidth: 280,
  },

  createButton: {
    alignSelf: "flex-start",
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  createButtonText: {
    color: "#07080D",
    fontSize: 14,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
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
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  thumbnail: {
    width: 105,
    height: 115,
    borderRadius: 17,
    backgroundColor: "#151722",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 5,
  },

  description: {
    color: "#777C8E",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },

  stats: {
    flexDirection: "row",
    gap: 14,
    marginTop: 9,
  },

  stat: {
    color: "#9EA3B3",
    fontSize: 11,
  },

  bottomSpace: {
    height: 30,
  },
});
