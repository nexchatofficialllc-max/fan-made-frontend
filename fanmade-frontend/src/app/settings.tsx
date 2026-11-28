import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";
import { useLoopaTheme } from "../lib/loopa-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ReadingMode = "scroll" | "arrow" | "swipe";
const READING_KEY = "loopa_library_reading_mode";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useLoopaTheme();
  const [readingMode, setReadingMode] = useState<ReadingMode>("scroll");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(READING_KEY);
        if (saved === "scroll" || saved === "arrow" || saved === "swipe") setReadingMode(saved);
      } catch {}
    })();
  }, []);

  async function pickReading(next: ReadingMode) {
    setReadingMode(next);
    try { await AsyncStorage.setItem(READING_KEY, next); } catch {}
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000000", paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.eyebrow}>LOOPA + HEYLO</Text>
          <Text style={[styles.title, { color: "#FFFFFF" }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: "#AAAAAA" }]}>
            Manage your account and LOOPA preferences. One account — changes here apply to Loopa + Heylo.
          </Text>
        </View>

        {/* Account */}
        <View>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Account</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Profile, email and UID</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        {/* WALLET — Coins, Ring + Banner, Send — stays in Settings, well customised */}
        <View>
          <TouchableOpacity
            style={[styles.walletCard]}
            activeOpacity={0.85}
            onPress={() => router.push("./wallet")}
          >
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.20)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.walletTop}>
              <View>
                <Text style={styles.walletEyebrow}>WALLET • COINS</Text>
                <View style={styles.coinRow}>
                  <MaterialCommunityIcons name="coins" size={20} color="#FFFFFF" />
                  <Text style={styles.walletBalance}>1,250 Coins</Text>
                </View>
                <Text style={styles.walletSub}>Ring + Banner • Send Coins to friends</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
            <View style={styles.walletPreview}>
              <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>Y</Text></View>
              <View style={styles.miniBanner}><Text style={styles.miniBannerText}>Banner • Black</Text></View>
              <View style={styles.ringBadge}>
                <MaterialCommunityIcons name="circle-outline" size={12} color="#000000" />
                <Text style={styles.ringBadgeText}>Ring • White</Text>
              </View>
            </View>
            <View style={styles.walletActions}>
              <View style={styles.walletChip}><Text style={styles.walletChipText}>Send Coins</Text><MaterialCommunityIcons name="arrow-right" size={12} color="#FFFFFF" /></View>
              <View style={styles.walletChip}><Text style={styles.walletChipText}>Character Ring</Text></View>
              <View style={styles.walletChip}><Text style={styles.walletChipText}>Banner</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        {/* LIBRARY READING — Scroll / Arrow / Swipe — Library uses what you pick here */}
        <View>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Library Reading</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>How you want to read comics and books in Library. Library will always use what you pick here.</Text>
              </View>
              <MaterialCommunityIcons name="book-open-outline" size={24} color="#FFFFFF" />
            </View>

            <View style={styles.readingRow}>
              {([
                { id: "scroll" as ReadingMode, label: "Scroll", icon: "arrow-down", desc: "Scroll down" },
                { id: "arrow" as ReadingMode, label: "Arrow", icon: "arrow-left-right", desc: "Tap arrows" },
                { id: "swipe" as ReadingMode, label: "Swipe", icon: "gesture-swipe-horizontal", desc: "Swipe pages" },
              ]).map((m) => {
                const active = readingMode === m.id;
                return (
                  <TouchableOpacity key={m.id} style={[styles.readingChip, active && styles.readingChipActive]} activeOpacity={0.8} onPress={() => pickReading(m.id)}>
                    <MaterialCommunityIcons name={m.icon as any} size={22} color={active ? "#000000" : "#FFFFFF"} />
                    <Text style={[styles.readingChipTitle, active && styles.readingChipTitleActive]}>{m.label}</Text>
                    <Text style={[styles.readingChipDesc, active && styles.readingChipDescActive]}>{m.desc}</Text>
                    {active && (
                      <View style={styles.readingCheck}>
                        <MaterialCommunityIcons name="check" size={12} color="#000000" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.readingSaved}>
              Saved: {readingMode === "scroll" ? "Scroll — scroll down to read" : readingMode === "arrow" ? "Arrow — tap left / right to turn page" : "Swipe — swipe left / right to turn page"}
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]} activeOpacity={0.8} onPress={() => router.push("../privacy")}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Privacy</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Control your privacy settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Security</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Account security and protection • Approve / Decline devices</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Notifications</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Notification preferences</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]} activeOpacity={0.8} onPress={() => router.push("./creator-settings")}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Creator Settings</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Creator tools and permissions</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>App Preferences</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Theme and app preferences • Black and White Liquid + Glass</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity style={styles.signOut} onPress={() => {}}>
            <Text style={[styles.signOutText, { color: "#FFFFFF" }]}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.signOutHint}>Signing out of Loopa signs you out of Heylo too. One account.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: "#FFFFFF", fontSize: 15, marginBottom: 25 },
  eyebrow: { color: "#AAAAAA", fontSize: 10, fontWeight: "800", letterSpacing: 3 },
  title: { color: "#FFFFFF", fontSize: 36, fontWeight: "900", marginTop: 5 },
  subtitle: { color: "#AAAAAA", fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 25 },
  card: { padding: 18, borderRadius: 20, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", marginBottom: 12 },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)" },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardInfo: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  cardText: { color: "#AAAAAA", fontSize: 12, marginTop: 5, lineHeight: 16 },
  chevron: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginLeft: 10 },
  // Wallet — customised, bigger than other cards
  walletCard: { padding: 20, borderRadius: 26, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", marginBottom: 12 },
  walletTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  walletEyebrow: { color: "#AAAAAA", fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  coinRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  walletBalance: { color: "#FFFFFF", fontSize: 26, fontWeight: "900" },
  walletSub: { color: "#AAAAAA", fontSize: 12, marginTop: 5 },
  walletPreview: { flexDirection: "row", gap: 10, marginTop: 16, alignItems: "center" },
  miniAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  miniAvatarText: { color: "#000000", fontWeight: "900" },
  miniBanner: { flex: 1, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  miniBannerText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  ringBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  ringBadgeText: { color: "#000000", fontSize: 11, fontWeight: "800" },
  walletActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  walletChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  walletChipText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  // Library Reading
  readingRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  readingChip: { flex: 1, alignItems: "center", paddingVertical: 12, paddingHorizontal: 6, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  readingChipActive: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  readingChipTitle: { color: "#FFFFFF", fontSize: 12, fontWeight: "800", marginTop: 6 },
  readingChipTitleActive: { color: "#000000" },
  readingChipDesc: { color: "#AAAAAA", fontSize: 10, marginTop: 2, textAlign: "center" },
  readingChipDescActive: { color: "#333333" },
  readingCheck: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", marginTop: 6 },
  readingSaved: { color: "#AAAAAA", fontSize: 11, marginTop: 12, lineHeight: 15 },
  signOut: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", marginTop: 15 },
  signOutText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  signOutHint: { color: "#AAAAAA", fontSize: 11, textAlign: "center", marginTop: 10, lineHeight: 15 },
});