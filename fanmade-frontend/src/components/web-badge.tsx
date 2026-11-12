import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useLoopaTheme } from '@/lib/loopa-theme';
import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const { mode } = useLoopaTheme();

  return (
    <View style={styles.container}>
      <View style={styles.glassBadge}>
        <Text style={styles.loopaMark}>L</Text>
        <Text style={styles.loopaName}>LOOPA</Text>
      </View>
      <Text style={styles.versionText}>
        LOOPA • {mode === 'white' ? 'White' : 'Black'} • Liquid + Glass
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  loopaMark: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 18,
    fontWeight: '900',
    overflow: 'hidden',
  },
  loopaName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  versionText: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 12,
  },
});