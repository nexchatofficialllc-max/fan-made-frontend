import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleContinue() {
    if (!email.trim()) {
      Alert.alert("Log in", "Please enter your email.");
      return;
    }

    Alert.alert(
      "Human verification",
      "The real CAPTCHA verification will be connected here.",
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Log in to your existing LOOPA account.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("./signup")}
        >
          <Text style={styles.signupText}>
            Don't have an account? Sign up
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
    marginBottom: 32,
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
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  signupLink: {
    alignItems: "center",
    marginTop: 22,
  },
  signupText: {
    color: "#fff",
    fontSize: 14,
  },
});
