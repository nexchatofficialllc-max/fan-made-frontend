import React from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const options = [
  {
    icon: "🎬",
    title: "Video",
    description: "Share your fan content with the community.",
  },
];

export default function CreateScreen() {
  const router = useRouter();

  const cardScale = useSharedValue(1);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>LOOPA</Text>
            <Text style={styles.title}>Create</Text>
            <Text style={styles.subtitle}>
              Turn your ideas into something the community can enjoy.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.glow} />

        <View style={styles.options}>
          {options.map((option) => (
            <Animated.View
              key={option.title}
              entering={FadeInUp.duration(400).springify()}
              style={cardAnimatedStyle}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.card}
                onPressIn={() => { cardScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }}
                onPressOut={() => { cardScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
                onPress={() => {
                  router.push("/create/video");
                }}
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

                <View style={styles.iconBox}>
                  <Text style={styles.icon}>{option.icon}</Text>
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  header: {
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  eyebrow: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 5,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 310,
  },
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: 100,
    right: -100,
  },
  options: {
    gap: 14,
  },
  card: {
    minHeight: 105,
    padding: 14,
    borderRadius: 24,
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
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  icon: {
    fontSize: 25,
  },
  cardText: {
    flex: 1,
    paddingLeft: 14,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  cardDescription: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  arrow: {
    color: "#AAAAAA",
    fontSize: 30,
    paddingHorizontal: 5,
  },
});