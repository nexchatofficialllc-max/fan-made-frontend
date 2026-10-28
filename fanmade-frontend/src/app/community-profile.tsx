import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
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
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
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
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#999",
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
    minWidth: 150,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  followText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});
