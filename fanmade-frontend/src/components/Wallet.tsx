const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: "#FFFFFF", fontSize: 15, marginBottom: 20 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900" },
  subtitle: { color: "#AAAAAA", fontSize: 13, marginTop: 6, marginBottom: 20 },
  card: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", marginBottom: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  cardText: { color: "#AAAAAA", fontSize: 12, marginTop: 4 },
  chevron: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginLeft: 10 },
  readingRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  readingChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  readingChipActive: { backgroundColor: "#FFFFFF" },
  readingChipText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  readingChipTextActive: { color: "#000000" },
  signOut: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", marginTop: 10 },
  signOutText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  signOutHint: { color: "#AAAAAA", fontSize: 11, textAlign: "center", marginTop: 10 },
});
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
          <Text style={styles.title}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.coinCard}>
          <Text style={styles.coinLabel}>YOUR COINS</Text>
          <Text style={styles.coinBalance}>{coins.toLocaleString()} Coins</Text>
          <Text style={styles.coinSub}>Use Coins for Rings, Banners & sending to friends</Text>
          <View style={styles.previewRow}>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>Y</Text></View>
            <View style={styles.miniBanner}><Text style={styles.miniBannerText}>Your Banner • {myBanner}</Text></View>
          </View>
          <Text style={styles.ringPreview}>Your Ring: {myRing}</Text>
        </View>

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
            <Pressable style={styles.sendBtn} onPress={() => alert("Send Coins will connect here.")}>
              <Text style={styles.sendBtnText}>Send Coins</Text>
            </Pressable>
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
                <View style={{ flex: 1 }}><Text style={styles.shopName}>{r.name}</Text><Text style={styles.shopPrice}>{r.price} Coins — Tap to view amount left</Text></View>
                <Pressable onPress={() => setMyRing(r.id)} style={[styles.buyBtn, myRing === r.id && styles.equippedBtn]}>
                  <Text style={[styles.buyText, myRing === r.id && styles.equippedText]}>{myRing === r.id ? "Equipped" : "Buy / Equip"}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {tab === "banner" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Banner — mock for now</Text>
            <Text style={styles.cardSub}>We will not make Banner right now. Loopa will upload real Banners later.</Text>
            <Text style={styles.cardSub}>For now: White Banner — 150 Coins, Black Banner — 150 Coins, Loopa Banner — 800 Coins.</Text>
            <Pressable style={styles.sendBtn} onPress={() => setMyBanner("banner-black")}>
              <Text style={styles.sendBtnText}>Use Black Banner (mock)</Text>
            </Pressable>
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
  coinCard: { borderRadius: 28, padding: 22, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", marginBottom: 18 },
  coinLabel: { color: "#AAAAAA", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  coinBalance: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 8 },
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
  card: { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 22, padding: 16 },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  cardSub: { color: "#AAAAAA", fontSize: 12, marginTop: 6, lineHeight: 17 },
  sendBtn: { backgroundColor: "#FFFFFF", borderRadius: 999, paddingVertical: 13, alignItems: "center", marginTop: 14 },
  sendBtnText: { color: "#000000", fontWeight: "800" },
  historyTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginTop: 18, marginBottom: 8 },
  historyLine: { color: "#AAAAAA", fontSize: 13, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  shopRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 18, padding: 14, marginBottom: 10 },
  ringDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFFFFF" },
  shopName: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  shopPrice: { color: "#AAAAAA", fontSize: 12, marginTop: 3 },
  buyBtn: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  buyText: { color: "#000000", fontSize: 11, fontWeight: "800" },
  equippedBtn: { backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  equippedText: { color: "#FFFFFF" },
});