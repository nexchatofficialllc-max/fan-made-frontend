import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type ContentTab = "Videos" | "Manga" | "Posts" | "Liked";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTab>("Videos");
  const [menuOpen, setMenuOpen] = useState(false);

  // Coins Shop — from Settings > Wallet > profiles.ring / profiles.banner
  // TODO: load from Supabase profiles: ring, banner
  const [myRing] = useState("ring-glow"); // ring-white | ring-black | ring-gold | ring-glow | none
  const [myBanner] = useState("banner-loopa"); // banner-white | banner-black | banner-loopa | none
  const [coins] = useState(1250);

  const bio = "Fami auto bio — watches anime, makes fan videos, chats in Heylo.";

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const shareProfile = () => {
    Alert.alert("Share Profile", "Profile sharing will connect to the LOOPA sharing system.");
  };

  // Ring styles — Character Ring from Coins
  const ringStyle =
    myRing === "ring-glow" ? styles.ringGlow :
    myRing === "ring-gold" ? styles.ringGold :
    myRing === "ring-white" ? styles.ringWhite :
    myRing === "ring-black" ? styles.ringBlack : styles.ringNone;

  const ringLabel =
    myRing === "ring-glow" ? "◉ Glow Ring" :
    myRing === "ring-gold" ? "◎ Gold Ring" :
    myRing === "ring-white" ? "○ White Ring" :
    myRing === "ring-black" ? "● Black Ring" : "No Ring";

  // Banner styles — Banner from Coins
  const bannerStyle =
    myBanner === "banner-loopa" ? styles.bannerLoopa :
    myBanner === "banner-white" ? styles.bannerWhite :
    myBanner === "banner-black" ? styles.bannerBlack : styles.bannerNone;

  const bannerLabel =
    myBanner === "banner-loopa" ? "LOOPA ✦ Banner" :
    myBanner === "banner-white" ? "White Banner" :
    myBanner === "banner-black" ? "Black Banner" : "No Banner";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8} onPress={() => Alert.alert("Add Account", "Adding or connecting an account will connect here.")}>
              <Text style={styles.headerIconText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Profile</Text>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8} onPress={openMenu}>
              <Text style={styles.headerMenuText}>☰</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.glassIdentity}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />

            {/* BANNER — from Coins Shop */}
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("../settings/wallet")} style={[styles.banner, bannerStyle]}>
              <Text style={styles.bannerText}>{bannerLabel}</Text>
              <Text style={styles.bannerEdit}>Tap to change Banner →</Text>
            </TouchableOpacity>

            <View style={styles.profileIdentity}>
              {/* AVATAR + CHARACTER RING — from Coins Shop */}
              <View style={styles.avatarWrapperLarge}>
                <View style={[styles.avatarOuter, ringStyle]}>
                  <BlurView intensity={60} tint="dark" style={styles.avatarLarge}>
                    <Text style={styles.avatarTextLarge}>F</Text>
                  </BlurView>
                </View>
                <TouchableOpacity style={styles.avatarAddLarge} activeOpacity={0.8} onPress={() => Alert.alert("Profile Picture", "Profile picture selection will connect here.")}>
                  <Text style={styles.avatarAddText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => router.push("../settings/wallet")}>
                <Text style={styles.ringLabel}>{ringLabel} • 🪙 {coins} Coins • Tap to change</Text>
              </TouchableOpacity>

              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>LOOPA User</Text>
                <View style={styles.profileActions}>
                  <TouchableOpacity style={styles.smallProfileButton} activeOpacity={0.8} onPress={() => Alert.alert("Edit Profile", "Profile editing will connect here.")}>
                    <Text style={styles.smallProfileButtonText}>⭐</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.smallProfileButton} activeOpacity={0.8} onPress={shareProfile}>
                    <Text style={styles.smallProfileButtonText}>✓</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.profileUsername}>@fanmadeuser</Text>
              <View style={styles.accountBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Fan account</Text>
              </View>
              <Text style={styles.bioButtonText}>{bio}</Text>
              <Text style={styles.famiBioNote}>✨ Bio by Fami — updates automatically</Text>
              <Text style={styles.privateUid}>UID is private</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(100)}>
          <View style={styles.socialStats}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <TouchableOpacity style={styles.socialStat} activeOpacity={0.8} onPress={() => router.push("../profile/fans")}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Fans</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.socialStat} activeOpacity={0.8} onPress={() => router.push("../profile/creators")}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Creators</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.socialStat}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Likes</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(160)}>
          <View style={styles.profileHighlights}>
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.8} onPress={() => {}}>
              <View style={styles.newHighlightCircle}><Text style={styles.newHighlightPlus}>+</Text></View>
              <Text style={styles.highlightLabel}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.8} onPress={() => {}}>
              <View style={styles.highlightCircle}><Text style={styles.highlightPlaceholder}>○</Text></View>
              <Text style={styles.highlightLabel}>Highlight</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>Your LOOPA</Text>
          <Text style={styles.contentCount}>0 items</Text>
        </View>

        <View style={styles.contentTabs}>
          {(["Videos", "Manga", "Posts", "Liked"] as ContentTab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity key={tab} style={styles.contentTab} activeOpacity={0.75} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.contentTabText, active && styles.contentTabTextActive]}>{tab}</Text>
                {active && <View style={styles.activeLine} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.contentGrid}>
          <View style={styles.gridEmptyState}>
            <Text style={styles.gridEmptyIcon}>{activeTab === "Videos" ? "▶" : activeTab === "Manga" ? "▤" : activeTab === "Posts" ? "✦" : "♡"}</Text>
            <Text style={styles.gridEmptyTitle}>{activeTab === "Videos" ? "No videos yet" : activeTab === "Manga" ? "No manga yet" : activeTab === "Posts" ? "No posts yet" : "Nothing liked yet"}</Text>
            <Text style={styles.gridEmptyText}>{activeTab === "Liked" ? "Liked content will appear here." : "Your LOOPA content will appear here."}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
          <TouchableOpacity activeOpacity={1} style={styles.menuPanel} onPress={(e) => e.stopPropagation()}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.60)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <Text style={styles.menuTitle}>LOOPA</Text>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("../settings"); }}>
              <Text style={styles.menuItemText}>Account & Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("../settings/wallet"); }}>
              <Text style={styles.menuItemText}>🪙 Wallet — Coins, Ring, Banner</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("../privacy"); }}>
              <Text style={styles.menuItemText}>Privacy</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("./creator-settings"); }}>
              <Text style={styles.menuItemText}>Creator Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  profileHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, paddingBottom: 18 },
  profileHeaderTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  headerIconButton: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  headerIconText: { color: "#FFFFFF", fontSize: 27, fontWeight: "400" },
  headerMenuText: { color: "#FFFFFF", fontSize: 21, fontWeight: "700" },
  glassIdentity: { borderRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)" },
  // Banner
  banner: { height: 72, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.15)" },
  bannerWhite: { backgroundColor: "#FFFFFF" },
  bannerBlack: { backgroundColor: "#111111" },
  bannerLoopa: { backgroundColor: "#000000" },
  bannerNone: { backgroundColor: "rgba(255,255,255,0.05)" },
  bannerText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  bannerEdit: { color: "#AAAAAA", fontSize: 10, marginTop: 4 },
  profileIdentity: { alignItems: "center", paddingTop: 18, paddingBottom: 16, paddingHorizontal: 16 },
  avatarWrapperLarge: { width: 92, height: 92, position: "relative" },
  avatarOuter: { width: 92, height: 92, borderRadius: 46, padding: 3 },
  avatarLarge: { flex: 1, borderRadius: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.50)", backgroundColor: "rgba(0,0,0,0.55)", overflow: "hidden" },
  avatarTextLarge: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  // Rings — bought with Coins
  ringWhite: { backgroundColor: "#FFFFFF" },
  ringBlack: { backgroundColor: "#000000", borderWidth: 2, borderColor: "rgba(255,255,255,0.4)" },
  ringGold: { backgroundColor: "#FFD700" },
  ringGlow: { backgroundColor: "#FFFFFF", shadowColor: "#FFFFFF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 18, elevation: 10 },
  ringNone: { backgroundColor: "rgba(255,255,255,0.35)" },
  ringLabel: { color: "#AAAAAA", fontSize: 11, marginTop: 10, fontWeight: "600" },
  avatarAddLarge: { position: "absolute", right: -1, bottom: 1, width: 27, height: 27, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#000000" },
  avatarAddText: { color: "#000000", fontSize: 20, lineHeight: 21, fontWeight: "700" },
  profileNameRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  profileName: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  profileUsername: { color: "#AAAAAA", fontSize: 13, marginTop: 3 },
  profileActions: { flexDirection: "row", marginLeft: 8 },
  smallProfileButton: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#111111", borderWidth: 1, borderColor: "#333333", marginLeft: 5 },
  smallProfileButtonText: { color: "#FFFFFF", fontSize: 13 },
  accountBadge: { flexDirection: "row", alignItems: "center", marginTop: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: "#111111", borderWidth: 1, borderColor: "#242424" },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF", marginRight: 6 },
  badgeText: { color: "#AAAAAA", fontSize: 10, fontWeight: "700" },
  bioButtonText: { color: "#D8D8D8", fontSize: 13, lineHeight: 19, fontWeight: "500", textAlign: "center", marginTop: 10, paddingHorizontal: 12 },
  famiBioNote: { color: "#888888", fontSize: 11, marginTop: 6, textAlign: "center" },
  privateUid: { color: "#666666", fontSize: 10, textAlign: "center", marginTop: 7 },
  socialStats: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 14, paddingVertical: 18, borderRadius: 22, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  socialStat: { alignItems: "center", flex: 1 },
  socialNumber: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  socialLabel: { color: "#AAAAAA", fontSize: 11, marginTop: 4 },
  divider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.15)" },
  profileHighlights: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: 24, marginTop: 18, marginBottom: 18 },
  highlightItem: { alignItems: "center", minWidth: 72 },
  newHighlightCircle: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center", backgroundColor: "#111111", borderWidth: 1, borderColor: "#2A2A2A" },
  newHighlightPlus: { color: "#FFFFFF", fontSize: 28, fontWeight: "300" },
  highlightCircle: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center", backgroundColor: "#111111", borderWidth: 1, borderColor: "#2A2A2A" },
  highlightPlaceholder: { color: "#555555", fontSize: 25 },
  highlightLabel: { color: "#888888", fontSize: 11, fontWeight: "600", marginTop: 6 },
  contentHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 10 },
  sectionTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  contentCount: { color: "#888888", fontSize: 12, fontWeight: "600" },
  contentTabs: { flexDirection: "row", marginTop: 2, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.10)" },
  contentTab: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", position: "relative" },
  contentTabText: { color: "#888888", fontSize: 12, fontWeight: "700" },
  contentTabTextActive: { color: "#FFFFFF", fontWeight: "800" },
  activeLine: { position: "absolute", bottom: -1, left: 18, right: 18, height: 2, borderRadius: 2, backgroundColor: "#FFFFFF" },
  contentGrid: { marginTop: 16 },
  gridEmptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20, borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(0,0,0,0.30)" },
  gridEmptyIcon: { color: "#FFFFFF", fontSize: 28 },
  gridEmptyTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 12 },
  gridEmptyText: { color: "#888888", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 19 },
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.60)", justifyContent: "flex-end" },
  menuPanel: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.80)", padding: 20, paddingBottom: 32 },
  menuTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginBottom: 16 },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.10)" },
  menuItemText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  menuArrow: { color: "#AAAAAA", fontSize: 20 },
});