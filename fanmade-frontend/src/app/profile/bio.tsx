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
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { safeBack } from "../../lib/safe-back";

export default function BioScreen() {
  const router = useRouter();

  // Small bounce for back button
  const backScale = useSharedValue(1);
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.header}>
          <Animated.View style={backAnimatedStyle}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPressIn={() => { backScale.value = withSpring(0.85, { damping: 8, stiffness: 200 }); }}
              onPressOut={() => { backScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
              onPress={() => safeBack(router, "/profile")}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.title}>Bio</Text>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Small entrance animation + Glass Card */}
        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.glassCard}>
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

            <Animated.View entering={FadeInUp.duration(450).delay(100)}>
              <Text style={styles.bioTitle}>LOOPA User</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(450).delay(180)}>
              <Text style={styles.bioText}>
                No bio added yet.
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
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
  backText: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "300",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  glassCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    paddingVertical: 24,
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
  bioTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  bioText: {
    color: "#B0B0B0",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 18,
  },
});
