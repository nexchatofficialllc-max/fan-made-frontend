 import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { safeBack } from "../../../lib/safe-back";
import {
  followAccount,
  isFollowing,
  unfollowAccount,
} from "../../../lib/follow-system";
import { getPublicProfile } from "../../../lib/profile-system";

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);

  // Small bounce for back + fan button
  const backScale = useSharedValue(1);
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));
  const fanScale = useSharedValue(1);
  const fanAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fanScale.value }],
  }));

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!userId) return;

      try {
        const profile = await getPublicProfile(String(userId));

        if (active) {
          setUsername(profile?.username ?? null);
          setAccountType(profile?.account_type ?? null);
        }
      } catch (error) {
        console.error("Failed to load public profile:", error);
      }
    }

    loadProfile();

    async function loadFollowState() {
      if (!userId) return;

      try {
        const value = await isFollowing(String(userId));
        if (active) setFollowing(value);
      } catch (error) {
        console.error("Failed to load follow state:", error);
      }
    }

    loadFollowState();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleFollow() {
    if (!userId || followBusy) return;

    try {
      setFollowBusy(true);

      if (following) {
        await unfollowAccount(String(userId));
        setFollowing(false);
      } else {
        await followAccount(String(userId));
        setFollowing(true);
      }
    } catch (error) {
      console.error("Failed to update follow state:", error);
    } finally {
      setFollowBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.header}>
          <Animated.View style={backAnimatedStyle}>
            <TouchableOpacity
              style={styles.backButton}
              onPressIn={() => { backScale.value = withSpring(0.85, { damping: 8, stiffness: 200 }); }}
              onPressOut={() => { backScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
              onPress={() => safeBack(router, "/(tabs)/profile")}
            >
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.headerSpace} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.profile}>
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
              <Text style={styles.avatarText}>F</Text>
            </BlurView>
          </View>

          <Text style={styles.username}>
            {username ? `@${username}` : "LOOPA User"}
          </Text>

          <Text style={styles.bio}>
            {accountType === "creator" ? "Creator" : "No bio added yet."}
          </Text>

          <Animated.View style={fanAnimatedStyle}>
            <TouchableOpacity
              style={[styles.followButton, following && styles.fanButtonActive]}
              onPressIn={() => { fanScale.value = withSpring(0.95, { damping: 8, stiffness: 200 }); }}
              onPressOut={() => { fanScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
              onPress={handleFollow}
              disabled={followBusy}
            >
              <BlurView intensity={following ? 40 : 60} tint={following ? "dark" : "light"} style={StyleSheet.absoluteFill} />
              <Text style={[styles.followText, following && styles.fanTextActive]}>
                {following ? "Fan ✓" : "Become a Fan"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.userId}>User: {userId}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  back: {
    color: "#fff",
    fontSize: 38,
    lineHeight: 38,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpace: {
    width: 30,
  },
  profile: {
    alignItems: "center",
    paddingTop: 30,
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
  avatarOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    borderRadius: 43,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.50)",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
  },
  bio: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 8,
  },
  followButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.70)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  fanButtonActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  followText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  fanTextActive: {
    color: "#fff",
  },
  userId: {
    color: "#555",
    fontSize: 12,
    marginTop: 20,
  },
});