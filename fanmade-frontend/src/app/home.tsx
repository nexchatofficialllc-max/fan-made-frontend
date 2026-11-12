import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const particles = [
  { x: -110, y: -100 },
  { x: 0, y: -130 },
  { x: 110, y: -95 },
  { x: -140, y: 0 },
  { x: 140, y: 0 },
  { x: -105, y: 105 },
  { x: 0, y: 130 },
  { x: 105, y: 105 },
];

export default function HomeScreen() {
  const particleValues = useRef(
    particles.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const animations = particleValues.map((particle, index) =>
      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: particles[index].x,
          duration: 650,
          delay: index * 35,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(particle.y, {
          toValue: particles[index].y,
          duration: 650,
          delay: index * 35,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(particle.scale, {
          toValue: 1,
          duration: 450,
          delay: index * 35,
          useNativeDriver: true,
        }),

        Animated.timing(particle.opacity, {
          toValue: 1,
          duration: 300,
          delay: index * 35,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      Animated.parallel(animations),

      Animated.delay(350),

      Animated.parallel(
        particleValues.map((particle) =>
          Animated.parallel([
            Animated.timing(particle.x, {
              toValue: 0,
              duration: 750,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),

            Animated.timing(particle.y, {
              toValue: 0,
              duration: 750,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),

            Animated.timing(particle.scale, {
              toValue: 0.25,
              duration: 750,
              useNativeDriver: true,
            }),
          ])
        )
      ),

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),

        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(400),

      Animated.sequence([
  Animated.timing(logoScale, {
    toValue: 3.2,
    duration: 850,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  }),

  Animated.timing(logoOpacity, {
    toValue: 0,
    duration: 250,
    useNativeDriver: true,
  }),

  Animated.delay(150),

  Animated.parallel([
    Animated.timing(nameOpacity, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),

    Animated.spring(nameScale, {
      toValue: 1,
      friction: 6,
      tension: 45,
      useNativeDriver: true,
    }),
  ]),
]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.whiteGlow} />

      {particleValues.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoGlass}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.22)",
              "rgba(255,255,255,0.05)",
              "rgba(0,0,0,0.60)",
            ]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.logoReflection} />
          <Text style={styles.logoText}>L</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.nameContainer,
          {
            opacity: nameOpacity,
            transform: [{ scale: nameScale }],
          },
        ]}
      >
        <Text style={styles.name}>LOOPA</Text>

        <Text style={styles.tagline}>
          Create. Share. Belong.
        </Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#111111",
    opacity: 0.35,
  },

  whiteGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  particle: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
  },

  logo: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlass: {
    width: 190,
    height: 190,
    borderRadius: 95,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  logoReflection: {
    position: "absolute",
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 150,
    fontWeight: "900",
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
    color: "#AAAAAA",
    fontSize: 13,
    letterSpacing: 2,
  },
});