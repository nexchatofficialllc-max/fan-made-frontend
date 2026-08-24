import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={styles.button}
      hitSlop={10}
    >
      <Text style={styles.arrow}>‹</Text>
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
