import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { safeBack } from "../../../lib/safe-back";

const MAX_IMAGES = 10;
const MAX_HASHTAGS = 10;
const MAX_HASHTAG_LENGTH = 30;

function parseHashtags(value: string): string[] {
  const matches = value.match(/#[a-zA-Z0-9_]+/g) ?? [];

  const unique = matches
    .map((tag) => tag.slice(1).toLowerCase().slice(0, MAX_HASHTAG_LENGTH))
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index);

  return unique.slice(0, MAX_HASHTAGS);
}

export default function CreatePostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ media?: string }>();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!params.media) {
      return;
    }

    try {
      const media = JSON.parse(params.media);

      if (Array.isArray(media)) {
        setImages(
          media
            .filter((uri): uri is string => typeof uri === "string")
            .slice(0, MAX_IMAGES)
        );
      }
    } catch {
      console.log("LOOPA: invalid media parameter");
    }
  }, [params.media]);

  const hashtags = parseHashtags(text);

  const canPost =
    text.trim().length > 0 ||
    images.length > 0;

  const pickImages = () => {
    router.push("../media-picker");
  };

  const removeImage = (uri: string) => {
    setImages((current) =>
      current.filter((image) => image !== uri)
    );
  };

  const publishPost = () => {
    if (!canPost) {
      return;
    }

    router.push({
      pathname: "../composer",
      params: {
        media: JSON.stringify(images),
        caption: text.trim(),
        hashtags: JSON.stringify(hashtags),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => safeBack(router, "/create")}
          style={styles.headerButton}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Create Post</Text>

        <Pressable
          onPress={publishPost}
          disabled={!canPost}
          style={[
            styles.publishButton,
            !canPost && styles.publishButtonDisabled,
          ]}
        >
          <Text style={styles.publishText}>Post</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>

          <View>
            <Text style={styles.authorName}>LOOPA User</Text>
            <Text style={styles.authorUsername}>@fanmadeuser</Text>
          </View>
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="What's on your mind? Add #hashtags"
          placeholderTextColor="#777C8E"
          multiline
          autoFocus
          textAlignVertical="top"
          style={styles.input}
          maxLength={2000}
        />

        <Text style={styles.counter}>{text.length}/2000</Text>

        {images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((uri) => (
              <View key={uri} style={styles.imageWrapper}>
                <Image
                  source={{ uri }}
                  style={styles.postImage}
                />

                <Pressable
                  onPress={() => removeImage(uri)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tools}>
          <Pressable
            style={styles.tool}
            onPress={pickImages}
          >
            <Text style={styles.toolIcon}>▧</Text>
            <Text style={styles.toolText}>Image</Text>
          </Pressable>

          <Pressable style={styles.tool}>
            <Text style={styles.toolIcon}>◉</Text>
            <Text style={styles.toolText}>Feeling</Text>
          </Pressable>

          <Pressable style={styles.tool}>
            <Text style={styles.toolIcon}>⌖</Text>
            <Text style={styles.toolText}>Location</Text>
          </Pressable>
        </View>

        <Text style={styles.imageLimit}>
          {images.length}/{MAX_IMAGES} pictures
        </Text>
      </ScrollView>
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
    fontWeight: "300",
    lineHeight: 38,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  publishButton: {
    minWidth: 64,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  publishButtonDisabled: {
    opacity: 0.35,
  },
  publishText: {
    color: "#08090D",
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#20232D",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  authorUsername: {
    color: "#777C8E",
    fontSize: 12,
    marginTop: 2,
  },
  input: {
    minHeight: 200,
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 27,
    padding: 0,
  },
  counter: {
    color: "#777C8E",
    fontSize: 11,
    textAlign: "right",
    marginTop: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  imageWrapper: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#151820",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  removeText: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 24,
  },
  tools: {
    marginTop: 26,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    gap: 10,
  },
  tool: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  toolIcon: {
    color: "#FFFFFF",
    fontSize: 15,
    marginRight: 7,
  },
  toolText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  imageLimit: {
    color: "#777C8E",
    fontSize: 11,
    marginTop: 10,
  },
});
