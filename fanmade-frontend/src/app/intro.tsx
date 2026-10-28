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
  { letter: "L", color: "#FF3B30" },
  { letter: "O", color: "#FF9500" },
  { letter: "O", color: "#FFD60A" },
  { letter: "P", color: "#30D158" },
  { letter: "A", color: "#0A84FF" },
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
});
