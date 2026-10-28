import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { safeBack } from "../../../lib/safe-back";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

type MediaType = "Images" | "Videos" | "Manga";

export default function MediaPickerScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<MediaType>("Images");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const loadImages = async () => {
      const MediaLibrary = require("expo-media-library");

      const permission =
        await MediaLibrary.requestPermissionsAsync();

      console.log(
        "LOOPA media permission:",
        permission.status
      );

      if (!permission.granted) {
        return;
      }

      const result = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 60,
      });

      setMediaItems(result.assets);
    };

    loadImages();
  }, []);

  const importFromPhone = async () => {
    if (activeType !== "Images") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    console.log("LOOPA imported images:", result.assets);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => safeBack(router, "/create/post")}
          style={styles.headerButton}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Choose Media</Text>

        <Pressable
          onPress={() => {
            router.replace({
              pathname: "../post",
              params: {
                media: JSON.stringify(selectedMedia),
              },
            });
          }}
          style={styles.doneButton}
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.selectionBar}>
        <Text style={styles.selectionText}>
          {selectedMedia.length} selected
        </Text>
      </View>

      <View style={styles.tabs}>
        {(["Images", "Videos", "Manga"] as MediaType[]).map((type) => {
          const active = activeType === type;

          return (
            <Pressable
              key={type}
              onPress={() => setActiveType(type)}
              style={[styles.tab, active && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  active && styles.activeTabText,
                ]}
              >
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeType === "Images" && mediaItems.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {mediaItems.map((item) => {
            const selected = selectedMedia.includes(item.uri);

            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedMedia((current) =>
                    selected
                      ? current.filter((uri) => uri !== item.uri)
                      : [...current, item.uri]
                  );
                }}
                style={[
                  styles.mediaCard,
                  selected && styles.mediaCardSelected,
                ]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.mediaImage}
                />

                {selected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.icon}>
            {activeType === "Images"
              ? "🖼️"
              : activeType === "Videos"
                ? "🎥"
                : "📖"}
          </Text>

          <Text style={styles.heading}>
            {activeType}
          </Text>

          <Text style={styles.subtitle}>
            {activeType === "Images"
              ? "No images found yet."
              : `Your ${activeType.toLowerCase()} library will appear here.`}
          </Text>
        </View>
      )}

      <View style={styles.bottom}>
        <Pressable style={styles.importButton} onPress={importFromPhone}>
          <Text style={styles.importText}>
            + Import from phone
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090D",
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    color: "#FFFFFF",
    fontSize: 38,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  doneButton: {
    minWidth: 58,
    alignItems: "center",
  },
  doneText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  selectionBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  selectionText: {
    color: "#8C91A0",
    fontSize: 12,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#15171D",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    color: "#8C91A0",
    fontSize: 13,
    fontWeight: "700",
  },
  activeTabText: {
    color: "#08090D",
  },
  grid: {
    padding: 2,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaCard: {
    width: "33.333%",
    aspectRatio: 1,
    padding: 2,
    position: "relative",
  },
  mediaCardSelected: {
    opacity: 0.65,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadgeText: {
    color: "#08090D",
    fontSize: 15,
    fontWeight: "900",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    fontSize: 54,
    marginBottom: 16,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "#777C8E",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  bottom: {
    padding: 18,
  },
  importButton: {
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  importText: {
    color: "#08090D",
    fontSize: 14,
    fontWeight: "800",
  },
});
