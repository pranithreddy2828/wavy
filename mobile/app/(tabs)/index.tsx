import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { MapPin, Sparkles, Compass } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors, typography } = useTheme();
  const router = useRouter();

  // Three concentric animated radar rings
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  // Center button gentle breathing pulse
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createRingAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const anim1 = createRingAnimation(ring1, 0);
    const anim2 = createRingAnimation(ring2, 800);
    const anim3 = createRingAnimation(ring3, 1600);

    anim1.start();
    anim2.start();
    anim3.start();
    pulseAnim.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      pulseAnim.stop();
    };
  }, []);

  const renderRadarRing = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.5],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.4, 0.2, 0],
    });

    return (
      <Animated.View
        style={[
          styles.radarRing,
          {
            borderColor: colors.googleBlue,
            backgroundColor: colors.primaryContainer,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Locality Bar */}
      <View style={styles.topBar}>
        <View style={[styles.locationChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MapPin size={14} color={colors.googleBlue} />
          <Text style={[typography.caption, { color: colors.text, fontWeight: '600', marginLeft: 5 }]}>
            Gachibowli, Hyderabad
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/discover' as any)}
          style={[styles.exploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Compass size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Center Radar & Circular Button */}
      <View style={styles.centerContainer}>
        {/* Animated Radar Pulse Waves */}
        {renderRadarRing(ring1)}
        {renderRadarRing(ring2)}
        {renderRadarRing(ring3)}

        {/* The Central Circular "Ask for Help" Button */}
        <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/create' as any)}
            style={[
              styles.centerCircleButton,
              {
                backgroundColor: colors.googleBlue,
                shadowColor: colors.googleBlue,
              },
            ]}
          >
            <Sparkles size={32} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.buttonMainText}>Ask for Help</Text>
            <Text style={styles.buttonSubText}>Tap to Connect</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Subtle Radar Status */}
        <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 42, letterSpacing: 0.5 }]}>
          HYPERLOCAL RADAR ACTIVE
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, textAlign: 'center', maxWidth: 260 }]}>
          Connect with nearby helpers for printing, repairs, rides & tutoring
        </Text>
      </View>

      {/* Bottom Quick Access to Browse Nearby */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/discover' as any)}
          style={[styles.browseButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
            Browse Nearby Requests
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  exploreBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
  },
  centerCircleButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  buttonMainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  buttonSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
});
