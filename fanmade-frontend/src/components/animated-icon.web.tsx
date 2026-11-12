import { StyleSheet, View, Text } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';

const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      {/* White glow ring — Loopa, not Expo glow image */}
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <View style={styles.glowRing} />
      </Animated.View>

      {/* Black glass background — Loopa Liquid + Glass */}
      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <View style={styles.loopaBackground} />
      </Animated.View>

      {/* Loopa L */}
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Text style={styles.loopaLetter}>L</Text>
        <Text style={styles.loopaName}>LOOPA</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    width: 201,
    height: 201,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  loopaBackground: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 10,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
  loopaLetter: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    width: 76,
    height: 76,
    borderRadius: 38,
    textAlign: 'center',
    lineHeight: 76,
    fontSize: 48,
    fontWeight: '900',
    overflow: 'hidden',
  },
  loopaName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 5,
    marginTop: 10,
  },
});