import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function BackButton() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={() => router.back()}
          onPressIn={() => { scale.value = withSpring(0.92, { damping: 8, stiffness: 200 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
          style={styles.button}
          hitSlop={10}
        >
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.22)",
              "rgba(255,255,255,0.06)",
              "rgba(0,0,0,0.55)",
            ]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.topReflection} pointerEvents="none" />
          <View style={styles.leftReflection} pointerEvents="none" />
          <Text style={styles.arrow}>‹</Text>
          <Text style={styles.text}>Back</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    paddingLeft: 10,
    marginBottom: 14,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  leftReflection: {
    position: "absolute",
    top: 6,
    bottom: 6,
    left: 1,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});