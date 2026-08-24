import React from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const options = [
  {
    icon: "🎬",
    title: "Video",
    description: "Share your fan content with the community.",
  },
  {
    icon: "🎨",
    title: "Drawing",
    description: "Show everyone what you've created.",
  },
  {
    icon: "✨",
    title: "Animation",
    description: "Bring your ideas and characters to life.",
  },
];

export default function CreateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FAN MADE</Text>

          <Text style={styles.title}>Create</Text>

          <Text style={styles.subtitle}>
            Turn your ideas into something the community can enjoy.
          </Text>
        </View>

        <View style={styles.glow} />

        <View style={styles.options}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.title}
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => {
                if (option.title === "Video") {
                  router.push("/create/video");
                }
              }}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{option.icon}</Text>
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>
                  {option.title}
                </Text>

                <Text style={styles.cardDescription}>
                  {option.description}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
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

  header: {
    paddingHorizontal: 8,
    marginBottom: 28,
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
    maxWidth: 310,
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(120,100,255,0.13)",
    top: 100,
    right: -100,
  },

  options: {
    gap: 14,
  },

  card: {
    minHeight: 105,
    padding: 14,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  icon: {
    fontSize: 25,
  },

  cardText: {
    flex: 1,
    paddingLeft: 14,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  cardDescription: {
    color: "#777C8E",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  arrow: {
    color: "#8F94A5",
    fontSize: 30,
    paddingHorizontal: 5,
  },
});

