import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";
import { useLoopaTheme } from "../lib/loopa-theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useLoopaTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>LOOPA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage your account and LOOPA preferences.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Account</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Profile, email and UID</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => router.push("../privacy")}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Privacy</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Control your privacy settings</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Security</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Account security and protection</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Notification preferences</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => router.push("./creator-settings")}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Creator Settings</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Creator tools and permissions</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>App Preferences</Text>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>Theme and app preferences</Text>
        </View>

        <TouchableOpacity
          style={styles.signOut}
          onPress={() => {}}
        >
          <Text style={[styles.signOutText, { color: colors.text }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  back: {
    color: "#00D9FF",
    fontSize: 15,
    marginBottom: 25,
  },
  eyebrow: {
    color: "#91A8D6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 5,
  },
  subtitle: {
    color: "#C2D4F5",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "rgba(16,42,131,0.34)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cardText: {
    color: "#91A8D6",
    fontSize: 12,
    marginTop: 5,
  },
  signOut: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.28)",
    marginTop: 15,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
