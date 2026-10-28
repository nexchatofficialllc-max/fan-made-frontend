import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

type ContentTab = "Videos" | "Manga" | "Posts" | "Liked";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTab>("Videos");
  const [bio, setBio] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const [bioEditorOpen, setBioEditorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const shareProfile = () => {
    Alert.alert(
      "Share Profile",
      "Profile sharing will connect to the LOOPA sharing system."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Add Account",
                "Adding or connecting an account will connect here."
              )
            }
          >
            <Text style={styles.headerIconText}>+</Text>
          </TouchableOpacity>

          <Text style={styles.profileHeaderTitle}>Profile</Text>

          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.8}
            onPress={openMenu}
          >
            <Text style={styles.headerMenuText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* PROFILE IDENTITY */}
        <View style={styles.profileIdentity}>
          <View style={styles.avatarWrapperLarge}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>F</Text>
            </View>

            <TouchableOpacity
              style={styles.avatarAddLarge}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  "Profile Picture",
                  "Profile picture selection will connect here."
                )
              }
            >
              <Text style={styles.avatarAddText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileNameRow}>
            <Text style={styles.profileName}>LOOPA User</Text>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.smallProfileButton}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Edit Profile",
                    "Profile editing will connect here."
                  )
                }
              >
                <Text style={styles.smallProfileButtonText}>⭐</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallProfileButton}
                activeOpacity={0.8}
                onPress={shareProfile}
              >
                <Text style={styles.smallProfileButtonText}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.profileUsername}>@fanmadeuser</Text>

          <View style={styles.accountBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Fan account</Text>
          </View>

          <TouchableOpacity
            style={styles.bioButton}
            activeOpacity={0.75}
            onPress={() => router.push("../profile/bio")}
          >
            <Text style={styles.bioButtonText}>
              {bio ? bio : "Bio +"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.privateUid}>
            UID is private
          </Text>
        </View>

        <Modal
          visible={bioEditorOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setBioEditorOpen(false)}
        >
          <View style={styles.bioModalOverlay}>
            <View style={styles.bioModal}>
              <Text style={styles.bioModalTitle}>Edit Bio</Text>

              <TextInput
                value={bioDraft}
                onChangeText={setBioDraft}
                placeholder="Add a bio..."
                placeholderTextColor="#666666"
                multiline
                maxLength={150}
                style={styles.bioInput}
              />

              <Text style={styles.bioCharacterCount}>
                {bioDraft.length}/150
              </Text>

              <View style={styles.bioModalActions}>
                <TouchableOpacity
                  style={styles.bioCancelButton}
                  activeOpacity={0.8}
                  onPress={() => setBioEditorOpen(false)}
                >
                  <Text style={styles.bioCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bioSaveButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setBio(bioDraft.trim());
                    setBioEditorOpen(false);
                  }}
                >
                  <Text style={styles.bioSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* STATS */}
        <View style={styles.socialStats}>
          <TouchableOpacity
            style={[
              styles.socialStat,
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("../profile/followers")}
          >
            <Text style={styles.socialNumber}>0</Text>
            <Text style={styles.socialLabel}>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialStat,
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("../profile/following")}
          >
            <Text style={styles.socialNumber}>0</Text>
            <Text style={styles.socialLabel}>Following</Text>
          </TouchableOpacity>

          <View style={styles.socialStat}>
            <Text style={styles.socialNumber}>0</Text>
            <Text style={styles.socialLabel}>Likes</Text>
          </View>
        </View>

        {/* PROFILE HIGHLIGHTS */}
        <View style={styles.profileHighlights}>
          <TouchableOpacity
            style={styles.highlightItem}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <View style={styles.newHighlightCircle}>
              <Text style={styles.newHighlightPlus}>+</Text>
            </View>
            <Text style={styles.highlightLabel}>New</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.highlightItem}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <View style={styles.highlightCircle}>
              <Text style={styles.highlightPlaceholder}>○</Text>
            </View>
            <Text style={styles.highlightLabel}>Highlight</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>Your LOOPA</Text>
          <Text style={styles.contentCount}>0 items</Text>
        </View>

        {/* CONTENT TABS */}
        <View style={styles.contentTabs}>
          {(["Videos", "Manga", "Posts", "Liked"] as ContentTab[]).map(
            (tab) => {
              const active = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.contentTab}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.contentTabText,
                      active && styles.contentTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>

                  {active && <View style={styles.activeLine} />}
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* CONTENT GRID */}
        <View style={styles.contentGrid}>
          <View style={styles.gridEmptyState}>
            <Text style={styles.gridEmptyIcon}>
              {activeTab === "Videos"
                ? "▶"
                : activeTab === "Manga"
                ? "▤"
                : activeTab === "Posts"
                ? "✦"
                : "♡"}
            </Text>

            <Text style={styles.gridEmptyTitle}>
              {activeTab === "Videos"
                ? "No videos yet"
                : activeTab === "Manga"
                ? "No manga yet"
                : activeTab === "Posts"
                ? "No posts yet"
                : "Nothing liked yet"}
            </Text>

            <Text style={styles.gridEmptyText}>
              {activeTab === "Liked"
                ? "Liked content will appear here."
                : "Your LOOPA content will appear here."}
            </Text>
          </View>
        </View>


      </ScrollView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.menuPanel}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.menuTitle}>LOOPA</Text>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                closeMenu();
                router.push("../settings");
              }}
            >
              <Text style={styles.menuItemText}>Account & Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                closeMenu();
                router.push("../privacy");
              }}
            >
              <Text style={styles.menuItemText}>Privacy</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                closeMenu();
                router.push("./creator-settings");
              }}
            >
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
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 18,
  },

  profileHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.38)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.26)",
  },

  headerIconText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "400",
  },

  headerMenuText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  profileIdentity: {
    alignItems: "center",
    paddingTop: 2,
    paddingBottom: 16,
  },

  avatarWrapperLarge: {
    width: 92,
    height: 92,
    position: "relative",
  },

  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  avatarTextLarge: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  avatarAddLarge: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },

  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  profileUsername: {
    color: "#8F94A3",
    fontSize: 13,
    marginTop: 3,
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

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,42,131,0.42)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
  },

  menuIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  identityCard: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(16,42,131,0.32)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.24)",
  },

  identityTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    width: 86,
    height: 86,
    position: "relative",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333333",
  },

  avatarAdd: {
    position: "absolute",
    right: -2,
    bottom: 1,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },

  avatarAddText: {
    color: "#000000",
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "700",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  identityInfo: {
    flex: 1,
    marginLeft: 16,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  nameBlock: {
    flex: 1,
  },

  profileActions: {
    flexDirection: "row",
    marginLeft: 8,
  },

  smallProfileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333333",
    marginLeft: 5,
  },

  smallProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  username: {
    color: "#9EA3B3",
    fontSize: 13,
    marginTop: 4,
  },

  accountBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 6,
  },

  badgeText: {
    color: "#AEB3C2",
    fontSize: 10,
    fontWeight: "700",
  },

  bio: {
    color: "#A9ADBB",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 18,
  },

  actions: {
    flexDirection: "row",
    marginTop: 18,
  },

  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 15,
    backgroundColor: "#00D9FF",
    marginRight: 7,
  },

  primaryButtonText: {
    color: "#07112F",
    fontSize: 13,
    fontWeight: "800",
  },

  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 15,
    backgroundColor: "rgba(16,42,131,0.30)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.32)",
    marginLeft: 7,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  bioButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  bioButtonText: {
    color: "#D8D8D8",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    textAlign: "center",
  },

  privateUid: {
    color: "#656A7A",
    fontSize: 10,
    textAlign: "center",
    marginTop: 7,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 14,
    paddingVertical: 18,
    borderRadius: 22,
    backgroundColor: "rgba(16,42,131,0.28)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.20)",
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

  expandedSocialSection: {
    marginTop: 10,
    marginBottom: 4,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333333",
  },

  expandedSocialTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  expandedSocialText: {
    color: "#8A8A8A",
    fontSize: 12,
    marginTop: 5,
  },

  profileHighlights: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 24,
    marginBottom: 18,
  },

  highlightItem: {
    alignItems: "center",
    minWidth: 72,
  },

  newHighlightCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  newHighlightPlus: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
  },

  highlightCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  highlightPlaceholder: {
    color: "#555555",
    fontSize: 25,
  },

  highlightLabel: {
    color: "#8A8A8A",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },

  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  contentCount: {
    color: "#8A8A8A",
    fontSize: 12,
    fontWeight: "600",
  },

  contentTabs: {
    flexDirection: "row",
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },

  contentTab: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  contentTabText: {
    color: "#686D7D",
    fontSize: 12,
    fontWeight: "700",
  },

  contentTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  activeLine: {
    position: "absolute",
    bottom: -1,
    left: 18,
    right: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#00D9FF",
  },

  contentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 2,
  },

  gridEmptyState: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
  },

  gridEmptyIcon: {
    color: "#777777",
    fontSize: 22,
  },

  gridEmptyTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 10,
  },

  gridEmptyText: {
    color: "#707070",
    fontSize: 11,
    marginTop: 5,
    textAlign: "center",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 38,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  emptyIconText: {
    color: "#A1A5B2",
    fontSize: 21,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: "#707586",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 280,
  },

  accountSectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 13,
  },

  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "flex-end",
  },
  menuPanel: {
    width: 280,
    marginTop: 58,
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(7,17,47,0.98)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.28)",
    borderRadius: 18,
  },
  menuTitle: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 12,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  menuItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  menuArrow: {
    color: "#777777",
    fontSize: 24,
    paddingLeft: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },

  optionIconText: {
    color: "#FFFFFF",
    fontSize: 19,
  },

  optionText: {
    flex: 1,
    paddingLeft: 13,
    paddingRight: 10,
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
    marginTop: 3,
  },

  arrow: {
    color: "#777C8E",
    fontSize: 24,
    paddingHorizontal: 4,
  },

  socialStats: {
    flexDirection: "row",
    width: "100%",
    marginTop: 2,
    marginBottom: 16,
  },

  socialStat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  socialNumber: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  socialLabel: {
    color: "#858585",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },

  bioModalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.72)",
  },

  bioModal: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(7,17,47,0.98)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.30)",
  },

  bioModalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  bioInput: {
    minHeight: 110,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(16,42,131,0.22)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.28)",
    color: "#FFFFFF",
    fontSize: 14,
    textAlignVertical: "top",
  },

  bioCharacterCount: {
    color: "#777777",
    fontSize: 10,
    textAlign: "right",
    marginTop: 6,
  },

  bioModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },

  bioCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#222222",
    marginRight: 8,
  },

  bioCancelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  bioSaveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  bioSaveText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "800",
  },

  bottomSpace: {
    height: 20,
  },
});
