import React from "react";
import { Tabs, useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NAV_ITEMS = [
  { name: "index", icon: "home-outline", label: "Home" },
  { name: "explore", icon: "compass-outline", label: "Discover" },
  { name: "create", icon: "plus", label: "Upload" },
  { name: "notifications", icon: "message-text-outline", label: "Inbox" },
  { name: "profile", icon: "account-outline", label: "Profile" },
] as const;

const NAV_HEIGHT = 76;

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
      tabBar={({ state, navigation }) => {
        const currentRoute = state.routes[state.index]?.name;

        return (
          <View style={styles.navHost} pointerEvents="box-none">
            <View style={styles.glassShell}>
              <BlurView
                intensity={85}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.19)",
                  "rgba(255,255,255,0.05)",
                  "rgba(0,0,0,0.64)",
                ]}
                locations={[0, 0.32, 1]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.topReflection} pointerEvents="none" />
              <View style={styles.leftReflection} pointerEvents="none" />

              <View style={styles.items}>
                {NAV_ITEMS.map((item) => {
                  const routeIndex = state.routes.findIndex(
                    (route) => route.name === item.name
                  );

                  if (routeIndex === -1) return null;

                  const focused = currentRoute === item.name;
                  const isUpload = item.name === "create";
                  const isInbox = item.name === "notifications";

                  return (
                    <Pressable
                      key={item.name}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                      accessibilityState={{ selected: focused }}
                      hitSlop={8}
                      style={styles.navItem}
                      onPress={() => {
                        if (isUpload) {
                          router.push("/(tabs)/create");
                          return;
                        }

                        navigation.navigate(item.name);
                      }}
                    >
                      {isUpload ? (
                        <View style={styles.uploadOuter}>
                          <BlurView
                            intensity={70}
                            tint="dark"
                            style={styles.uploadGlass}
                          >
                            <LinearGradient
                              colors={[
                                "rgba(255,255,255,0.42)",
                                "rgba(255,255,255,0.15)",
                                "rgba(0,0,0,0.60)",
                              ]}
                              locations={[0, 0.42, 1]}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.uploadHighlight} />
                            <MaterialCommunityIcons
                              name="plus"
                              size={31}
                              color="#FFFFFF"
                            />
                          </BlurView>
                        </View>
                      ) : (
                        <View style={styles.iconWrap}>
                          {focused && <View style={styles.activeHalo} />}
                          <MaterialCommunityIcons
                            name={item.icon}
                            size={27}
                            color={focused ? "#FFFFFF" : "#A0A0A0"}
                          />
                          {isInbox && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadText}>•</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="index-before-glass-home" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navHost: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    height: NAV_HEIGHT,
  },
  glassShell: {
    flex: 1,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.34)",
    backgroundColor: "rgba(0,0,0,0.44)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  topReflection: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  leftReflection: {
    position: "absolute",
    top: 9,
    bottom: 9,
    left: 1,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  items: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,
  },
  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  activeHalo: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.6,
    shadowRadius: 13,
    elevation: 5,
  },
  uploadOuter: {
    width: 59,
    height: 59,
    borderRadius: 30,
    padding: 1.5,
    backgroundColor: "rgba(255,255,255,0.90)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  uploadGlass: {
    flex: 1,
    borderRadius: 29,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  uploadHighlight: {
    position: "absolute",
    top: 3,
    left: 9,
    right: 9,
    height: 13,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  unreadBadge: {
    position: "absolute",
    top: 2,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#000000",
    fontSize: 8,
    lineHeight: 8,
    fontWeight: "900",
  },
});