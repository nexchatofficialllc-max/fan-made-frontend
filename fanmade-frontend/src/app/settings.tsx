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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useLoopaTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#000000" }]}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => safeBack(router, "/(tabs)")}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.eyebrow}>LOOPA + HEYLO</Text>
          <Text style={[styles.title, { color: "#FFFFFF" }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: "#AAAAAA" }]}>
            Manage your account and LOOPA preferences. One account — changes here apply to Loopa + Heylo.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(60)}>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Account</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Profile, email and UID</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(100)}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}
            activeOpacity={0.8}
            onPress={() => router.push("../privacy")}
          >
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Privacy</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Control your privacy settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(140)}>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Security</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Account security and protection • Approve / Decline devices</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(180)}>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Notifications</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Notification preferences</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(220)}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}
            activeOpacity={0.8}
            onPress={() => router.push("./creator-settings")}
          >
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Creator Settings</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Creator tools and permissions</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(260)}>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>App Preferences</Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>Theme and app preferences • Black and White Liquid + Glass</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(300)}>
          <TouchableOpacity
            style={styles.signOut}
            onPress={() => {}}
          >
            <Text style={[styles.signOutText, { color: "#FFFFFF" }]}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.signOutHint}>Signing out of Loopa signs you out of Heylo too. One account.</Text>
        </Animated.View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 25,
  },
  eyebrow: {
    color: "#AAAAAA",
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
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    marginBottom: 12,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cardText: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 16,
  },
  chevron: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },
  signOut: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    marginTop: 15,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  signOutHint: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 15,
  },
});