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

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loopaUsername, setLoopaUsername] = useState("");
  const [heyloUsername, setHeyloUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [humanCheck, setHumanCheck] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deviceName = `${Platform.OS === "ios" ? "iPhone" : "Android"} • ${Platform.Version} • This device`;

  // Loopa UID preview — real UID is created by Supabase on signup
  const loopaUidPreview = loopaUsername.trim()
    ? `LOOPA-${loopaUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")}`
    : "LOOPA-...";

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase());
  }

  function isValidUsername(v: string) {
    // Loopa: @username — letters, numbers, _ , 3-20 chars
    // Heylo: Username — letters, numbers, _ , space, 3-20 chars
    return /^[a-zA-Z0-9_]{3,20}$/.test(v.trim());
  }

  function getPasswordStrength(p: string) {
    if (p.length < 6) return { label: "Too short", color: "#AAAAAA" };
    if (p.length < 8) return { label: "Okay", color: "#FFFFFF" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return { label: "Strong", color: "#FFFFFF" };
    return { label: "Good", color: "#FFFFFF" };
  }

  async function handleCreateAccount() {
    setError("");

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!loopaUsername.trim() || !isValidUsername(loopaUsername)) {
      setError("Loopa @username must be 3-20 characters: letters, numbers, _ only.");
      return;
    }
    if (!heyloUsername.trim() || heyloUsername.trim().length < 3 || heyloUsername.trim().length > 20) {
      setError("Heylo Username must be 3-20 characters.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!humanCheck) {
      setError("Please confirm you're human to continue.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms to create your account.");
      return;
    }

    setLoading(true);

    try {
      // --- REAL SIGNUP — uncomment when Supabase is connected ---
      // const { data, error: authError } = await supabase.auth.signUp({
      //   email: email.trim().toLowerCase(),
      //   password,
      // });
      // if (authError) throw authError;
      // const userId = data.user?.id;
      // if (!userId) throw new Error("Couldn't create account. Try again.");
      //
      // // One account = Loopa + Heylo. Create profile once, use in both apps.
      // const { error: profileError } = await supabase.from("profiles").insert({
      //   id: userId,
      //   email: email.trim().toLowerCase(),
      //   loopa_username: loopaUsername.trim().toLowerCase(),
      //   heylo_username: heyloUsername.trim(),
      //   loopa_uid: `LOOPA-${loopaUsername.trim().toLowerCase()}`,
      //   // Fami auto-bio is generated later from Loopa + Heylo usage — no manual bio
      // });
      // if (profileError) throw profileError;
      //
      // // Trust this first device — no Approve / Decline needed for first device
      // await supabase.from("trusted_devices").insert({
      //   user_id: userId,
      //   device_name: deviceName,
      // });
      //
      // router.replace("/(tabs)");

      // --- TEMP until Supabase is connected ---
      await new Promise((r) => setTimeout(r, 900));
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message || "Couldn't create account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(password);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/login")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA + HEYLO • ONE ACCOUNT</Text>
          <Text style={styles.title}>Create your LOOPA account</Text>
          <Text style={styles.subtitle}>
            One account, one payment, one wallet. Works in Loopa and Heylo. Sign up to watch, follow creators, and chat.
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

            <Text style={styles.label}>Loopa @username</Text>
            <TextInput
              value={loopaUsername}
              onChangeText={(t) => { setLoopaUsername(t.replace(/\s/g, "")); setError(""); }}
              placeholder="@username"
              placeholderTextColor="#AAAAAA"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              style={styles.input}
            />
            <Text style={styles.hint}>This is your Loopa name. Shows as @username. 3-20 chars, letters / numbers / _</Text>

            <Text style={styles.label}>Heylo Username</Text>
            <TextInput
              value={heyloUsername}
              onChangeText={(t) => { setHeyloUsername(t); setError(""); }}
              placeholder="Username"
              placeholderTextColor="#AAAAAA"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              style={styles.input}
            />
            <Text style={styles.hint}>This is your Heylo name. Can be different from Loopa. Shows as Username, no @.</Text>

            <View style={styles.uidBox}>
              <Text style={styles.uidLabel}>Your Loopa UID</Text>
              <Text style={styles.uidValue}>{loopaUidPreview}</Text>
              <Text style={styles.uidHint}>Your UID is your account ID for Loopa + Heylo. It never changes.</Text>
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={(t) => { setPassword(t); setError(""); }}
                placeholder="Create a password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
                <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            {!!password && (
              <Text style={styles.strength}>Strength: {strength.label} • {password.length} chars</Text>
            )}

            <Text style={styles.label}>Confirm password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(""); }}
                placeholder="Repeat your password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.showButton}>
                <Text style={styles.showText}>{showConfirm ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>

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

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the Terms and Privacy Policy. I know my bio is auto-generated by Fami from my Loopa + Heylo usage.
              </Text>
            </TouchableOpacity>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleCreateAccount}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#000000" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </TouchableOpacity>

            <Text style={styles.deviceHint}>Signing up from: {deviceName}</Text>
            <Text style={styles.deviceHint2}>This first device is trusted automatically. New devices will need Approve / Decline.</Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("./login")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Log in</Text>
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
    marginTop: 8,
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
    marginBottom: 6,
  },
  hint: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  uidBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    marginTop: 8,
    marginBottom: 6,
  },
  uidLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  uidValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },
  uidHint: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
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
  strength: {
    color: "#AAAAAA",
    fontSize: 11,
    marginBottom: 6,
  },
  humanBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.30)",
    marginTop: 10,
    marginBottom: 10,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  termsText: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
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
  loginLink: {
    alignItems: "center",
    marginTop: 22,
  },
  loginText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  loginBold: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});