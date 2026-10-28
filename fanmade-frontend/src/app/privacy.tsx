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

export default function PrivacyScreen() {
  const router = useRouter();
  const [showNameInFollowers, setShowNameInFollowers] = React.useState(true);
  const [showNameInFollowing, setShowNameInFollowing] = React.useState(true);
  const { mode: theme, colors, setMode } = useLoopaTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/settings")}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={[styles.eyebrow, { color: colors.textMuted }]}>LOOPA</Text>
        <Text style={styles.title}>Privacy</Text>

        <Text style={styles.subtitle}>
          Control what other people can see about your profile.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Show my name in Followers
              </Text>
              <Text style={[styles.cardText, { color: colors.textMuted }]}>
                Allow your name to appear in other users' Followers lists.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.switch,
                { backgroundColor: colors.surfaceStrong },
                showNameInFollowers && styles.switchOn,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setShowNameInFollowers((current: boolean) => !current)
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  showNameInFollowers && styles.switchThumbOn,
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Show my name in Following
              </Text>
              <Text style={[styles.cardText, { color: colors.textMuted }]}>
                Allow your name to appear in other users' Following lists.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.switch,
                { backgroundColor: colors.surfaceStrong },
                showNameInFollowing && styles.switchOn,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setShowNameInFollowing((current: boolean) => !current)
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  showNameInFollowing && styles.switchThumbOn,
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Theme
              </Text>
              <Text style={[styles.cardText, { color: colors.textMuted }]}>
                Choose whether LOOPA uses a black or white appearance.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.switch,
                theme === "white" && styles.switchOn,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setMode(theme === "black" ? "white" : "black")
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  theme === "white" && styles.switchThumbOn,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
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
    color: "#A0A0A0",
    fontSize: 15,
    marginBottom: 25,
  },
  eyebrow: {
    color: "#777777",
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
    color: "#8F8F8F",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333333",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cardText: {
    color: "#777777",
    fontSize: 12,
    marginTop: 5,
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
    backgroundColor: "#2A2A2A",
    marginVertical: 16,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#333333",
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
    backgroundColor: "#777777",
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    backgroundColor: "#000000",
    alignSelf: "flex-end",
  },

  themeButtonTextActive: {
    color: "#000000",
  },
});
