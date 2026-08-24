import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function StoryCreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>FAN MADE STORY</Text>

        <Text style={styles.title}>Create a Story</Text>

        <Text style={styles.subtitle}>
          Build an illustrated story chapter by chapter.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Story title</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter your story title"
            placeholderTextColor="#666B7A"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell readers what your story is about"
            placeholderTextColor="#666B7A"
            style={[styles.input, styles.descriptionInput]}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📖</Text>

          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              Your story
            </Text>

            <Text style={styles.infoDescription}>
              After creating the story, you'll be able to
              add chapters and pages.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.createButton,
            !title.trim() && styles.createButtonDisabled,
          ]}
          disabled={!title.trim()}
          onPress={() => {
            // Backend connection comes next.
            console.log("Create story:", {
              title: title.trim(),
              description: description.trim(),
            });
          }}
        >
          <Text style={styles.createButtonText}>
            Create Story
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05060A",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 30,
  },

  backLabel: {
    color: "#A0A5B5",
    fontSize: 14,
    marginLeft: 4,
  },

  eyebrow: {
    color: "#777C8E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 7,
  },

  subtitle: {
    color: "#8F94A5",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 32,
  },

  section: {
    marginBottom: 22,
  },

  label: {
    color: "#D9DBE5",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
  },

  descriptionInput: {
    minHeight: 130,
    paddingTop: 16,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(120,100,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(120,100,255,0.16)",
    marginBottom: 28,
  },

  infoIcon: {
    fontSize: 28,
  },

  infoText: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  infoDescription: {
    color: "#8F94A5",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  createButton: {
    height: 56,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  createButtonDisabled: {
    opacity: 0.35,
  },

  createButtonText: {
    color: "#05060A",
    fontSize: 15,
    fontWeight: "900",
  },
});
