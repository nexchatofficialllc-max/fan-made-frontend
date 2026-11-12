import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Search</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.searchBox}>
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
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search LOOPA"
              placeholderTextColor="#888888"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(120)} style={styles.empty}>
          {query.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>
                Find something to watch
              </Text>
              <Text style={styles.emptyText}>
                Search creators, videos, manga, stories and more.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyTitle}>
                Searching for
              </Text>
              <Text style={styles.query}>
                {query}
              </Text>
            </>
          )}
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
    marginBottom: 24,
  },
  searchBox: {
    height: 52,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  searchIcon: {
    color: "#FFFFFF",
    fontSize: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
  query: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
});