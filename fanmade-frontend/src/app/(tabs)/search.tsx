import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.smallLabel}>LOOPA</Text>
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search LOOPA"
            placeholderTextColor="#777C8E"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.empty}>
          {query.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>
                Find something to watch
              </Text>
              <Text style={styles.emptyText}>
                Search creators, videos, manga, stories and more.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyTitle}>
                Searching for
              </Text>
              <Text style={styles.query}>
                {query}
              </Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07112F",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  smallLabel: {
    color: "#91A8D6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 24,
  },

  searchBox: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(16,42,131,0.34)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.28)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    color: "#00D9FF",
    fontSize: 25,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    color: "#91A8D6",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },

  query: {
    color: "#00D9FF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
});
