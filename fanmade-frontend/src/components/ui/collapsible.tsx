import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const rotate = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    rotate.value = withTiming(next ? 90 : 0, { duration: 220 });
  };

  return (
    <ThemedView style={{ backgroundColor: 'transparent' }}>
      <View style={styles.glassShell}>
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

        <Pressable
          style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
          onPress={toggle}>
          <View style={styles.glassButton}>
            <Animated.Text style={[styles.chevron, chevronStyle]}>›</Animated.Text>
          </View>

          <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>{title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.tapHint}>
            {isOpen ? 'Hide' : 'Show'}
          </ThemedText>
        </Pressable>

        {isOpen && (
          <Animated.View entering={FadeIn.duration(220)}>
            <View style={styles.glassContent}>
              <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.12)",
                  "rgba(255,255,255,0.03)",
                  "rgba(0,0,0,0.40)",
                ]}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
              />
              {children}
            </View>
          </Animated.View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  glassShell: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    padding: Spacing.four,
  },
  topReflection: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  glassButton: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  chevron: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '900',
    marginLeft: 2,
  },
  tapHint: {
    marginLeft: 'auto',
    fontSize: 12,
  },
  glassContent: {
    marginTop: Spacing.three,
    borderRadius: 16,
    padding: Spacing.four,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
});