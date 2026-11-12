import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import BackButton from "../../../components/BackButton";

export default function CreateVideoScreen() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [videos, setVideos] = useState<MediaLibrary.Asset[]>([]);
  const [selected, setSelected] = useState<MediaLibrary.Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  async function loadVideos() {
    setLoading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === "granted";
      setPermission(granted);
      if (!granted) {
        setLoading(false);
        return;
      }
      // Own selector — fetch videos from device, show them inside Loopa
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: "video",
        first: 60,
        sortBy: ["creationTime"],
      });
      setVideos(result.assets);
      setShowSelector(true);
    } catch (e) {
      console.error("Failed to load videos:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButton />

        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={styles.eyebrow}>CREATE</Text>
          <Text style={styles.title}>Video</Text>
          <Text style={styles.subtitle}>
            Share your fan-made video with the community.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <View style={styles.uploadCard}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.18)",
                "rgba(255,255,255,0.05)",
                "rgba(0,0,0,0.55)",
              ]}
              locations={[0, 0.35, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topReflection} pointerEvents="none" />

            {selected ? (
              <>
                <View style={styles.selectedThumb}>
                  <Image source={{ uri: selected.uri }} style={styles.selectedImage} />
                  <View style={styles.playBadge}>
                    <Text style={styles.playText}>▶</Text>
                  </View>
                </View>
                <Text style={styles.uploadTitle}>Video selected</Text>
                <Text style={styles.uploadText} numberOfLines={1}>
                  {selected.filename}
                </Text>
                <Animated.View style={buttonAnimatedStyle}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPressIn={() => { buttonScale.value = withSpring(0.95, { damping: 8, stiffness: 200 }); }}
                    onPressOut={() => { buttonScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
                    onPress={() => setShowSelector(true)}
                  >
                    <Text style={styles.buttonText}>Change Video</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <Text style={styles.icon}>＋</Text>
                </View>
                <Text style={styles.uploadTitle}>Add your video</Text>
                <Text style={styles.uploadText}>
                  Choose a video from your Loopa media selector below.
                </Text>
                <Animated.View style={buttonAnimatedStyle}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPressIn={() => { buttonScale.value = withSpring(0.95, { damping: 8, stiffness: 200 }); }}
                    onPressOut={() => { buttonScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
                    onPress={loadVideos}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Loading..." : "Browse Videos"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
        </Animated.View>

        {/* OWN MEDIA SELECTOR — Inside Loopa, not phone picker */}
        {showSelector && (
          <Animated.View entering={FadeInUp.duration(350)}>
            <View style={styles.selectorCard}>
              <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.16)",
                  "rgba(255,255,255,0.04)",
                  "rgba(0,0,0,0.60)",
                ]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topReflection} pointerEvents="none" />

              <View style={styles.selectorHeader}>
                <Text style={styles.infoTitle}>Your Videos — Loopa Selector</Text>
                <TouchableOpacity onPress={() => setShowSelector(false)}>
                  <Text style={styles.closeText}>Done</Text>
                </TouchableOpacity>
              </View>

              {permission === false ? (
                <Text style={styles.infoText}>
                  Loopa needs permission to show your videos. Tap Browse Videos to allow.
                </Text>
              ) : loading ? (
                <ActivityIndicator color="#FFFFFF" style={{ marginTop: 20 }} />
              ) : videos.length === 0 ? (
                <Text style={styles.infoText}>No videos found on this device yet.</Text>
              ) : (
                <FlatList
                  data={videos}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ marginTop: 12 }}
                  renderItem={({ item }) => {
                    const isActive = selected?.id === item.id;
                    return (
                      <TouchableOpacity
                        style={[styles.thumbWrap, isActive && styles.thumbActive]}
                        onPress={() => setSelected(item)}
                      >
                        <Image source={{ uri: item.uri }} style={styles.thumb} />
                        <View style={styles.thumbPlay}>
                          <Text style={styles.thumbPlayText}>▶</Text>
                        </View>
                        {isActive && (
                          <View style={styles.thumbCheck}>
                            <Text style={styles.thumbCheckText}>✓</Text>
                          </View>
                        )}
                        <Text style={styles.thumbDuration}>
                          {Math.floor(item.duration)}s
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.duration(400).delay(120)}>
          <View style={styles.infoCard}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.infoTitle}>Before you upload</Text>
            <Text style={styles.infoText}>
              You can add a title, description, thumbnail and other details
              after selecting your video.
            </Text>
          </View>
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
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  eyebrow: {
    color: "#AAAAAA",
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
    color: "#AAAAAA",
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(0,0,0,0.35)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "300",
  },
  selectedThumb: {
    width: 120,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.40)",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  playBadge: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.60)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.60)",
  },
  playText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
  },
  uploadText: {
    color: "#AAAAAA",
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
    color: "#000000",
    fontSize: 14,
    fontWeight: "800",
  },
  selectorCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  thumbWrap: {
    flex: 1,
    aspectRatio: 0.75,
    margin: 4,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  thumbActive: {
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbPlay: {
    position: "absolute",
    alignSelf: "center",
    top: "38%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbPlayText: {
    color: "#FFFFFF",
    fontSize: 11,
  },
  thumbCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbCheckText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "800",
  },
  thumbDuration: {
    position: "absolute",
    bottom: 6,
    right: 6,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.60)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  infoCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  infoTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  infoText: {
    color: "#AAAAAA",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});