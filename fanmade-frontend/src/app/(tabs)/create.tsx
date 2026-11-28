import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GALLERY = [
  { id: "g1", label: "Video 1" },
  { id: "g2", label: "Video 2" },
  { id: "g3", label: "Image 1" },
  { id: "g4", label: "Image 2" },
  { id: "g5", label: "Video 3" },
  { id: "g6", label: "Image 3" },
];

export default function CreateTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("g1");
  const [desc, setDesc] = useState("");
  const [hashtag, setHashtag] = useState("");
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upload</Text>
          <TouchableOpacity onPress={() => Alert.alert("Next", "Next will go to Description.")}>
            <Text style={styles.next}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Preview — video playing automatically or image or anything */}
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Preview — {selected}</Text>
          <Text style={styles.previewSub}>Video playing automatically or image</Text>
        </View>

        {/* Edit with Fami */}
        <TouchableOpacity style={styles.famiBtn} activeOpacity={0.8} onPress={() => Alert.alert("Edit with Fami", "Fami edit will show here.")}>
          <MaterialCommunityIcons name="sparkles" size={18} color="#000000" />
          <Text style={styles.famiBtnText}>Edit with Fami</Text>
        </TouchableOpacity>

        {/* Tools — from sketch */}
        <View style={styles.toolsRow}>
          {(["Post", "Music", "Filter", "Effect", "Text", "Camera"] as const).map((t) => (
            <TouchableOpacity key={t} style={styles.toolChip} activeOpacity={0.8} onPress={() => Alert.alert(t, t + " will show here.")}>
              <Text style={styles.toolText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Loopa Gallery — draggable</Text>
        <View style={styles.gallery}>
          {GALLERY.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.galleryItem, selected === g.id && styles.galleryItemActive]} activeOpacity={0.8} onPress={() => setSelected(g.id)}>
              <Text style={styles.galleryText}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description and hashtag — Tap to preview */}
        <Text style={styles.sectionTitle}>Description and hashtag</Text>
        <TextInput value={desc} onChangeText={setDesc} placeholder="Description — Tap to preview" placeholderTextColor="#AAAAAA" style={styles.input} />
        <TextInput value={hashtag} onChangeText={setHashtag} placeholder="Hashtag — will be listed here" placeholderTextColor="#AAAAAA" style={styles.input} />
        {/* Tag someone */}
        <TouchableOpacity style={styles.tagRow} activeOpacity={0.8} onPress={() => Alert.alert("Tag someone", "Tag someone will show here.")}>
          <MaterialCommunityIcons name="account-tag-outline" size={20} color="#FFFFFF" />
          <Text style={styles.tagText}>Tag someone</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Fami auto caption */}
        <TouchableOpacity style={styles.famiCard} activeOpacity={0.8} onPress={() => Alert.alert("Fami auto caption", "Fami will write a caption for you.")}>
          <MaterialCommunityIcons name="sparkles" size={18} color="#FFFFFF" />
          <Text style={styles.famiCardText}>Fami auto caption</Text>
        </TouchableOpacity>

        <Text style={styles.hashtagList}>Hashtag will be listed here: {hashtag || "#loopa"}</Text>

        {/* Post */}
        <TouchableOpacity style={styles.postBtn} activeOpacity={0.8} onPress={() => Alert.alert("Post", "Your Loop will post here.")}>
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, paddingBottom: 16 },
  back: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  next: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  preview: { height: 200, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  previewLabel: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  previewSub: { color: "#AAAAAA", fontSize: 12, marginTop: 6 },
  famiBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#FFFFFF", borderRadius: 999, paddingVertical: 12, marginTop: 14 },
  famiBtnText: { color: "#000000", fontSize: 14, fontWeight: "800" },
  toolsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  toolChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  toolText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  sectionTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", marginTop: 18, marginBottom: 10 },
  gallery: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  galleryItem: { width: "31%", height: 80, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)" },
  galleryItemActive: { backgroundColor: "#FFFFFF" },
  galleryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700", textAlign: "center" },
  input: { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#FFFFFF", fontSize: 14, marginBottom: 10 },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", marginTop: 6 },
  tagText: { flex: 1, color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  chevron: { color: "#AAAAAA", fontSize: 20 },
  famiCard: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", marginTop: 10 },
  famiCardText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  hashtagList: { color: "#AAAAAA", fontSize: 12, marginTop: 12 },
  postBtn: { backgroundColor: "#FFFFFF", borderRadius: 999, paddingVertical: 14, alignItems: "center", marginTop: 16 },
  postBtnText: { color: "#000000", fontSize: 15, fontWeight: "900" },
});