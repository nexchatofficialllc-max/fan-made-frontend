import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

const LETTERS = [
  { letter: "L", color: "#FFFFFF" },
  { letter: "O", color: "#FFFFFF" },
  { letter: "O", color: "#FFFFFF" },
  { letter: "P", color: "#FFFFFF" },
  { letter: "A", color: "#FFFFFF" },
];

export default function IntroScreen() {
  const opacities = useRef(
    LETTERS.map(() => new Animated.Value(0.45))
  ).current;

  useEffect(() => {
    const animations = opacities.map((opacity, index) =>
      Animated.sequence([
        Animated.delay(index * 180),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(animations).start();

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [opacities]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        {LETTERS.map((item, index) => (
          <Animated.Text
            key={`${item.letter}-${index}`}
            style={[
              styles.letter,
              {
                color: item.color,
                opacity: opacities[index],
              },
            ]}
          >
            {item.letter}
          </Animated.Text>
        ))}
      </View>

      <Text style={styles.tagline}>Join the loop.</Text>
      <Text style={styles.studio}>By Loop Studio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  letter: {
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: 2,
  },

  tagline: {
    marginTop: 14,
    color: "#AAAAAA",
    fontSize: 13,
    letterSpacing: 2,
  },

  studio: {
    marginTop: 10,
    color: "#666666",
    fontSize: 11,
    letterSpacing: 2,
  },
});