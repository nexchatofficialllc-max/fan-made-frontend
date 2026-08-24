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

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>FAN MADE</Text>
            <Text style={styles.title}>Profile</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.8}
            onPress={() => router.push("../settings")}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>

          <Text style={styles.name}>Fan Made User</Text>

          <Text style={styles.username}>@fanmadeuser</Text>

          <Text style={styles.uid}>UID: Your Fan Made UID</Text>

          <Text style={styles.bio}>
            Welcome to my Fan Made profile.
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Content</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Fan Made</Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <View style={styles.optionIcon}>
            <Text>🎬</Text>
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Your Content</Text>
            <Text style={styles.optionDescription}>
              View the content you've created.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.8}
          onPress={() => router.push("../settings")}
        >
          <View style={styles.optionIcon}>
            <Text>⚙️</Text>
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Settings</Text>
            <Text style={styles.optionDescription}>
              Account, privacy, security and preferences.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
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
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 22,
  },

  eyebrow: {
    color: "#777C8E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 5,
  },

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  settingsIcon: {
    color: "#FFFFFF",
    fontSize: 21,
  },

  profileCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(120,100,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 15,
  },

  username: {
    color: "#9EA3B3",
    fontSize: 13,
    marginTop: 4,
  },

  uid: {
    color: "#777C8E",
    fontSize: 11,
    marginTop: 10,
  },

  bio: {
    color: "#A9ADBB",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 12,
  },

  editButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  editButtonText: {
    color: "#05060A",
    fontSize: 13,
    fontWeight: "800",
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 14,
    paddingVertical: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  statLabel: {
    color: "#777C8E",
    fontSize: 11,
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 13,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.065)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  optionText: {
    flex: 1,
    paddingLeft: 13,
  },

  optionTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  optionDescription: {
    color: "#777C8E",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  arrow: {
    color: "#8F94A5",
    fontSize: 28,
    paddingHorizontal: 5,
  },

  bottomSpace: {
    height: 20,
  },
});
