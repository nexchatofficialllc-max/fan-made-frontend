import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getFamiAvatar } from "../lib/fami-avatar";

function GlassCard({ children, onPress, delay = 0 }: { children: React.ReactNode; onPress?: () => void; delay?: number }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)} style={style}>
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
      >
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.topReflection} pointerEvents="none" />
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function FamiScreen() {
  const router = useRouter();
  const [famiImage, setFamiImage] = React.useState<string | null>(null);
  const [ticketSent, setTicketSent] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const saved = await getFamiAvatar();
      if (saved) setFamiImage(saved);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
          <Text style={styles.smallLabel}>LOOPA</Text>
          <Text style={styles.title}>Fami</Text>
          <Text style={styles.subtitle}>Your Loopa assistant — working in the background. No chat here.</Text>
        </Animated.View>

        {/* Fami Header Card */}
        <Animated.View entering={FadeInUp.duration(400).delay(50)}>
          <View style={styles.hero}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(255,255,255,0.20)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.topReflection} pointerEvents="none" />
            <View style={styles.avatar}>
              {famiImage ? <Image source={{ uri: famiImage }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>🌸</Text>}
            </View>
            <Text style={styles.heroName}>Fami 🌸</Text>
            <Text style={styles.heroText}>She writes your bio, picks your Loops, and keeps Loopa safe for you. She does not chat in Loopa.</Text>
            <View style={styles.pill}><Text style={styles.pillText}>● Active in background</Text></View>
          </View>
        </Animated.View>

        {/* Chat in Heylo — ONLY place to chat with Fami */}
        <GlassCard delay={100} onPress={() => router.push("/heylo/fami")}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>💬</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>Chat with Fami in Heylo</Text>
              <Text style={styles.cardText}>Fami chat lives in Heylo only. Tap to open it there.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        {/* What Fami does in Loopa */}
        <Text style={styles.sectionTitle}>What Fami does in Loopa</Text>

        <GlassCard delay={140} onPress={() => router.push("/profile")}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>✨</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>Your Bio — by Fami</Text>
              <Text style={styles.cardText}>Fami writes your bio from your Loopa + Heylo activity. No typing needed.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        <GlassCard delay={180} onPress={() => router.push("/explore")}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>◉</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>Loop Picks for You</Text>
              <Text style={styles.cardText}>Fami curates Loops you might love, based on what you watch.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        <GlassCard delay={220} onPress={() => router.push("/loop-stroll")}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>♧</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>Loop Stroll</Text>
              <Text style={styles.cardText}>Hands-free auto-stroll, picked by Fami for your mood.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        {/* Help — no chat, ticket only */}
        <Text style={styles.sectionTitle}>Help & Support</Text>

        <GlassCard delay={260} onPress={() => router.push("/help")}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>?</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>Help Center</Text>
              <Text style={styles.cardText}>Guides, FAQs, and how Loopa works.</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        <GlassCard delay={300} onPress={() => setTicketSent(true)}>
          <View style={styles.row}>
            <View style={styles.icon}><Text style={styles.iconText}>🛟</Text></View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{ticketSent ? "Request Sent ✓" : "Report a Problem"}</Text>
              <Text style={styles.cardText}>{ticketSent ? "LOOPA Support Team will review it. No chat needed." : "Send a report to LOOPA Support Team. They will review it."}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>

        <Text style={styles.note}>Fami does not chat in Loopa. If you need to talk to Fami, open Heylo.</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  back: { color: "#fff", fontSize: 16, marginBottom: 12 },
  smallLabel: { color: "#AAAAAA", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 6 },
  subtitle: { color: "#AAAAAA", fontSize: 14, marginTop: 6, lineHeight: 20 },
  hero: { marginTop: 20, borderRadius: 22, padding: 20, alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  topReflection: { position: "absolute", top: 0, left: 28, right: 28, height: 1, backgroundColor: "rgba(255,255,255,0.70)" },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatarText: { fontSize: 32 },
  heroName: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 12 },
  heroText: { color: "#AAAAAA", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
  pill: { marginTop: 12, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 24, marginBottom: 12 },
  card: { marginBottom: 10, borderRadius: 20, padding: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)" },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 22 },
  info: { flex: 1, marginLeft: 12 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  cardText: { color: "#AAAAAA", fontSize: 13, marginTop: 3, lineHeight: 18 },
  arrow: { color: "#fff", fontSize: 30, fontWeight: "300", marginLeft: 8 },
  note: { color: "#777", fontSize: 12, textAlign: "center", marginTop: 16, lineHeight: 18 },
});