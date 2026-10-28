import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { safeBack } from "../../../lib/safe-back";

export default function MediaComposerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => safeBack(router, "/create/post")}
          style={styles.button}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Preview</Text>

        <Pressable style={styles.postButton}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>LOOPA Media Composer</Text>
        <Text style={styles.subtitle}>
          Your picture or video will appear here.
        </Text>
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
  button: {
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
  postButton: {
    minWidth: 64,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  postText: {
    color: "#08090D",
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: "#777C8E",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
});
