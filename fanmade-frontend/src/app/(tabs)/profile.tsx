import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const [tab, setTab] = useState("Creator");
  const [iconTab, setIconTab] = useState("video");

  return (
    <View style={styles.container}>
      {/* Banner — layout from picture, black + white only */}
      <View style={styles.banner}>
        <Pressable style={styles.topBtn} onPress={() => router.push("/profile/edit")}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.topBtn} onPress={() => router.push("/settings")}>
          <MaterialCommunityIcons name="cog-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Avatar + Ring */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Creator / Like / Fan — from picture */}
      <View style={styles.tabs}>
        {["Creator", "Like", "Fan"].map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Icons row — from picture */}
      <View style={styles.iconRow}>
        {[
          { id: "video", icon: "play-box-multiple-outline" },
          { id: "liked", icon: "heart-outline" },
          { id: "repost", icon: "repeat" },
          { id: "views", icon: "account-group-outline" },
        ].map((it: any) => (
          <Pressable key={it.id} style={[styles.iconBtn, iconTab === it.id && styles.iconBtnActive]} onPress={() => setIconTab(it.id)}>
            <MaterialCommunityIcons name={it.icon} size={22} color={iconTab === it.id ? "#000000" : "#FFFFFF"} />
          </Pressable>
        ))}
      </View>

      {/* Grid — from picture, your videos */}
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <View key={n} style={styles.gridItem}>
            <MaterialCommunityIcons name="play" size={22} color="#FFFFFF" />
          </View>
        ))}
      </View>

      {/* Bottom bar — from picture */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomBtn} onPress={() => router.push("/")}>
          <MaterialCommunityIcons name="home-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.bottomBtn} onPress={() => router.push("/explore")}>
          <MaterialCommunityIcons name="compass-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.plusBtn} onPress={() => router.push("/create")}>
          <MaterialCommunityIcons name="plus" size={26} color="#000000" />
        </Pressable>
        <Pressable style={styles.bottomBtn} onPress={() => router.push("/notifications")}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.bottomBtn} onPress={() => router.push("/profile")}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  banner: { height: 170, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", flexDirection: "row", justifyContent: "space-between", padding: 14, paddingTop: 50 },
  topBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.50)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center" },
  avatarWrap: { alignItems: "center", marginTop: -45 },
  avatarRing: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#000000", borderWidth: 2, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: "rgba(255,255,255,0.10)", alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 16, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 999, padding: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: "center" },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: "#000000" },
  iconRow: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 14 },
  iconBtn: { flex: 1, height: 42, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", alignItems: "center", justifyContent: "center" },
  iconBtnActive: { backgroundColor: "#FFFFFF" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 16, marginTop: 14 },
  gridItem: { width: "31%", aspectRatio: 1, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", alignItems: "center", justifyContent: "center" },
  bottomBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 16, marginHorizontal: 16, marginBottom: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  bottomBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  plusBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
});