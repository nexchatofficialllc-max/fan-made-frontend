import React from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
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
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.topReflection} pointerEvents="none" />
          <Text style={styles.heroEyebrow}>MAKE SOMETHING ORIGINAL</Text>
          <Text style={styles.heroTitle}>What are we creating today?</Text>
          <Text style={styles.heroDescription}>
            Upload your creation and share it with your audience.
          </Text>
          <View style={styles.heroPill}>
            <View style={styles.statusDot} />
            <Text style={styles.heroPillText}>YOUR STUDIO, YOUR RULES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upload</Text>
          <Text style={styles.sectionCaption}>1 STUDIO</Text>
        </View>

        {/* ONLY ONE UPLOAD — no Manga, no separate Image / Video */}
        <TouchableOpacity
          activeOpacity={0.84}
          style={styles.card}
          onPress={() => router.push("/create/video" as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Upload"
        >
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.iconBox}>
            <Text style={styles.icon}>↑</Text>
          </View>

          <View style={styles.cardText}>
            <Text style={styles.cardDetail}>UPLOAD STUDIO</Text>
            <Text style={styles.cardTitle}>Upload</Text>
            <Text style={styles.cardDescription}>
              Upload video, image or manga from one place.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.aiCard}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
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
    backgroundColor: "#000000",
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
    color: "#AAAAAA",
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  brandOrbText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "400",
    marginTop: -2,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  hero: {
    overflow: "hidden",
    marginTop: 25,
    padding: 20,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  heroEyebrow: {
    color: "#FFFFFF",
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
    color: "#AAAAAA",
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
    backgroundColor: "rgba(0,0,0,0.54)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 7,
  },
  heroPillText: {
    color: "#FFFFFF",
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
    color: "#888888",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  card: {
    minHeight: 108,
    padding: 13,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  iconBox: {
    width: 54,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  icon: {
    fontSize: 25,
    color: "#FFFFFF",
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 13,
    paddingRight: 7,
  },
  cardDetail: {
    color: "#FFFFFF",
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
    color: "#AAAAAA",
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 24,
    marginTop: -2,
  },
  aiCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    padding: 15,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  aiIcon: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  aiIconText: {
    color: "#FFFFFF",
    fontSize: 21,
  },
  aiText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  aiTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  aiDescription: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  footer: {
    color: "#666666",
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