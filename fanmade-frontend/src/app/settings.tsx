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

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>FAN MADE</Text>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.subtitle}>
          Manage your account and Fan Made preferences.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.cardText}>Profile, email and UID</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy</Text>
          <Text style={styles.cardText}>Control your privacy settings</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardText}>Account security and protection</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardText}>Notification preferences</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Creator Settings</Text>
          <Text style={styles.cardText}>Creator tools and permissions</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Preferences</Text>
          <Text style={styles.cardText}>Theme and app preferences</Text>
        </View>

        <TouchableOpacity
          style={styles.signOut}
          onPress={() => {}}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05060A",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  back: {
    color: "#A0A5B5",
    fontSize: 15,
    marginBottom: 25,
  },
  eyebrow: {
    color: "#777C8E",
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
    color: "#8F94A5",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cardText: {
    color: "#777C8E",
    fontSize: 12,
    marginTop: 5,
  },
  signOut: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 15,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
