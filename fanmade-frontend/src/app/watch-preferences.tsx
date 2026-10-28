import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const OPTIONS = [
  "Anime",
  "Manga",
  "Action",
  "Comedy",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Mystery",
  "Music",
];

export default function WatchPreferencesScreen() {
  const router = useRouter();
  const { accountType } = useLocalSearchParams<{ accountType?: string }>();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleOption(option: string) {
    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function handleContinue() {
    if (selected.length === 0) return;

    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What do you want to watch?</Text>
        <Text style={styles.subtitle}>
          Pick a few things you're interested in. LOOPA will use them to shape
          your starting recommendations.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option);

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => toggleOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            selected.length === 0 && styles.buttonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={selected.length === 0}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            {accountType === "Creator" ? "Finish Setup" : "Start Watching"}
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
    paddingTop: 60,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#000",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
