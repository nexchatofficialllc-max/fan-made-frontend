import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView style={{ backgroundColor: 'transparent' }}>
      <View style={styles.glassShell}>
        <BlurView
          intensity={60}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
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
          onPress={() => setIsOpen((value) => !value)}>
          <View style={styles.glassButton}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              weight="bold"
              tintColor="#FFFFFF"
              style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
            />
          </View>

          <ThemedText type="small" style={{ color: '#FFFFFF' }}>{title}</ThemedText>
        </Pressable>

        {isOpen && (
          <Animated.View entering={FadeIn.duration(200)}>
            <View style={styles.glassContent}>
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
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
  glassContent: {
    marginTop: Spacing.three,
    borderRadius: 16,
    marginLeft: Spacing.four,
    padding: Spacing.four,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
});