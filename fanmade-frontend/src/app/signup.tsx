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

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleCreateAccount() {
    if (!email.trim() || !password) {
      Alert.alert("Create your account", "Please enter your email and password.");
      return;
    }

    Alert.alert(
      "Signup UI ready",
      "Supabase signup will be connected in the next step.",
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/login")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create your LOOPA account</Text>
        <Text style={styles.subtitle}>
          Sign up to watch, follow creators, and join the LOOPA community.
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

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("./login")}
        >
          <Text style={styles.loginText}>
            Already have an account? Log in
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
  loginLink: {
    alignItems: "center",
    marginTop: 22,
  },
  loginText: {
    color: "#fff",
    fontSize: 14,
  },
});
