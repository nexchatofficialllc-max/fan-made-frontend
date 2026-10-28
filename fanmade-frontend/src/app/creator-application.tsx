import React, { useState } from "react";
import {
  Alert,
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

const creatorTypes = ["Video", "Manga", "Posts", "Mixed"];

export default function CreatorApplicationScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [creatorType, setCreatorType] = useState("");
  const [contentIdea, setContentIdea] = useState("");
  const [creatorReason, setCreatorReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function continueFromStepOne() {
    if (!creatorType) {
      Alert.alert(
        "Choose a content type",
        "Please choose what you want to create.",
      );
      return;
    }

    setStep(2);
  }

  function continueFromStepTwo() {
    if (!contentIdea.trim()) {
      Alert.alert(
        "Describe your content",
        "Please briefly describe what you want to make.",
      );
      return;
    }

    setStep(3);
  }

  async function handleSubmit() {
    if (!creatorReason.trim()) {
      Alert.alert(
        "Tell us why",
        "Please explain why you want to become a creator.",
      );
      return;
    }

    try {
      setSubmitting(true);

      await submitCreatorApplication(
        creatorType,
        contentIdea,
        creatorReason,
      );

      Alert.alert(
        "Application submitted",
        "Your creator application has been submitted for review.",
        [
          {
            text: "OK",
            onPress: () => safeBack(router, "/creator-settings"),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your application.";

      Alert.alert("Could not submit", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => safeBack(router, "/creator-settings")}>
          <Text style={styles.back}>&lt;</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Become a Creator</Text>

        <Text style={styles.progress}>Step {step} of 3</Text>

        {step === 1 && (
          <>
            <Text style={styles.question}>
              What do you want to create?
            </Text>

            <Text style={styles.description}>
              Choose the type of content you plan to create on LOOPA.
            </Text>

            <View style={styles.options}>
              {creatorTypes.map((type) => {
                const selected = creatorType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.option,
                      selected && styles.optionSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setCreatorType(type)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !creatorType && styles.buttonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={!creatorType}
              onPress={continueFromStepOne}
            >
              <Text style={styles.buttonText}>&gt;</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.question}>
              What do you want to make?
            </Text>

            <Text style={styles.description}>
              Briefly describe the content you plan to create.
            </Text>

            <TextInput
              value={contentIdea}
              onChangeText={setContentIdea}
              placeholder="Describe your content..."
              placeholderTextColor="#666"
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={styles.textArea}
            />

            <TouchableOpacity
              style={[
                styles.button,
                !contentIdea.trim() && styles.buttonDisabled,
              ]}
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
            <Text style={styles.question}>
              Why do you want to become a creator?
            </Text>

            <Text style={styles.description}>
              Tell us why you want to create on LOOPA.
            </Text>

            <TextInput
              value={creatorReason}
              onChangeText={setCreatorReason}
              placeholder="Tell us why..."
              placeholderTextColor="#666"
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={styles.textArea}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!creatorReason.trim() || submitting) && styles.buttonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={!creatorReason.trim() || submitting}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  back: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 28,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  progress: {
    color: "#888",
    fontSize: 14,
    marginBottom: 32,
  },
  question: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    color: "#aaa",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  options: {
    gap: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "#111",
  },
  optionSelected: {
    borderColor: "#fff",
    backgroundColor: "#222",
  },
  optionText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#fff",
  },
  textArea: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "#111",
    color: "#fff",
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.25,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
