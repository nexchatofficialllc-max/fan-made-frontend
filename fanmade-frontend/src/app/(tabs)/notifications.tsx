import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getFamiAvatar } from "../../lib/fami-avatar";

export default function NotificationsScreen() {
  const router = useRouter();
  const [famiImage, setFamiImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFamiAvatar = async () => {
      const savedAvatar = await getFamiAvatar();
      if (savedAvatar) {
        setFamiImage(savedAvatar);
      }
    };

    loadFamiAvatar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.smallLabel}>LOOPA</Text>
        <Text style={styles.title}>Inbox</Text>

        <Pressable
          style={styles.famiCard}
          onPress={() => router.push("/fami")}
        >
          <View style={styles.famiIcon}>
            {famiImage ? (
              <Image
                source={{ uri: famiImage }}
                style={styles.famiIconImage}
              />
            ) : (
              <Text style={styles.famiIconText}>🌸</Text>
            )}
          </View>

          <View style={styles.famiInfo}>
            <Text style={styles.famiTitle}>Fami</Text>
            <Text style={styles.famiText}>
              Need help with LOOPA? Talk to Fami.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.communityCard}
          onPress={() => router.push("/community")}
          accessibilityRole="button"
          accessibilityLabel="Open Community"
        >
          <View style={styles.communityIcon}>
            <Text style={styles.communityIconText}>◉</Text>
          </View>

          <View style={styles.communityInfo}>
            <Text style={styles.communityTitle}>Community</Text>
            <Text style={styles.communityText}>
              Chat with fans and join the LOOPA community.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.empty}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♧</Text>
          </View>

          <Text style={styles.emptyTitle}>
            You're all caught up
          </Text>

          <Text style={styles.emptyText}>
            Likes, comments, follows and other activity will appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  smallLabel: {
    color: "#91A8D6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
  },

  famiCard: {
    marginTop: 24,
    minHeight: 76,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,42,131,0.38)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
  },

  famiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,217,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.28)",
    overflow: "hidden",
  },

  famiIconText: {
    fontSize: 23,
  },

  famiIconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  famiInfo: {
    flex: 1,
    marginLeft: 12,
  },

  famiTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  famiText: {
    color: "#C2D4F5",
    fontSize: 13,
    marginTop: 3,
  },

  arrow: {
    color: "#00D9FF",
    fontSize: 30,
    fontWeight: "300",
    marginLeft: 8,
  },

  communityCard: {
    marginTop: 12,
    minHeight: 76,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,42,131,0.28)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.20)",
  },

  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,217,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
  },

  communityIconText: {
    color: "#00D9FF",
    fontSize: 22,
    fontWeight: "900",
  },

  communityInfo: {
    flex: 1,
    marginLeft: 12,
  },

  communityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  communityText: {
    color: "#C2D4F5",
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.32)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
    marginBottom: 20,
  },

  icon: {
    color: "#00D9FF",
    fontSize: 32,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  emptyText: {
    color: "#C2D4F5",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
});
