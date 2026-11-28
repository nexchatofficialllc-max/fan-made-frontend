import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ReadingMode = "scroll" | "arrow" | "swipe";
const READING_KEY = "loopa_library_reading_mode";

// Demo pages — later this will come from Supabase / R2 for each comic / book
const PAGES = [
  { id: "p1", title: "Page 1", text: "This is where your comic or book starts. The creator shared it in Library." },
  { id: "p2", title: "Page 2", text: "Keep reading. Library uses the mode you picked in Settings." },
  { id: "p3", title: "Page 3", text: "Scroll, Arrow or Swipe — one mode for all books, until you change it." },
  { id: "p4", title: "Page 4", text: "Other creators can share their comics and books here too." },
  { id: "p5", title: "Page 5", text: "The End. Tap Share to share this comic or book with friends." },
];

export default function LibraryReader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ id?: string; title?: string }>();
  const title = typeof params.title === "string" && params.title ? params.title : "Library Book";

  const [mode, setMode] = useState<ReadingMode>("scroll");
  const [page, setPage] = useState(0);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(READING_KEY);
        if (saved === "scroll" || saved === "arrow" || saved === "swipe") setMode(saved);
      } catch {}
    })();
  }, []);

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(PAGES.length - 1, next));
    setPage(clamped);
    if (mode === "swipe") {
      flatRef.current?.scrollToIndex({ index: clamped, animated: true });
    }
  }

  function renderPage(item: (typeof PAGES)[number], index: number, fullWidth: boolean) {
    return (
      <View style={[styles.page, fullWidth && { width: width - 36 }]}>
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.03)", "rgba(0,0,0,0.50)"]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.pageTop}>
          <View style={styles.pageIcon}>
            <MaterialCommunityIcons name="book-open-outline" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.pageNumber}>PAGE {index + 1} / {PAGES.length}</Text>
        </View>
        <Text style={styles.pageTitle}>{item.title}</Text>
        <Text style={styles.pageText}>{item.text}</Text>
        <View style={styles.pageArt}>
          <MaterialCommunityIcons name="image-outline" size={32} color="rgba(255,255,255,0.35)" />
          <Text style={styles.pageArtText}>Comic / Book art will show here</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.headerSub}>Library • {mode === "scroll" ? "Scroll" : mode === "arrow" ? "Arrow" : "Swipe"} mode</Text>
        </View>
        <Pressable style={styles.headerBtn} onPress={() => router.push("/settings")}>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Change mode quick row */}
      <View style={styles.modeRow}>
        {([
          { id: "scroll" as ReadingMode, label: "Scroll", icon: "arrow-down" },
          { id: "arrow" as ReadingMode, label: "Arrow", icon: "arrow-left-right" },
          { id: "swipe" as ReadingMode, label: "Swipe", icon: "gesture-swipe-horizontal" },
        ]).map((m) => {
          const active = mode === m.id;
          return (
            <Pressable key={m.id} style={[styles.modeChip, active && styles.modeChipActive]} onPress={async () => { setMode(m.id); setPage(0); try { await AsyncStorage.setItem(READING_KEY, m.id); } catch {} }}>
              <MaterialCommunityIcons name={m.icon as any} size={16} color={active ? "#000000" : "#FFFFFF"} />
              <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* READER — changes by mode */}
      {mode === "scroll" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {PAGES.map((p, i) => (
            <View key={p.id} style={styles.scrollPageWrap}>{renderPage(p, i, false)}</View>
          ))}
          <Text style={styles.endText}>The End — you read with Scroll</Text>
        </ScrollView>
      ) : mode === "arrow" ? (
        <View style={styles.arrowWrap}>
          {renderPage(PAGES[page], page, false)}
          <View style={styles.arrowRow}>
            <Pressable style={[styles.arrowBtn, page === 0 && styles.arrowBtnDisabled]} onPress={() => goTo(page - 1)} disabled={page === 0}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.pageIndicator}>{page + 1} / {PAGES.length}</Text>
            <Pressable style={[styles.arrowBtn, page === PAGES.length - 1 && styles.arrowBtnDisabled]} onPress={() => goTo(page + 1)} disabled={page === PAGES.length - 1}>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={styles.dots}>
            {PAGES.map((_, i) => (
              <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={PAGES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setPage(idx);
          }}
          renderItem={({ item, index }) => (
            <View style={{ width, paddingHorizontal: 18 }}>{renderPage(item, index, false)}</View>
          )}
        />
      )}

      {/* Bottom — only for Swipe / Arrow */}
      {mode !== "scroll" && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomText}>Swipe or Arrow — Page {page + 1} of {PAGES.length}</Text>
          <Text style={styles.bottomHint}>Change mode in Settings → Library Reading</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 6, paddingBottom: 12 },
  headerBtn: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  headerCenter: { flex: 1, marginHorizontal: 12, alignItems: "center" },
  headerTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", textAlign: "center" },
  headerSub: { color: "#AAAAAA", fontSize: 11, marginTop: 2 },
  modeRow: { flexDirection: "row", gap: 8, paddingHorizontal: 18, marginBottom: 12 },
  modeChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  modeChipActive: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  modeChipText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  modeChipTextActive: { color: "#000000" },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 20 },
  scrollPageWrap: { marginBottom: 12 },
  page: { borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)", backgroundColor: "rgba(0,0,0,0.35)", padding: 18, minHeight: 340, justifyContent: "center" },
  pageTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pageIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  pageNumber: { color: "#AAAAAA", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  pageTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "900", marginTop: 18 },
  pageText: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 21, marginTop: 10 },
  pageArt: { marginTop: 18, height: 130, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", gap: 6 },
  pageArtText: { color: "rgba(255,255,255,0.45)", fontSize: 11 },
  arrowWrap: { flex: 1, paddingHorizontal: 18 },
  arrowRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  arrowBtn: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.30)" },
  arrowBtnDisabled: { opacity: 0.35 },
  pageIndicator: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.25)" },
  dotActive: { backgroundColor: "#FFFFFF", width: 18 },
  bottomBar: { paddingHorizontal: 18, paddingTop: 12, alignItems: "center" },
  bottomText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  bottomHint: { color: "#888888", fontSize: 11, marginTop: 4 },
  endText: { color: "#888888", fontSize: 12, textAlign: "center", marginTop: 8 },
});