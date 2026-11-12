import { View, type ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  // Loopa: "black" = dark mode, "white" = light mode — kept for compat
  type?: ThemeColor | 'glass';
};

export function ThemedView({ style, lightColor, darkColor, type, children, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  // Glass card — Loopa Liquid + Glass
  if (type === 'glass') {
    return (
      <View style={[styles.glass, style]} {...otherProps}>
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.16)",
            "rgba(255,255,255,0.04)",
            "rgba(0,0,0,0.50)",
          ]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.topReflection} pointerEvents="none" />
        {children}
      </View>
    );
  }

  // Normal: use Loopa theme colors. lightColor/darkColor kept for old code,
  // but Loopa mode decides which one wins: white mode -> lightColor, black mode -> darkColor
  const backgroundColor =
    theme.mode === 'white'
      ? lightColor ?? theme[type ?? 'background']
      : darkColor ?? theme[type ?? 'background'];

  return <View style={[{ backgroundColor }, style]} {...otherProps}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
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
});