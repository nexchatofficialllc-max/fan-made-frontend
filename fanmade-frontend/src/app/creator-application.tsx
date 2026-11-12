import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { safeBack } from "../lib/safe-back";
import { submitCreatorApplication } from "../lib/creator-application-system";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const creatorTypes = ["Video", "Manga", "Posts", "Mixed"];

export default function CreatorApplicationScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [creatorType, setCreatorType] = useState("");
  const [contentIdea, setContentIdea] = useState("");
  const [creatorReason, setCreatorReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleBack() {
    if (step > 1) {
      setError("");
      setStep(step - 1);
      return;
    }
    safeBack(router, "/creator-settings");
  }

  function continueFromStepOne() {
    if (!creatorType) {
      setError("Please choose what you want to create.");
      return;
    }
    setError("");
    setStep(2);
  }

  function continueFromStepTwo() {
    if (!contentIdea.trim()) {
      setError("Please briefly describe what you want to make.");
      return;
    }
    setError("");
    setStep(3);
  }

  async function handleSubmit() {
    if (!creatorReason.trim()) {
      setError("Please explain why you want to become a creator.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await submitCreatorApplication(creatorType, contentIdea, creatorReason);
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your application.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.glassCard}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.55)"]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topReflection} />
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Application submitted</Text>
              <Text style={styles.successText}>
                Your creator application for <Text style={styles.successBold}>{creatorType}</Text> is under review. Review is not instant — we'll notify you in Loopa when it's approved.
              </Text>
              <Text style={styles.successSub}>
                What you want to make: {contentIdea.trim().slice(0, 120)}
                {contentIdea.trim().length > 120 ? "..." : ""}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => safeBack(router, "/creator-settings")}
              >
                <Text style={styles.buttonText}>Back to Creator Settings</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.back}>{step > 1 ? "‹ Back" : "‹"}</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.smallLabel}>LOOPA CREATORS</Text>
          <Text style={styles.title}>Become a Creator</Text>
          <Text style={styles.progress}>Step {step} of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
          <View style={styles.stepDots}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.dot, s <= step && styles.dotActive]} />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(350)} key={step}>
          {step === 1 && (
            <>
              <Text style={styles.question}>What do you want to create?</Text>
              <Text style={styles.description}>Choose the type of content you plan to create on LOOPA.</Text>
              <View style={styles.options}>
                {creatorTypes.map((type) => {
                  const selected = creatorType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.option, selected && styles.optionSelected]}
                      activeOpacity={0.8}
                      onPress={() => { setCreatorType(type); setError(""); }}
                    >
                      <BlurView intensity={selected ? 60 : 40} tint="dark" style={StyleSheet.absoluteFill} />
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{type}</Text>
                      <Text style={styles.optionCheck}>{selected ? "✓" : ""}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.button, !creatorType && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={!creatorType}
                onPress={continueFromStepOne}
              >
                <Text style={styles.buttonText}>Continue ›</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.question}>What do you want to make?</Text>
              <Text style={styles.description}>Briefly describe the content you plan to create.</Text>
              <View style={styles.textAreaWrap}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <TextInput
                  value={contentIdea}
                  onChangeText={(t) => { setContentIdea(t); setError(""); }}
                  placeholder="Describe your content..."
                  placeholderTextColor="#AAAAAA"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </View>
              <Text style={styles.charCount}>{contentIdea.length} / 500</Text>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.button, !contentIdea.trim() && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={!contentIdea.trim()}
                onPress={continueFromStepTwo}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.question}>Why do you want to become a creator?</Text>
              <Text style={styles.description}>Tell us why you want to create on LOOPA.</Text>
              <View style={styles.textAreaWrap}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <TextInput
                  value={creatorReason}
                  onChangeText={(t) => { setCreatorReason(t); setError(""); }}
                  placeholder="Tell us why..."
                  placeholderTextColor="#AAAAAA"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </View>
              <Text style={styles.charCount}>{creatorReason.length} / 500</Text>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.button, (!creatorReason.trim() || submitting) && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={!creatorReason.trim() || submitting}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>{submitting ? "Submitting..." : "Submit Application"}</Text>
              </TouchableOpacity>
              <Text style={styles.reviewHint}>Review is not instant. You'll get a notification when you're approved.</Text>
            </>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  smallLabel: {
    color: "#AAAAAA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 8,
  },
  progress: {
    color: "#AAAAAA",
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  stepDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
  },
  question: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    color: "#AAAAAA",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  optionSelected: {
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  optionText: {
    color: "#AAAAAA",
    fontSize: 16,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  optionCheck: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  textAreaWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    overflow: "hidden",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 180,
    color: "#FFFFFF",
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  charCount: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "right",
    marginBottom: 8,
  },
  errorText: {
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },
  reviewHint: {
    color: "#AAAAAA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
  },
  glassCard: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    marginTop: 40,
    alignItems: "center",
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  successIcon: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    width: 52,
    height: 52,
    borderRadius: 26,
    textAlign: "center",
    lineHeight: 52,
    fontSize: 26,
    fontWeight: "900",
    overflow: "hidden",
    marginBottom: 14,
  },
  successTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  successText: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  successBold: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  successSub: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    marginBottom: 18,
  },
});