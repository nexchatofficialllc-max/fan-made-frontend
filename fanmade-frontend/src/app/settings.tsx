import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [readStyle, setReadStyle] = useState("Scroll");
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>One account — Loopa + Heylo</Text>

        {/* Wallet — row only. No Coins here. Opens /wallet */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push("/wallet")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Wallet</Text>
            <Text style={styles.cardText}>Coins, Ring, Banner</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {/* Library read style — from sketch */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Library read style</Text>
            <Text style={styles.cardText}>How you read in Library — {readStyle}</Text>
          </View>
          <View style={styles.readingRow}>
            {(["Scroll", "Arrow", "Swipe"] as const).map((m) => (
              <TouchableOpacity key={m} style={[styles.readingChip, readStyle === m && styles.readingChipActive]} activeOpacity={0.8} onPress={() => setReadStyle(m)}>
                <Text style={[styles.readingChipText, readStyle === m && styles.readingChipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account & UID */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => Alert.alert("Account & UID", "Account and UID will show here.")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Account & UID</Text>
            <Text style={styles.cardText}>Profile, email and UID</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {/* Privacy */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push("/privacy")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Privacy</Text>
            <Text style={styles.cardText}>Control your privacy settings</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Notification */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => Alert.alert("Notification", "Notification preferences will show here.")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Notification</Text>
            <Text style={styles.cardText}>Notification preferences</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Contact us */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => Alert.alert("Contact us", "Contact Loop Studio here.")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Contact us</Text>
            <Text style={styles.cardText}>Contact Loop Studio</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {/* Delete or deactivate */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => Alert.alert("Delete or deactivate", "Delete or deactivate will show here.")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Delete or deactivate</Text>
            <Text style={styles.cardText}>Delete or deactivate your account</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOut} onPress={() => Alert.alert("Sign Out", "Sign out will connect here.")}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.signOutHint}>Signing out of Loopa signs you out of Heylo too. One account.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: "#FFFFFF", fontSize: 15, marginBottom: 20 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900" },
  subtitle: { color: "#AAAAAA", fontSize: 13, marginTop: 6, marginBottom: 20 },
  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", marginBottom: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  cardText: { color: "#AAAAAA", fontSize: 12, marginTop: 4 },
  chevron: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginLeft: 10 },
  readingRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  readingChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  readingChipActive: { backgroundColor: "#FFFFFF" },
  readingChipText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  readingChipTextActive: { color: "#000000" },
  signOut: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", marginTop: 10 },
  signOutText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  signOutHint: { color: "#AAAAAA", fontSize: 11, textAlign: "center", marginTop: 10 },
});