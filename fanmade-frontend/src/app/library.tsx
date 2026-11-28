import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BOOKS = [
  { id: "lib-1", title: "My First Comic", pages: "24 pages", kind: "Comic", desc: "He was a lone..." },
  { id: "lib-2", title: "A Small Book", pages: "48 pages", kind: "Book", desc: "Loopa guidelines" },
  { id: "lib-3", title: "How Do You Feel", pages: "12 pages", kind: "Comic", desc: "How do you feel" },
];

export default function LibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Library</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitle}>Comics, books, stories shared by others</Text>

        <View style={styles.list}>
          {BOOKS.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <View style={styles.bookCover}>
                <MaterialCommunityIcons name="book-open-outline" size={26} color="#FFFFFF" />
              </View>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookMeta}>{book.pages} • {book.kind}</Text>
                <Text style={styles.bookDesc}>{book.desc}</Text>
              </View>
              <TouchableOpacity style={styles.readBtn} activeOpacity={0.8} onPress={() => setSelected(book.id)}>
                <Text style={styles.readBtnText}>Read</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {selected && (
          <View style={styles.readCard}>
            <Text style={styles.readTitle}>Now Reading</Text>
            <Text style={styles.bookTitle}>{BOOKS.find(b => b.id === selected)?.title}</Text>
            <Text style={styles.bookDesc}>{BOOKS.find(b => b.id === selected)?.desc}</Text>
            <View style={styles.readRow}>
              <TouchableOpacity style={styles.navBtn} activeOpacity={0.8} onPress={() => Alert.alert("Previous", "Previous page will show here.")}>
                <Text style={styles.navBtnText}>‹ Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} activeOpacity={0.8} onPress={() => Alert.alert("Next", "Next page will show here.")}>
                <Text style={styles.navBtnText}>Next ›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.readRow}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => Alert.alert("Like", "Like will connect here.")}>
                <MaterialCommunityIcons name="heart-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => Alert.alert("Comment", "Comment will show here.")}>
                <MaterialCommunityIcons name="comment-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.backToList} activeOpacity={0.8} onPress={() => setSelected(null)}>
              <Text style={styles.backToListText}>Back to Library</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, paddingBottom: 12 },
  back: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  subtitle: { color: "#AAAAAA", fontSize: 13, marginBottom: 16 },
  list: { gap: 12 },
  bookCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  bookCover: { width: 56, height: 72, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)" },
  bookInfo: { flex: 1 },
  bookTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  bookMeta: { color: "#AAAAAA", fontSize: 12, marginTop: 2 },
  bookDesc: { color: "#D8D8D8", fontSize: 12, marginTop: 4, lineHeight: 16 },
  readBtn: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  readBtnText: { color: "#000000", fontSize: 12, fontWeight: "800" },
  readCard: { marginTop: 20, padding: 16, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  readTitle: { color: "#AAAAAA", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  readRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  navBtn: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 999, backgroundColor: "#FFFFFF" },
  navBtnText: { color: "#000000", fontSize: 13, fontWeight: "800" },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  actionText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  backToList: { alignItems: "center", marginTop: 14, paddingVertical: 10 },
  backToListText: { color: "#AAAAAA", fontSize: 13, fontWeight: "700" },
});