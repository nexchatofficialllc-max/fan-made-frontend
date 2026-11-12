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
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getFamiAvatar } from "../../lib/fami-avatar";

export default function NotificationsScreen() {
  const router = useRouter();
  const [famiImage, setFamiImage] = React.useState<string | null>(null);

  const famiScale = useSharedValue(1);
  const famiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: famiScale.value }],
  }));
  const communityScale = useSharedValue(1);
  const communityAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: communityScale.value }],
  }));

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
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Inbox</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).springify()} style={famiAnimatedStyle}>
          <Pressable
            style={styles.famiCard}
            onPressIn={() => { famiScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }}
            onPressOut={() => { famiScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
            onPress={() => router.push("/fami")}
          >
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
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
            <View style={styles.famiIcon}>
              {famiImage ? (
                <Image source={{ uri: famiImage }} style={styles.famiIconImage} />
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
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={communityAnimatedStyle}>
          <Pressable
            style={styles.communityCard}
            onPressIn={() => { communityScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }}
            onPressOut={() => { communityScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
            onPress={() => router.push("/community")}
            accessibilityRole="button"
            accessibilityLabel="Open Community"
          >
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.16)",
                "rgba(255,255,255,0.04)",
                "rgba(0,0,0,0.55)",
              ]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} pointerEvents="none" />
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
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(180)} style={styles.empty}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♧</Text>
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyText}>
            Likes, comments, fans and other activity will appear here.
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  smallLabel: {
    color: "#AAAAAA",
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  famiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
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
    color: "#AAAAAA",
    fontSize: 13,
    marginTop: 3,
  },
  arrow: {
    color: "#FFFFFF",
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  communityIconText: {
    color: "#FFFFFF",
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
    color: "#AAAAAA",
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    marginBottom: 20,
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
});