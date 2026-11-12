import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { safeBack } from "../lib/safe-back";
// import { supabase } from "../lib/supabase"; // <- connect this when Supabase is ready

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const [humanCheck, setHumanCheck] = useState(false);

  // Device name for Approve / Decline — shows on your other device
  const deviceName = `${Platform.OS === "ios" ? "iPhone" : "Android"} • ${Platform.Version} • This device`;

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase());
  }

  async function handleContinue() {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("That email doesn't look right. Check it and try again.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!humanCheck) {
      setError("Please confirm you're human to continue.");
      return;
    }

    setLoading(true);

    try {
      // --- REAL AUTH — uncomment when Supabase is connected ---
      // const { data, error: authError } = await supabase.auth.signInWithPassword({
      //   email: email.trim().toLowerCase(),
      //   password,
      // });
      // if (authError) throw authError;
      //
      // // Check if this device is trusted. If NOT trusted -> Approve / Decline
      // const { data: device } = await supabase
      //   .from("trusted_devices")
      //   .select("*")
      //   .eq("user_id", data.user.id)
      //   .eq("device_name", deviceName)
      //   .single();
      //
      // if (!device) {
      //   // Create pending request — your other device gets Approve / Decline
      //   await supabase.from("device_requests").insert({
      //     user_id: data.user.id,
      //     device_name: deviceName,
      //     status: "pending",
      //   });
      //   setPendingApproval(true);
      //   return;
      // }
      //
      // // Trusted device -> go in. One account = Loopa + Heylo
      // router.replace("/(tabs)");

      // --- TEMP until Supabase is connected: simulate new-device flow ---
      // Remove this block once the Supabase code above is uncommented
      await new Promise((r) => setTimeout(r, 800));
      setPendingApproval(true);
    } catch (e: any) {
      setError(e?.message || "Couldn't log you in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!isValidEmail(email)) {
      setError("Enter your email first, then tap Forgot password.");
      return;
    }
    // await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    setError("");
    // Show success inline — don't use Alert for this
    setError("Reset link sent. Check your email.");
  }

  // --- PENDING APPROVAL SCREEN — new device waits here ---
  if (pendingApproval) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setPendingApproval(false)}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.glassCard}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topReflection} />
              <Text style={styles.pendingIcon}>◐</Text>
              <Text style={styles.pendingTitle}>Waiting for approval</Text>
              <Text style={styles.pendingText}>
                We sent an Approve / Decline request to your other device for:
              </Text>
              <Text style={styles.deviceName}>{deviceName}</Text>
              <Text style={styles.pendingText}>
                Open Loopa on your other device and tap Approve to continue here. Tap Decline if this wasn't you.
              </Text>
              <View style={styles.pendingRow}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.pendingWaiting}>Waiting...</Text>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPendingApproval(false)}
              >
                <Text style={styles.cancelText}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA + HEYLO</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Log in to your existing LOOPA account. One account, one payment — works in Loopa and Heylo.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(80)}>
          <View style={styles.glassCard}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(t) => { setEmail(t); setError(""); }}
              placeholder="you@email.com"
              placeholderTextColor="#AAAAAA"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={(t) => { setPassword(t); setError(""); }}
                placeholder="Your password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showButton}
              >
                <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Human verification — real CAPTCHA connects here */}
            <TouchableOpacity
              style={[styles.humanBox, humanCheck && styles.humanBoxChecked]}
              onPress={() => setHumanCheck(!humanCheck)}
            >
              <View style={[styles.checkbox, humanCheck && styles.checkboxChecked]}>
                {humanCheck && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.humanText}>I'm not a robot</Text>
              <Text style={styles.humanSub}>Human verification</Text>
            </TouchableOpacity>

            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.deviceHint}>
              Logging in from: {deviceName}
            </Text>
            <Text style={styles.deviceHint2}>
              New device? Your other device will get Approve / Decline.
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("./signup")}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 24,
  },
  smallLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 10,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  glassCard: {
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.40)",
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 8,
  },
  passwordRow: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 60,
  },
  showButton: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  showText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  forgot: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 14,
  },
  humanBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.30)",
    marginBottom: 12,
    gap: 10,
  },
  humanBoxChecked: {
    borderColor: "rgba(255,255,255,0.70)",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.50)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  checkMark: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "900",
  },
  humanText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  humanSub: {
    color: "#AAAAAA",
    fontSize: 11,
    marginLeft: "auto",
  },
  errorText: {
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },
  deviceHint: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
  },
  deviceHint2: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  signupLink: {
    alignItems: "center",
    marginTop: 22,
  },
  signupText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  signupBold: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  pendingIcon: {
    color: "#FFFFFF",
    fontSize: 44,
    textAlign: "center",
    marginBottom: 12,
  },
  pendingTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  pendingText: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 10,
  },
  deviceName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  pendingWaiting: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});