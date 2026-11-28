import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        {/* Profile card — from picture */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={32} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Your Name</Text>
            <Text style={styles.profileUid}>UID: 000000</Text>
          </View>
          <MaterialCommunityIcons name="check-decagram" size={22} color="#FFFFFF" />
        </View>

        {/* Rows — from picture */}
        <Pressable style={styles.row} onPress={() => Alert.alert("Account", "Account will show here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="account-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Account</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => router.push("/wallet")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="wallet-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Wallet</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => Alert.alert("Language", "Language will show here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="translate" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Language</Text>
          <Text style={styles.rowValue}>English (US)</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => router.push("/privacy")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="shield-check-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Security & Privacy</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => Alert.alert("Notification", "Notification will show here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="bell-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Notification</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => Alert.alert("Help & Support", "Help will show here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="help-circle-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Help & Support</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={() => Alert.alert("Log out", "Log out will connect here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="logout" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Log out</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable style={styles.deleteRow} onPress={() => Alert.alert("Delete Account", "Delete will show here.")}>
          <View style={styles.rowIcon}><MaterialCommunityIcons name="delete-outline" size={20} color="#000000" /></View>
          <Text style={styles.rowText}>Delete Account</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: "#FFFFFF", fontSize: 15, marginBottom: 16 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginBottom: 16 },
  profileCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", marginBottom: 16 },
  avatarRing: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#000000", borderWidth: 2, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.10)", alignItems: "center", justifyContent: "center" },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  profileUid: { color: "#AAAAAA", fontSize: 12, marginTop: 3 },
  row: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", marginBottom: 10 },
  deleteRow: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", marginBottom: 10 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginLeft: 12 },
  rowValue: { color: "#AAAAAA", fontSize: 12, marginRight: 8 },
  chevron: { color: "#FFFFFF", fontSize: 20 },
});