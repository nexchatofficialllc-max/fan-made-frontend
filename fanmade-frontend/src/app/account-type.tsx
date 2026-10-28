import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function AccountTypeScreen() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("");

  function handleContinue() {
    if (!accountType) return;

    router.push({
      pathname: "./watch-preferences",
      params: { accountType },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What are you here as?</Text>
        <Text style={styles.subtitle}>
          Choose how you want to use LOOPA.
        </Text>

        <TouchableOpacity
          style={[
            styles.option,
            accountType === "Fan" && styles.optionSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => setAccountType("Fan")}
        >
          <Text
            style={[
              styles.optionTitle,
              accountType === "Fan" && styles.optionTextSelected,
            ]}
          >
            Fan
          </Text>
          <Text
            style={[
              styles.optionDescription,
              accountType === "Fan" && styles.optionTextSelected,
            ]}
          >
            Watch, follow, like, save, and join the community.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            accountType === "Creator" && styles.optionSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => setAccountType("Creator")}
        >
          <Text
            style={[
              styles.optionTitle,
              accountType === "Creator" && styles.optionTextSelected,
            ]}
          >
            Creator
          </Text>
          <Text
            style={[
              styles.optionDescription,
              accountType === "Creator" && styles.optionTextSelected,
            ]}
          >
            Create and share videos, manga, and posts on LOOPA.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            !accountType && styles.buttonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={!accountType}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 30,
  },
  option: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  optionSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  optionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },
  optionDescription: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextSelected: {
    color: "#000",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
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
