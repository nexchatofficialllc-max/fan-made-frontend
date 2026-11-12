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

export default function PrivacyScreen() {
  const router = useRouter();
  const [showNameInFans, setShowNameInFans] = React.useState(true);
  const [showNameInCreators, setShowNameInCreators] = React.useState(true);
  const [showWatchActivity, setShowWatchActivity] = React.useState(true);
  const [allowMentions, setAllowMentions] = React.useState(true);
  const { mode: theme, colors, setMode } = useLoopaTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000000" }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => safeBack(router, "/settings")}>
          <Text style={[styles.back, { color: "#FFFFFF" }]}>‹ Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={[styles.eyebrow, { color: "#AAAAAA" }]}>LOOPA + HEYLO</Text>
          <Text style={styles.title}>Privacy</Text>
          <Text style={styles.subtitle}>
            Control what other people can see about your profile. Loopa uses Fans / Creators. Heylo uses Friends.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(80)}>
          <View style={[styles.card, { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.30)" }]}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />

            {/* Fans — was Followers */}
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>
                  Show my name in Fans
                </Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>
                  Allow your name to appear in other users' Fans lists. Loopa does not use Followers.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, showNameInFans && styles.switchOn]}
                activeOpacity={0.8}
                onPress={() => setShowNameInFans((current: boolean) => !current)}
              >
                <View style={[styles.switchThumb, showNameInFans && styles.switchThumbOn]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingDivider, { backgroundColor: "rgba(255,255,255,0.12)" }]} />

            {/* Creators — was Following */}
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>
                  Show my name in Creators
                </Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>
                  Allow your name to appear in other users' Creators lists. Loopa does not use Following.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, showNameInCreators && styles.switchOn]}
                activeOpacity={0.8}
                onPress={() => setShowNameInCreators((current: boolean) => !current)}
              >
                <View style={[styles.switchThumb, showNameInCreators && styles.switchThumbOn]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingDivider, { backgroundColor: "rgba(255,255,255,0.12)" }]} />

            {/* Watch activity */}
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>
                  Show my watch activity
                </Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>
                  Your Friends in Heylo + Fans in Loopa can see what you're watching.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, showWatchActivity && styles.switchOn]}
                activeOpacity={0.8}
                onPress={() => setShowWatchActivity((c) => !c)}
              >
                <View style={[styles.switchThumb, showWatchActivity && styles.switchThumbOn]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingDivider, { backgroundColor: "rgba(255,255,255,0.12)" }]} />

            {/* Mentions */}
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>
                  Allow mentions
                </Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>
                  Others can @mention you in Loopa comments. @fami can always be mentioned.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, allowMentions && styles.switchOn]}
                activeOpacity={0.8}
                onPress={() => setAllowMentions((c) => !c)}
              >
                <View style={[styles.switchThumb, allowMentions && styles.switchThumbOn]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingDivider, { backgroundColor: "rgba(255,255,255,0.12)" }]} />

            {/* Theme */}
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>
                  Theme
                </Text>
                <Text style={[styles.cardText, { color: "#AAAAAA" }]}>
                  Choose whether LOOPA uses a black or white appearance. Liquid + Glass stays the same.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, theme === "white" && styles.switchOn]}
                activeOpacity={0.8}
                onPress={() => setMode(theme === "black" ? "white" : "black")}
              >
                <View style={[styles.switchThumb, theme === "white" && styles.switchThumbOn]} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350).delay(160)}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Heylo privacy</Text>
            <Text style={styles.noteText}>
              Heylo private chats + groups are E2EE. Communities are NOT E2EE because they need moderation. Loopa cannot be E2EE. Calls will be E2EE in future.
            </Text>
          </View>
          <Text style={styles.noteHint}>Your Fami bio is auto-generated from Loopa + Heylo usage. You cannot edit it manually.</Text>
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
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    flex: 1,
    paddingRight: 14,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 16,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  switchOn: {
    backgroundColor: "#FFFFFF",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#AAAAAA",
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    backgroundColor: "#000000",
    alignSelf: "flex-end",
  },
  themeButtonTextActive: {
    color: "#000000",
  },
  noteCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  noteTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  noteText: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  noteHint: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 10,
    textAlign: "center",
  },
});