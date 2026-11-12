import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getFamiAvatar } from "../../lib/fami-avatar";
import ChatSheet from "../../components/ChatSheet";

const friends = [
  { id: "f1", name: "jake.loopa", lastMessage: "Hey! Saw your loop 🔥", time: "10:14", unread: 2, avatar: "J" },
  { id: "f2", name: "sunpathwalker", lastMessage: "Forest stroll was calm", time: "09:02", unread: 0, avatar: "S" },
  { id: "f3", name: "danceflow_", lastMessage: "New dance loop out!", time: "Yesterday", unread: 1, avatar: "D" },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [famiImage, setFamiImage] = React.useState<string | null>(null);
  const [openFriend, setOpenFriend] = React.useState<(typeof friends)[0] | null>(null);

  const famiScale = useSharedValue(1);
  const famiAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: famiScale.value }] }));
  const communityScale = useSharedValue(1);
  const communityAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: communityScale.value }] }));

  React.useEffect(() => {
    (async () => { const a = await getFamiAvatar(); if (a) setFamiImage(a); })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Inbox</Text>
        </Animated.View>

        {/* Fami — keep yours */}
        <Animated.View entering={FadeInUp.duration(400).springify()} style={famiAnimatedStyle}>
          <Pressable style={styles.famiCard} onPressIn={() => { famiScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }} onPressOut={() => { famiScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }} onPress={() => router.push("/fami")}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />
            <View style={styles.famiIcon}>{famiImage ? <Image source={{ uri: famiImage }} style={styles.famiIconImage} /> : <Text style={styles.famiIconText}>🌸</Text>}</View>
            <View style={styles.famiInfo}><Text style={styles.famiTitle}>Fami</Text><Text style={styles.famiText}>Need help with LOOPA? Talk to Fami.</Text></View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </Animated.View>

        {/* Community — keep yours */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={communityAnimatedStyle}>
          <Pressable style={styles.communityCard} onPressIn={() => { communityScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }} onPressOut={() => { communityScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }} onPress={() => router.push("/community")}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.04)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />
            <View style={styles.communityIcon}><Text style={styles.communityIconText}>◉</Text></View>
            <View style={styles.communityInfo}><Text style={styles.communityTitle}>Community</Text><Text style={styles.communityText}>Chat with fans and join the LOOPA community.</Text></View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </Animated.View>

        {/* Friends — NEW: each opens its own chat */}
        <Text style={styles.friendsTitle}>Friends — Heylo Chats</Text>
        {friends.map((f) => (
          <Pressable key={f.id} style={styles.friendCard} onPress={() => setOpenFriend(f)}>
            <View style={styles.friendAvatar}><Text style={styles.friendAvatarText}>{f.avatar}</Text></View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>@{f.name}</Text>
              <Text style={styles.friendLast} numberOfLines={1}>{f.lastMessage}</Text>
            </View>
            <View style={styles.friendRight}>
              <Text style={styles.friendTime}>{f.time}</Text>
              {f.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{f.unread}</Text></View>}
            </View>
          </Pressable>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Chat opens for the friend you tapped */}
      {openFriend && <ChatSheet visible={!!openFriend} onClose={() => setOpenFriend(null)} friendName={openFriend.name} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  smallLabel: { color: "#AAAAAA", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#FFFFFF", fontSize: 32, fontWeight: "800", marginTop: 6 },
  famiCard: { marginTop: 24, minHeight: 76, borderRadius: 20, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)" },
  famiIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", overflow: "hidden" },
  famiIconText: { fontSize: 23 },
  famiIconImage: { width: 48, height: 48, borderRadius: 24 },
  famiInfo: { flex: 1, marginLeft: 12 },
  famiTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  famiText: { color: "#AAAAAA", fontSize: 13, marginTop: 3 },
  arrow: { color: "#FFFFFF", fontSize: 30, fontWeight: "300", marginLeft: 8 },
  communityCard: { marginTop: 12, minHeight: 76, borderRadius: 20, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  communityIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  communityIconText: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  communityInfo: { flex: 1, marginLeft: 12 },
  communityTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  communityText: { color: "#AAAAAA", fontSize: 13, marginTop: 3, lineHeight: 18 },
  friendsTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 24, marginBottom: 12 },
  friendCard: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  friendAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
  friendAvatarText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  friendInfo: { flex: 1, marginLeft: 12 },
  friendName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  friendLast: { color: "#aaa", fontSize: 13, marginTop: 3 },
  friendRight: { alignItems: "flex-end", gap: 6 },
  friendTime: { color: "#aaa", fontSize: 11 },
  unread: { backgroundColor: "#fff", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  unreadText: { color: "#000", fontSize: 11, fontWeight: "800" },
  bottomSpace: { height: 30 },
});