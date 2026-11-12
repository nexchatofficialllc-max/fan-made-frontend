import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton label="Home" icon="⌂" />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton label="Explore" icon="◉" />
          </TabTrigger>
          <TabTrigger name="create" href="/create" asChild>
            <CreateButton />
          </TabTrigger>
          <TabTrigger name="inbox" href="/inbox" asChild>
            <TabButton label="Inbox" icon="✉" badge={3} />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton label="Profile" icon="●" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, label, icon, badge, ...props }: TabTriggerSlotProps & { label?: string; icon?: string; badge?: number }) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabPress, pressed && styles.pressed]}>
      <View style={[styles.tabButtonView, isFocused && styles.tabButtonFocused]}>
        {isFocused && <View style={styles.tabTopReflection} pointerEvents="none" />}
        <Text style={[styles.tabIcon, { color: isFocused ? '#FFFFFF' : '#AAAAAA' }]}>{icon}</Text>
        <ThemedText type="smallBold" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {label ?? children}
        </ThemedText>
        {badge ? (
          <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
        ) : null}
      </View>
    </Pressable>
  );
}

export function CreateButton(props: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.createPress, pressed && styles.pressed]}>
      <View style={styles.createButton}>
        <Text style={styles.createPlus}>+</Text>
      </View>
      <ThemedText type="smallBold" style={styles.createLabel}>Create</ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.50)"]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.topReflection} pointerEvents="none" />
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: Spacing.three,
    paddingBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.five,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topReflection: {
    position: 'absolute',
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  tabPress: { flex: 1, alignItems: 'center' },
  pressed: { opacity: 0.7 },
  tabButtonView: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  tabButtonFocused: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tabTopReflection: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  tabIcon: { fontSize: 22, lineHeight: 24 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#000000', fontSize: 11, fontWeight: '900' },
  createPress: { flex: 1, alignItems: 'center', gap: 2, marginTop: -28 },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  createPlus: { color: '#000000', fontSize: 32, lineHeight: 32, fontWeight: '900' },
  createLabel: { fontSize: 12 },
});