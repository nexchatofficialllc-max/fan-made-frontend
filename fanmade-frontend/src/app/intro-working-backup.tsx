import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const scale = useRef(new Animated.Value(0.35)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(500),

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 2.8,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <Animated.View
        style={[
          styles.symbolContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.symbol}>F</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.nameContainer,
          {
            opacity: textOpacity,
            transform: [{ scale: textScale }],
          },
        ]}
      >
        <Text style={styles.name}>FAN MADE</Text>
        <Text style={styles.tagline}>Create. Share. Belong.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090D",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#252A3A",
    opacity: 0.45,
  },

  symbolContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  symbol: {
    fontSize: 150,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -12,
  },

  nameContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 5,
  },

  tagline: {
    marginTop: 10,
    color: "#A8ACB8",
    fontSize: 13,
    letterSpacing: 2,
  },
});
