import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../components/BackButton";

export default function CreateVideoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButton />

        <Text style={styles.eyebrow}>CREATE</Text>

        <Text style={styles.title}>Video</Text>

        <Text style={styles.subtitle}>
          Share your fan-made video with the community.
        </Text>

        <View style={styles.uploadCard}>
          <View style={styles.uploadIcon}>
            <Text style={styles.icon}>＋</Text>
          </View>

          <Text style={styles.uploadTitle}>Add your video</Text>

          <Text style={styles.uploadText}>
            Choose a video from your device to begin.
          </Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Choose Video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Before you upload</Text>

          <Text style={styles.infoText}>
            You can add a title, description, thumbnail and other details
            after selecting your video.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05060A",
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  eyebrow: {
    color: "#777C8E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 5,
  },

  subtitle: {
    color: "#8F94A5",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 320,
  },

  uploadCard: {
    marginTop: 30,
    minHeight: 300,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  icon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "300",
  },

  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
  },

  uploadText: {
    color: "#777C8E",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 250,
  },

  button: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  buttonText: {
    color: "#07080D",
    fontSize: 14,
    fontWeight: "800",
  },

  infoCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  infoText: {
    color: "#777C8E",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});
