import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

// Internal loading page: the cart logo (without the name) bobbing in the
// middle, "Loading..." under it, and the happy mascot at the bottom left.
const LoadingScreen: React.FC = () => {
  const bob = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 450,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    const timer = setInterval(() => setDots(d => (d % 3) + 1), 400);
    return () => {
      loop.stop();
      clearInterval(timer);
    };
  }, [bob]);

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.logoCrop, {transform: [{translateY}]}]}>
          <Image
            source={require('../assest/Profile-Logo.png')}
            style={styles.logo}
          />
        </Animated.View>
        <Text style={styles.loadingText}>
          Loading{'.'.repeat(dots)}
          <Text style={styles.hidden}>{'.'.repeat(3 - dots)}</Text>
        </Text>
      </View>

      <View style={styles.mascotRow}>
        <Image
          source={require('../assest/dahsheh.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcome}>
          Welcome, always… we are so happy to have you!
        </Text>
      </View>
    </View>
  );
};

const LOGO_SIZE = 220;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Show only the cart square from the full logo artwork.
  logoCrop: {
    width: LOGO_SIZE * 0.46,
    height: LOGO_SIZE * 0.42,
    overflow: 'hidden',
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginTop: -LOGO_SIZE * 0.15,
  },
  loadingText: {
    marginTop: 16,
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  hidden: {
    color: 'transparent',
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  mascot: {
    width: 80,
    height: 110,
    resizeMode: 'contain',
  },
  welcome: {
    flex: 1,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 20,
  },
});

export default LoadingScreen;
