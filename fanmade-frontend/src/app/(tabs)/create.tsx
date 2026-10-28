import React from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const options = [
  {
    icon: "🎬",
    title: "Video",
    description: "Upload a video and prepare it for your audience.",
    detail: "VIDEO STUDIO",
    route: "/create/video",
  },
  {
    icon: "🖼️",
    title: "Image",
    description: "Share artwork, illustrations and original images.",
    detail: "IMAGE STUDIO",
    route: "/create/image",
  },
  {
    icon: "📖",
    title: "Manga",
    description: "Arrange your pages into a manga experience.",
    detail: "MANGA STUDIO",
    route: "/create/manga",
  },
];

export default function CreateTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.eyebrow}>LOOPA CREATOR</Text>
            <Text style={styles.title}>Creator Studio</Text>
          </View>

          <View style={styles.brandOrb}>
            <Text style={styles.brandOrbText}>＋</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Your ideas. Your creations. Your audience.
        </Text>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroEyebrow}>MAKE SOMETHING ORIGINAL</Text>
          <Text style={styles.heroTitle}>What are we creating today?</Text>
          <Text style={styles.heroDescription}>
            Choose a format to open its own upload and publishing workflow.
          </Text>
          <View style={styles.heroPill}>
            <View style={styles.statusDot} />
            <Text style={styles.heroPillText}>YOUR STUDIO, YOUR RULES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Choose a format</Text>
          <Text style={styles.sectionCaption}>3 STUDIOS</Text>
        </View>

        <View style={styles.options}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.title}
              activeOpacity={0.84}
              style={styles.card}
              onPress={() => router.push(option.route as any)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${option.title} Studio`}
            >
              <View style={[styles.iconBox, index === 0 && styles.videoIconBox]}>
                <Text style={styles.icon}>{option.icon}</Text>
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardDetail}>{option.detail}</Text>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardDescription}>
                  {option.description}
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiIconText}>✦</Text>
          </View>
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>Fami AI, when you need it</Text>
            <Text style={styles.aiDescription}>
              Get optional help preparing your creation. You stay in control
              of edits and decide when to publish.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          CREATE AT YOUR PACE  ·  SHARE WHEN YOU'RE READY
        </Text>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050918",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 118,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#8EA9D8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 7,
    letterSpacing: -0.7,
  },
  brandOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,217,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.45)",
  },
  brandOrbText: {
    color: "#00D9FF",
    fontSize: 29,
    fontWeight: "400",
    marginTop: -2,
  },
  subtitle: {
    color: "#9BAAC9",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  hero: {
    overflow: "hidden",
    marginTop: 25,
    padding: 20,
    borderRadius: 26,
    backgroundColor: "rgba(22,43,91,0.62)",
    borderWidth: 1,
    borderColor: "rgba(145,192,255,0.24)",
  },
  heroGlow: {
    position: "absolute",
    top: -64,
    right: -45,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(0,217,255,0.10)",
  },
  heroEyebrow: {
    color: "#00D9FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 12,
    maxWidth: 270,
  },
  heroDescription: {
    color: "#BDCAE4",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(4,12,33,0.54)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00D9FF",
    marginRight: 7,
  },
  heroPillText: {
    color: "#D5E8FF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 13,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  sectionCaption: {
    color: "#7E9BCB",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  options: {
    gap: 12,
  },
  card: {
    minHeight: 108,
    padding: 13,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(22,35,69,0.66)",
    borderWidth: 1,
    borderColor: "rgba(177,205,255,0.17)",
  },
  iconBox: {
    width: 54,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(125,157,220,0.12)",
    borderWidth: 1,
    borderColor: "rgba(190,214,255,0.14)",
  },
  videoIconBox: {
    backgroundColor: "rgba(0,217,255,0.10)",
    borderColor: "rgba(0,217,255,0.32)",
  },
  icon: {
    fontSize: 25,
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 13,
    paddingRight: 7,
  },
  cardDetail: {
    color: "#00D9FF",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 4,
  },
  cardDescription: {
    color: "#A6B5D2",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  arrowCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  arrow: {
    color: "#C8E8FF",
    fontSize: 24,
    marginTop: -2,
  },
  aiCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    padding: 15,
    borderRadius: 22,
    backgroundColor: "rgba(0,217,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.16)",
  },
  aiIcon: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,217,255,0.10)",
  },
  aiIconText: {
    color: "#00D9FF",
    fontSize: 21,
  },
  aiText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  aiTitle: {
    color: "#EAF8FF",
    fontSize: 12,
    fontWeight: "800",
  },
  aiDescription: {
    color: "#96A9CA",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  footer: {
    color: "#64799F",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.1,
    textAlign: "center",
    marginTop: 23,
  },
  bottomSpace: {
    height: 14,
  },
});
