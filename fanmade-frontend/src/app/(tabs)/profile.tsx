import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ContentTab = "Videos" | "Library" | "Posts" | "Liked";

const libraryItems = [
  { id: "lib-1", title: "My First Comic", pages: "24 pages", kind: "Comic" },
  { id: "lib-2", title: "A Small Book", pages: "48 pages", kind: "Book" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    myRing === "ring-glow" ? "Glow Ring" :
    myRing === "ring-gold" ? "Gold Ring" :
    myRing === "ring-white" ? "White Ring" :
    myRing === "ring-black" ? "Black Ring" : "No Ring";

  // Banner styles — Banner from Coins
  const bannerStyle =
    myBanner === "banner-loopa" ? styles.bannerLoopa :
    myBanner === "banner-white" ? styles.bannerWhite :
    myBanner === "banner-black" ? styles.bannerBlack : styles.bannerNone;

  const bannerLabel =
    myBanner === "banner-loopa" ? "LOOPA Banner" :
    myBanner === "banner-white" ? "White Banner" :
    myBanner === "banner-black" ? "Black Banner" : "No Banner";

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}>
        <View>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8} onPress={() => Alert.alert("Add Account", "Adding or connecting an account will connect here.")}>
              <MaterialCommunityIcons name="plus" size={27} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Profile</Text>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8} onPress={openMenu}>
              <MaterialCommunityIcons name="menu" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.glassIdentity}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />

            {/* BANNER — from Coins Shop */}
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/settings/wallet")} style={[styles.banner, bannerStyle]}>
              <Text style={styles.bannerText}>{bannerLabel}</Text>
              <Text style={styles.bannerEdit}>Tap to change Banner</Text>
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
                  <MaterialCommunityIcons name="plus" size={18} color="#000000" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => router.push("/settings/wallet")} style={styles.coinsRow}>
                <MaterialCommunityIcons name="coins" size={14} color="#AAAAAA" />
                <Text style={styles.ringLabel}>{ringLabel} • {coins} Coins • Tap to change</Text>
              </TouchableOpacity>

              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>LOOPA User</Text>
                <View style={styles.profileActions}>
                  <TouchableOpacity style={styles.smallProfileButton} activeOpacity={0.8} onPress={() => Alert.alert("Edit Profile", "Profile editing will connect here.")}>
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.smallProfileButton} activeOpacity={0.8} onPress={shareProfile}>
                    <MaterialCommunityIcons name="share-variant-outline" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.profileUsername}>@fanmadeuser</Text>
              <View style={styles.accountBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Fan account</Text>
              </View>
              <Text style={styles.bioButtonText}>{bio}</Text>
              <View style={styles.famiBioRow}>
                <MaterialCommunityIcons name="sparkles" size={13} color="#888888" />
                <Text style={styles.famiBioNote}>Bio by Fami — updates automatically</Text>
              </View>
              <Text style={styles.privateUid}>UID is private</Text>
            </View>
          </View>
        </View>

        {/* RING SIDE — Ring + Banner side by side */}
        <View style={styles.ringSideWrap}>
          <Text style={styles.ringSideLabel}>RING SIDE</Text>
          <View style={styles.ringSideCard}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.ringSideLeft}>
              <View style={[styles.ringSideAvatarOuter, ringStyle]}>
                <BlurView intensity={60} tint="dark" style={styles.ringSideAvatar}>
                  <Text style={styles.ringSideAvatarText}>F</Text>
                </BlurView>
              </View>
              <Text style={styles.ringSideName}>{ringLabel}</Text>
              <Text style={styles.ringSideSub}>{coins} Coins</Text>
            </View>
            <View style={styles.ringSideDivider} />
            <View style={styles.ringSideRight}>
              <View style={[styles.bannerMini, bannerStyle]}>
                <Text style={styles.bannerMiniText}>{bannerLabel}</Text>
              </View>
              <Text style={styles.ringSideName}>Banner Side</Text>
              <Text style={styles.ringSideSub}>Your banner from Coins</Text>
              <TouchableOpacity style={styles.ringSideButton} activeOpacity={0.8} onPress={() => router.push("/settings/wallet")}>
                <Text style={styles.ringSideButtonText}>Change Ring & Banner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.socialStats}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <TouchableOpacity style={styles.socialStat} activeOpacity={0.8} onPress={() => router.push("/profile/fans")}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Fans</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.socialStat} activeOpacity={0.8} onPress={() => router.push("/profile/creators")}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Creators</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.socialStat}>
              <Text style={styles.socialNumber}>0</Text>
              <Text style={styles.socialLabel}>Likes</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.profileHighlights}>
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.8} onPress={() => {}}>
              <View style={styles.newHighlightCircle}><MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" /></View>
              <Text style={styles.highlightLabel}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.highlightItem} activeOpacity={0.8} onPress={() => {}}>
              <View style={styles.highlightCircle}><MaterialCommunityIcons name="image-outline" size={25} color="#555555" /></View>
              <Text style={styles.highlightLabel}>Highlight</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>Your LOOPA</Text>
          <Text style={styles.contentCount}>{activeTab === "Library" ? `${libraryItems.length} items` : "0 items"}</Text>
        </View>

        <View style={styles.contentTabs}>
          {(["Videos", "Library", "Posts", "Liked"] as ContentTab[]).map((tab) => {
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
          {activeTab === "Library" ? (
            <View style={styles.libraryList}>
              {libraryItems.map((book) => (
                <View key={book.id} style={styles.libraryCard}>
                  <View style={styles.libraryIcon}>
                    <MaterialCommunityIcons name="book-open-outline" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.libraryInfo}>
                    <Text style={styles.libraryCardTitle}>{book.title}</Text>
                    <Text style={styles.libraryCardMeta}>{book.pages} • {book.kind}</Text>
                  </View>
                  <TouchableOpacity style={styles.libraryShare} activeOpacity={0.8} onPress={() => Alert.alert("Share", "Sharing your comic / book will connect to the LOOPA sharing system.")}>
                    <MaterialCommunityIcons name="share-variant-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              <Text style={styles.libraryNote}>Others can share their comics and books here too.</Text>
            </View>
          ) : (
            <View style={styles.gridEmptyState}>
              <MaterialCommunityIcons name={activeTab === "Videos" ? "play" : activeTab === "Posts" ? "post-outline" : "heart-outline"} size={28} color="#FFFFFF" />
              <Text style={styles.gridEmptyTitle}>{activeTab === "Videos" ? "No videos yet" : activeTab === "Posts" ? "No posts yet" : "Nothing liked yet"}</Text>
              <Text style={styles.gridEmptyText}>{activeTab === "Liked" ? "Liked content will appear here." : "Your LOOPA content will appear here."}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
          <TouchableOpacity activeOpacity={1} style={styles.menuPanel} onPress={(e) => e.stopPropagation()}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.60)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <Text style={styles.menuTitle}>LOOPA</Text>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("/settings"); }}>
              <Text style={styles.menuItemText}>Account & Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("/settings/wallet"); }}>
              <Text style={styles.menuItemText}>Wallet — Coins, Ring, Banner</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("/privacy"); }}>
              <Text style={styles.menuItemText}>Privacy</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => { closeMenu(); router.push("/creator-settings"); }}>
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
  ringWhite: { backgroundColor: "#FFFFFF" },
  ringBlack: { backgroundColor: "#000000", borderWidth: 2, borderColor: "rgba(255,255,255,0.4)" },
  ringGold: { backgroundColor: "#FFD700" },
  ringGlow: { backgroundColor: "#FFFFFF", shadowColor: "#FFFFFF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 18, elevation: 10 },
  ringNone: { backgroundColor: "rgba(255,255,255,0.35)" },
  coinsRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  ringLabel: { color: "#AAAAAA", fontSize: 11, fontWeight: "600" },
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
  famiBioRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  famiBioNote: { color: "#888888", fontSize: 11, textAlign: "center" },
  privateUid: { color: "#666666", fontSize: 10, textAlign: "center", marginTop: 7 },
  // RING SIDE
  ringSideWrap: { marginTop: 14 },
  ringSideLabel: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
  ringSideCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 22, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  ringSideLeft: { flex: 1, alignItems: "center" },
  ringSideAvatarOuter: { width: 64, height: 64, borderRadius: 32, padding: 3 },
  ringSideAvatar: { flex: 1, borderRadius: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.50)", backgroundColor: "rgba(0,0,0,0.55)", overflow: "hidden" },
  ringSideAvatarText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  ringSideName: { color: "#FFFFFF", fontSize: 13, fontWeight: "800", marginTop: 8, textAlign: "center" },
  ringSideSub: { color: "#AAAAAA", fontSize: 11, marginTop: 2, textAlign: "center" },
  ringSideDivider: { width: 1, height: 86, backgroundColo