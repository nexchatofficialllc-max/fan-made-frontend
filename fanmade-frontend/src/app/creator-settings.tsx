import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function CreatorSettingsScreen() {
  const router = useRouter();

  // TODO: replace with real status from Supabase creator_applications
  // "not_applied" | "pending" | "approved" | "declined"
  const applicationStatus: "not_applied" | "pending" | "approved" | "declined" = "not_applied";
  const isCreator = applicationStatus === "approved";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => safeBack(router, "/settings")}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={styles.smallLabel}>LOOPA CREATORS</Text>
            <Text style={styles.title}>Creator Settings</Text>
            <Text style={styles.subtitle}>
              Become a creator and manage creator access. Review is not instant — we'll notify you when you're approved.
            </Text>
          </Animated.View>

          {/* Status card */}
          <Animated.View entering={FadeInUp.duration(350).delay(60)}>
            <View style={styles.glassCard}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topReflection} />
              <Text style={styles.statusLabel}>YOUR STATUS</Text>
              <Text style={styles.statusValue}>
                {isCreator ? "✓ Creator" : applicationStatus === "pending" ? "◐ Application under review" : applicationStatus === "declined" ? "Application declined" : "Not a creator yet"}
              </Text>
              <Text style={styles.statusText}>
                {isCreator
                  ? "You can upload videos, manga, and posts. Your creator tools are below."
                  : applicationStatus === "pending"
                    ? "Your application is being reviewed. You'll get a notification in Loopa when it's decided."
                    : "Apply to unlock creator tools. Choose Video, Manga, Posts, or Mixed."}
              </Text>
            </View>
          </Animated.View>

          {/* Become a Creator */}
          <Animated.View entering={FadeInUp.duration(350).delay(120)}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push("./creator-application")}
            >
              <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topReflection} />
              <View style={styles.cardRow}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {isCreator ? "Creator Application" : applicationStatus === "pending" ? "View Application" : "Become a Creator"}
                  </Text>
                  <Text style={styles.cardText}>
                    {isCreator
                      ? "You're approved. View your application."
                      : applicationStatus === "pending"
                        ? "Your application is under review."
                        : "Apply to become a LOOPA creator. 3 steps."}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Creator tools — only useful when approved, but shown locked if not */}
          <Animated.View entering={FadeInUp.duration(350).delay(180)}>
            <Text style={styles.sectionTitle}>Creator tools</Text>
            {[
              { title: "Upload Video", desc: "Upload a video to Loopa feed", locked: !isCreator },
              { title: "Upload Manga", desc: "Upload manga chapters", locked: !isCreator },
              { title: "Creator Analytics", desc: "Views, Fans, watch time", locked: !isCreator },
              { title: "Fami AI Captions + Hashtags", desc: "Free auto captions + hashtags on upload", locked: !isCreator },
            ].map((tool) => (
              <View key={tool.title} style={[styles.toolCard, tool.locked && styles.toolCardLocked]}>
                <View style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolDesc}>{tool.desc}</Text>
                  </View>
                  <Text style={styles.toolBadge}>{tool.locked ? "Locked" : "Open"}</Text>
                </View>
              </View>
            ))}
            <Text style={styles.lockHint}>
              {isCreator ? "" : "Tools unlock when your application is approved. Fami AI video editor comes later — 3 free tries for new users, then upgrade."}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scroll: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 24,
  },
  smallLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 8,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  glassCard: {
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    marginBottom: 12,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  statusLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  statusValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  statusText: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardText: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 19,
  },
  chevron: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 12,
  },
  toolCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  toolCardLocked: {
    opacity: 0.7,
  },
  toolTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  toolDesc: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  toolBadge: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },
  lockHint: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    textAlign: "center",
  },
});