import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const OPTIONS = [
  "Anime",
  "Manga",
  "Action",
  "Comedy",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Mystery",
  "Music",
];

const SOCIAL_VIBES = [
  { id: "watch-with-【entity-friends¦canonical_name=Friends】", label: "Watch with 【entity-Friends¦canonical_name=Friends】", desc: "See what your 【entity-Friends¦canonical_name=Friends】 are watching" },
  { id: "follow-creators", label: "Follow Creators", desc: "Creator posts in your feed" },
  { id: "join-communities", label: "Join Communities", desc: "Community posts + discussions" },
  { id: "fan-made", label: "Fan Made", desc: "Fan art, edits, fan videos" },
  { id: "comment-react", label: "Comment & React", desc: "React, comment, share videos" },
  { id: "fami-picks", label: "@fami Picks", desc: "Let Fami suggest videos for you" },
];

const SUGGESTED_CREATORS = [
  { id: "c1", name: "LOOPA Originals", handle: "@loopa", fans: "120K Fans", bio: "Official Loopa anime + originals" },
  { id: "c2", name: "Mika Edits", handle: "@mika", fans: "45K Fans", bio: "Anime edits + fan art" },
  { id: "c3", name: "Kai Animates", handle: "@kai", fans: "32K Fans", bio: "Animation + behind the scenes" },
];

export default function WatchPreferencesScreen() {
  const router = useRouter();
  const { accountType } = useLocalSearchParams<{ accountType?: string }>();
  const [selected, setSelected] = useState<string[]>([]);
  const [socialSelected, setSocialSelected] = useState<string[]>(["follow-creators"]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [showActivity, setShowActivity] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);

  function toggleOption(option: string) {
    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function toggleSocial(id: string) {
    setSocialSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleFollow(id: string) {
    setFollowed((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleContinue() {
    if (selected.length === 0) return;
    // Save: watch_prefs = selected, social_prefs = socialSelected,
    // followed_creators = followed, showActivity, allowMentions
    // -> supabase.from("profiles").update({ ... })
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>STEP 2 OF 3 • MAKE LOOPA YOURS</Text>
          <Text style={styles.title}>What do you want to watch?</Text>
          <Text style={styles.subtitle}>
            Pick a few things you're interested in. LOOPA will use them to shape your starting recommendations.
          </Text>
        </Animated.View>

        {/* Watch interests */}
        <Animated.View entering={FadeInUp.duration(350).delay(60)}>
          <View style={styles.options}>
            {OPTIONS.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  activeOpacity={0.8}
                  onPress={() => toggleOption(option)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.countText}>{selected.length} picked • Pick at least 1</Text>
        </Animated.View>

        {/* SOCIAL — how social do you want Loopa? */}
        <Animated.View entering={FadeInUp.duration(400).delay(120)}>
          <Text style={styles.sectionTitle}>How social do you want Loopa?</Text>
          <Text style={styles.sectionSub}>Pick how your feed feels. You can change this anytime in Settings.</Text>

          <View style={styles.glassCard}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.50)"]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} />
            {SOCIAL_VIBES.map((vibe, i) => {
              const on = socialSelected.includes(vibe.id);
              return (
                <TouchableOpacity
                  key={vibe.id}
                  style={[styles.socialRow, i !== SOCIAL_VIBES.length - 1 && styles.socialRowBorder]}
                  onPress={() => toggleSocial(vibe.id)}
                >
                  <View style={styles.socialInfo}>
                    <Text style={styles.socialLabel}>{vibe.label}</Text>
                    <Text style={styles.socialDesc}>{vibe.desc}</Text>
                  </View>
                  <View style={[styles.toggle, on && styles.toggleOn]}>
                    <View style={[styles.toggleDot, on && styles.toggleDotOn]} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* SOCIAL — creators to follow */}
        <Animated.View entering={FadeInUp.duration(400).delay(180)}>
          <Text style={styles.sectionTitle}>Creators to follow</Text>
          <Text style={styles.sectionSub}>Follow a few to start. Your feed will show their videos first.</Text>

          {SUGGESTED_CREATORS.map((c) => {
            const isFollowing = followed.includes(c.id);
            return (
              <View key={c.id} style={styles.creatorCard}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{c.name[0]}</Text>
                </View>
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorName}>{c.name}</Text>
                  <Text style={styles.creatorHandle}>{c.handle} • {c.fans}</Text>
                  <Text style={styles.creatorBio}>{c.bio}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.followButton, isFollowing && styles.followButtonActive]}
                  onPress={() => toggleFollow(c.id)}
                >
                  <Text style={[styles.followText, isFollowing && styles.followTextActive]}>
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>

        {/* SOCIAL — privacy */}
        <Animated.View entering={FadeInUp.duration(400).delay(240)}>
          <Text style={styles.sectionTitle}>Social privacy</Text>
          <View style={styles.glassCard}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} />
            <TouchableOpacity style={[styles.socialRow, styles.socialRowBorder]} onPress={() => setShowActivity(!showActivity)}>
              <View style={styles.socialInfo}>
                <Text style={styles.socialLabel}>Show my watch activity</Text>
                <Text style={styles.socialDesc}>【entity-Friends¦canonical_name=Friends】 see what you're watching</Text>
              </View>
              <View style={[styles.toggle, showActivity && styles.toggleOn]}>
                <View style={[styles.toggleDot, showActivity && styles.toggleDotOn]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialRow} onPress={() => setAllowMentions(!allowMentions)}>
              <View style={styles.socialInfo}>
                <Text style={styles.socialLabel}>Allow mentions</Text>
                <Text style={styles.socialDesc}>Others can @mention you in comments</Text>
              </View>
              <View style={[styles.toggle, allowMentions && styles.toggleOn]}>
                <View style={[styles.toggleDot, allowMentions && styles.toggleDotOn]} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.privacyHint}>Loopa uses Fans / Creators, not Followers. Heylo uses Friends. Your Fami bio is auto-generated — no manual bio needed.</Text>
        </Animated.View>

        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={selected.length === 0}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            {accountType === "Creator" ? "Finish Setup" : "Start Watching"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.skipText}>You follow {followed.length} creators • {socialSelected.length} social vibes on</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scroll: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  smallLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 10,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#000000",
  },
  countText: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 6,
  },
  sectionSub: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  glassCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 14,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 12,
  },
  socialRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  socialInfo: {
    flex: 1,
  },
  socialLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  socialDesc: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  toggle: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#AAAAAA",
    alignSelf: "flex-start",
  },
  toggleDotOn: {
    backgroundColor: "#000000",
    alignSelf: "flex-end",
  },
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  creatorInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  creatorName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  creatorHandle: {
    color: "#AAAAAA",
    fontSize: 11,
    marginTop: 2,
  },
  creatorBio: {
    color: "#AAAAAA",
    fontSize: 11,
    marginTop: 3,
  },
  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  followButtonActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.40)",
  },
  followText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "800",
  },
  followTextActive: {
    color: "#FFFFFF",
  },
  privacyHint: {
    color: "#AAAAAA",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },
  skipText: {
    color: "#AAAAAA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});