import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function CommunityProfile() {
  const { username } = useLocalSearchParams<{ username?: string }>();
  const name = username || "loopafan";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.profile}>
        {/* Glass Profile Card */}
        <View style={styles.glassCard}>
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.18)",
              "rgba(255,255,255,0.05)",
              "rgba(0,0,0,0.55)",
            ]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.topReflection} pointerEvents="none" />

          <View style={styles.avatarWrap}>
            <View style={styles.avatarOuter}>
              <BlurView intensity={60} tint="dark" style={styles.avatarGlass}>
                <LinearGradient
                  colors={[
                    "rgba(255,255,255,0.35)",
                    "rgba(255,255,255,0.10)",
                    "rgba(0,0,0,0.60)",
                  ]}
                  locations={[0, 0.45, 1]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              </BlurView>
            </View>
          </View>

          <Text style={styles.username}>@{name.replace(/^@/, "")}</Text>
          <Text style={styles.subtitle}>LOOPA Community member</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.number}>0</Text>
              <Text style={styles.label}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.number}>0</Text>
              <Text style={styles.label}>Comments</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.number}>0</Text>
              <Text style={styles.label}>Reactions</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.followButton}>
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.95)",
                "rgba(255,255,255,0.70)",
                "rgba(0,0,0,0.10)",
              ]}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 36,
    lineHeight: 40,
  },
  title: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  spacer: {
    width: 44,
  },
  profile: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  glassCard: {
    width: "100%",
    alignItems: "center",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarGlass: {
    flex: 1,
    borderRadius: 46,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.50)",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },
  username: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 6,
  },
  stats: {
    flexDirection: "row",
    marginTop: 30,
    gap: 32,
  },
  stat: {
    alignItems: "center",
  },
  number: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  followButton: {
    marginTop: 30,
    minWidth: 160,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.70)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  followText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});