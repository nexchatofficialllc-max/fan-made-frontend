import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";

export default function CreatorSettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/settings")}>
          <Text style={styles.back}>&lt;</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Creator Settings</Text>
        <Text style={styles.subtitle}>
          Become a creator and manage creator access.
        </Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("./creator-application")}
        >
          <Text style={styles.cardTitle}>Become a Creator</Text>
          <Text style={styles.cardText}>
            Apply to become a LOOPA creator.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    padding: 20,
  },
  back: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    color: "#aaa",
    fontSize: 14,
  },
});
