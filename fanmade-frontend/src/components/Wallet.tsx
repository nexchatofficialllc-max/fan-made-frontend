import React from "react";
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const RINGS = [
  { id: "ring-white", name: "White Ring", price: 100 },
  { id: "ring-black", name: "Black Ring", price: 100 },
  { id: "ring-gold", name: "Gold Ring", price: 500 },
  { id: "ring-glow", name: "Glow Ring", price: 1000 },
];
const BANNERS = [
  { id: "banner-white", name: "White Banner", price: 150 },
  { id: "banner-black", name: "Black Banner", price: 150 },
  { id: "banner-loopa", name: "Loopa Banner", price: 800 },
];

export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [coins] = React.useState(1250); // TODO: from getBalance()
  const [sendTo, setSendTo] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState("");
  const [myRing, setMyRing] = React.useState("ring-white");
  const [myBanner, setMyBanner] = React.useState("banner-black");
  const [tab, setTab] = React.useState<"send" | "ring" | "banner">("send");

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
          <Text style={styles.title}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Coins — only here, not on Profile */}
        <View style={styles.coinCard}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.55)"]} style={StyleSheet.absoluteFill} />
          <Text style={styles.coinLabel}>YOUR COINS</Text>
          <Text style={styles.coinBalance}>{coins.toLocaleString()} Coins</Text>
          <Text style={styles.coinSub}>Use Coins for Rings, Banners & sending to friends</Text>
          <View style={styles.previewRow}>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>Y</Text></View>
            <View style={styles.miniBanner}><Text style={styles.miniBannerText}>Your Banner • {myBanner}</Text></View>
          </View>
          <Text style={styles.ringPreview}>Your Ring: {myRing}</Text>
        </View>

        {/* Tabs — like before, but in Wallet route */}
        <View style={styles.tabs}>
          {([["send", "Send Coins"], ["ring", "Character Ring"], ["banner", "Banner"]] as const).map(([key, label]) => (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        {tab === "send" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Send Coins to another user</Text>
            <Text style={styles.cardSub}>Goes to Safe (Holding). They Accept / Decline or 24h auto-refund.</Text>
            <TextInput value={sendTo} onChangeText={setSendTo} placeholder="@username" placeholderTextColor="#AAAAAA" style={styles.input} />
            <TextInput value={sendAmount} onChangeText={setSendAmount} placeholder="Amount in Coins — e.g. 100" placeholderTextColor="#AAAAAA" keyboardType="number-pad" style={styles.input} />
            <Pressable style={styles.sendBtn}><Text style={styles.sendBtnText}>Send {sendAmount || "0"} Coins</Text></Pressable>
            <Text style={styles.historyTitle}>History</Text>
            <Text style={styles.historyLine}>100 Coins → @maya • Holding</Text>
            <Text style={styles.historyLine}>50 Coins ← @kofi • Released</Text>
            <Text style={styles.historyLine}>20 Coins → @fami • Refunded</Text>
          </View>
        )}

        {tab === "ring" && (
          <View>
            {RINGS.map(r => (
              <View key={r.id} style={styles.shopRow}>
                <View style={styles.ringDot} />
                <View style={{ flex: 1 }}><Text style={styles.shopName}>{r.name}</Text><Text style={styles.shopPrice}>{r.price} Coins</Text></View>
                <Pressable onPress={() => setMyRing(r.id)} style={[styles.buyBtn, myRing === r.id && styles.equippedBtn]}>
                  <Text style={[styles.buyText, myRing === r.id && styles.equippedText]}>{myRing === r.id ? "Equipped" : "Buy / Equip"}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {tab === "banner" && (
          <View>
            {BANNERS.map(b => (
              <View key={b.id} style={styles.shopRow}>
                <View style={styles.bannerPreview}><Text style={styles.bannerPreviewText}>{b.name}</Text></View>
                <View style={{ flex: 1 }}><Text style={styles.shopName}>{b.name}</Text><Text style={styles.shopPrice}>{b.price} Coins</Text></View>
                <Pressable onPress={() => setMyBanner(b.id)} style={[styles.buyBtn, myBanner === b.id && styles.equippedBtn]}>
                  <Text style={[styles.buyText, myBanner === b.id && styles.equippedText]}>{myBanner === b.id ? "Equipped" : "Buy / Equip"}</Text>
                </Pressable>
              </View>
            ))}
            <Text style={styles.cardSub}>Everything Loopa offers lives here: Ring + Banner + Character + Verified Badge. All with Coins.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 12, paddingBottom: 20 },
  back: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  coinCard: { borderRadius: 28, padding: 22, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", marginBottom: 18 },
  coinLabel: { color: "#AAAAAA", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  coinBalance: { color: "#FFFFFF", fontSize: 42, fontWeight: "900", marginTop: 8 },
  coinSub: { color: "#AAAAAA", fontSize: 12, marginTop: 6 },
  previewRow: { flexDirection: "row", gap: 10, marginTop: 16, alignItems: "center" },
  miniAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  miniAvatarText: { color: "#000000", fontWeight: "900" },
  miniBanner: { flex: 1, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  miniBannerText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  ringPreview: { color: "#FFFFFF", fontSize: 12, fontWeight: "600", marginTop: 10 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", alignItems: "center" },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabText: { color: "#AAAAAA", fontSize: 12, fontWeight: "700" },
  tabTextActive: { color: "#000000" },
  card: { backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 22, padding: 16 },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  cardSub: { color: "#AAAAAA", fontSize: 12, marginTop: 6, lineHeight: 17 },
  input: { backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#FFFFFF", fontSize: 14, marginTop: 12 },
  sendBtn: { backgroundColor: "#FFFFFF", borderRadius: 999, paddingVertical: 13, alignItems: "center", marginTop: 14 },
  sendBtnText: { color: "#000000", fontWeight: "800" },
  historyTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginTop: 18, marginBottom: 8 },
  historyLine: { color: "#AAAAAA", fontSize: 13, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  shopRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(0,0,0,0.35)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 18, padding: 14, marginBottom: 10 },
  ringDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFFFFF" },
  shopName: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  shopPrice: { color: "#AAAAAA", fontSize: 12, marginTop: 3 },
  buyBtn: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  buyText: { color: "#000000", fontSize: 11, fontWeight: "800" },
  equippedBtn: { backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  equippedText: { color: "#FFFFFF" },
  bannerPreview: { width: 60, height: 40, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  bannerPreviewText: { color: "#FFFFFF", fontSize: 8, fontWeight: "700", textAlign: "center" },
});