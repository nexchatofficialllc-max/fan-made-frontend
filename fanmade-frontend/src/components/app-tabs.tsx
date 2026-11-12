import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const STORIES = [
  { id: "you", name: "Your Story", initial: "Y" },
  { id: "1", name: "Maya", initial: "M" },
  { id: "2", name: "Kofi", initial: "K" },
  { id: "3", name: "Lena", initial: "L" },
  { id: "4", name: "Zara", initial: "Z" },
];

const POSTS = [
  { id: "p1", name: "Maya", handle: "@maya", time: "2m", text: "New Loopa set is live — which look is your fav?", fans: "12.4k Fans", likes: "1.2k" },
  { id: "p2", name: "Kofi", handle: "@kofi", time: "18m", text: "Behind the scenes from today’s shoot 🎬", fans: "8.1k Fans", likes: "892" },
  { id: "p3", name: "Lena", handle: "@lena", time: "1h", text: "Fami helped me pick this caption — thoughts?", fans: "22k Fans", likes: "2.4k" },
];

export default function HomeScreen() {
  return (
    <FlatList
      data={POSTS}
      keyExtractor={(i) => i.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.logo}>LOOPA</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">For You • Fans • Creators</ThemedText>
          </View>

          {/* Stories — social, not template */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={STORIES}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.stories}
            renderItem={({ item, index }) => (
              <Pressable style={styles.story}>
                <View style={[styles.storyCircle, index === 0 && styles.yourStory]}>
                  <Text style={styles.storyInitial}>{item.initial}</Text>
                </View>
                <ThemedText type="small">{item.name}</ThemedText>
              </Pressable>
            )}
          />
          <ThemedText type="eyebrow" style={styles.sectionLabel}>FROM CREATORS YOU FAN</ThemedText>
        </View>
      }
      renderItem={({ item }) => (
        <ThemedView type="glass" style={styles.post}>
          <View style={styles.postHeader}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name[0]}</Text></View>
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold">{item.name} <ThemedText type="small" themeColor="textSecondary">{item.handle} • {item.time}</ThemedText></ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{item.fans}</ThemedText>
            </View>
            <Pressable style={styles.fanButton}><Text style={styles.fanButtonText}>Fan</Text></Pressable>
          </View>
          <ThemedText style={styles.postText}>{item.text}</ThemedText>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.playIcon}>▶</Text>
            <ThemedText type="small" themeColor="textSecondary">Loop video • Tap to play</ThemedText>
          </View>
          <View style={styles.actions}>
            <Pressable><Text style={styles.action}>♡ {item.likes}</Text></Pressable>
            <Pressable><Text style={styles.action}>💬 Comment</Text></Pressable>
            <Pressable><Text style={styles.action}>↗ Share</Text></Pressable>
            <Pressable><Text style={styles.action}>@fami</Text></Pressable>
          </View>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 120, gap: 14 },
  header: { marginBottom: 16 },
  logo: { fontSize: 32, lineHeight: 36, letterSpacing: 4 },
  stories: { gap: 14, paddingVertical: 8 },
  story: { alignItems: 'center', gap: 6, width: 68 },
  storyCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  yourStory: { backgroundColor: '#000000', borderStyle: 'dashed' },
  storyInitial: { color: '#000000', fontSize: 22, fontWeight: '900' },
  sectionLabel: { marginTop: 16, marginBottom: 4 },
  post: { padding: 14, gap: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000000', fontSize: 18, fontWeight: '900' },
  fanButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  fanButtonText: { color: '#000000', fontSize: 13, fontWeight: '800' },
  postText: { fontSize: 15, lineHeight: 21 },
  videoPlaceholder: {
    height: 180, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)',
  },
  playIcon: { color: '#FFFFFF', fontSize: 32 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 },
  action: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});