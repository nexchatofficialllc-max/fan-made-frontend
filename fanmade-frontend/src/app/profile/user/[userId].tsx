import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)/profile")}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpace} />
      </View>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>F</Text>
        </View>

        <Text style={styles.username}>
          {username ? `@${username}` : "LOOPA User"}
        </Text>

        <Text style={styles.bio}>
          {accountType === "creator" ? "Creator" : "No bio added yet."}
        </Text>

        <TouchableOpacity
          style={styles.followButton}
          onPress={handleFollow}
          disabled={followBusy}
        >
          <Text style={styles.followText}>
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.userId}>User: {userId}</Text>
      </View>
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
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 20,
  },
  followText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  userId: {
    color: "#555",
    fontSize: 12,
    marginTop: 20,
  },
});
