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
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { safeBack } from "../../../lib/safe-back";

export default function StoryCreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const backScale = useSharedValue(1);
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));
  const createScale = useSharedValue(1);
  const createAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <Animated.View style={backAnimatedStyle}>
            <TouchableOpacity
              style={styles.backButton}
              onPressIn={() => { backScale.value = withSpring(0.92, { damping: 8, stiffness: 200 }); }}
              onPressOut={() => { backScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
              onPress={() => safeBack(router, "/create")}
            >
              <Text style={styles.backText}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.eyebrow}>LOOPA STORY</Text>
          <Text style={styles.title}>Create a Story</Text>
          <Text style={styles.subtitle}>
            Build an illustrated story chapter by chapter.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.section}>
            <Text style={styles.label}>Story title</Text>
            <View style={styles.glassInputWrap}>
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.16)",
                  "rgba(255,255,255,0.04)",
                  "rgba(0,0,0,0.45)",
                ]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your story title"
                placeholderTextColor="#888888"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.glassInputWrap}>
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.16)",
                  "rgba(255,255,255,0.04)",
                  "rgba(0,0,0,0.45)",
                ]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tell readers what your story is about"
                placeholderTextColor="#888888"
                style={[styles.input, styles.descriptionInput]}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(120)}>
          <View style={styles.infoCard}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.14)",
                "rgba(255,255,255,0.03)",
                "rgba(0,0,0,0.45)",
              ]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} pointerEvents="none" />
            <Text style={styles.infoIcon}>📖</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Your story</Text>
              <Text style={styles.infoDescription}>
                After creating the story, you'll be able to
                add chapters and pages.
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={createAnimatedStyle}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.createButton,
              !title.trim() && styles.createButtonDisabled,
            ]}
            disabled={!title.trim()}
            onPressIn={() => { createScale.value = withSpring(0.97, { damping: 8, stiffness: 200 }); }}
            onPressOut={() => { createScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
            onPress={() => {
              console.log("Create story:", {
                title: title.trim(),
                description: description.trim(),
              });
            }}
          >
            <Text style={styles.createButtonText}>Create Story</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 30,
  },
  backLabel: {
    color: "#AAAAAA",
    fontSize: 14,
    marginLeft: 4,
  },
  eyebrow: {
    color: "#AAAAAA",
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
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 32,
  },
  section: {
    marginBottom: 22,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },
  glassInputWrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 28,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
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
    color: "#AAAAAA",
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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.70)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.35,
  },
  createButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
  },
});