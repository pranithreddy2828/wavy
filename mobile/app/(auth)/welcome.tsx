import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    badge: 'HYPERLOCAL POWER',
    title: 'Ask for Help,\nGet It Nearby',
    description:
      'From urgent printing and laptop repairs to local transportation coordination and academic tutoring.',
    icon: <Zap size={48} color="#00D1B2" />,
  },
  {
    badge: 'PEER-TO-PEER COMMERCE',
    title: 'Transparent\nPrice Negotiation',
    description:
      'Propose custom offers, negotiate fair completion times, and communicate securely without phone sharing.',
    icon: <Sparkles size={48} color="#6366F1" />,
  },
  {
    badge: 'PRIVACY BY DESIGN',
    title: 'Defensive Safety &\nObfuscation',
    description:
      'Your exact home coordinates are never published. DPDP Act compliance with mutual activity reviews.',
    icon: <ShieldCheck size={48} color="#10B981" />,
  },
];

export default function WelcomeScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(slide);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Brand Header */}
      <View style={styles.topBar}>
        <Text style={[typography.h3, { color: colors.primary, fontWeight: '900', letterSpacing: 2 }]}>
          WAVY
        </Text>
        <Badge label="HYDERABAD" variant="primary" size="sm" />
      </View>

      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <View
              style={[
                styles.iconBubble,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                },
              ]}
            >
              {slide.icon}
            </View>

            <Badge label={slide.badge} variant="secondary" size="sm" style={{ marginTop: spacing.lg }} />

            <Text
              style={[
                typography.h1,
                { color: colors.text, textAlign: 'center', marginTop: spacing.md },
              ]}
            >
              {slide.title}
            </Text>

            <Text
              style={[
                typography.bodyLarge,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                  maxWidth: 320,
                  lineHeight: 24,
                },
              ]}
            >
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeSlide ? colors.primary : colors.surfaceSubtle,
                width: i === activeSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        <Button
          title="Explore Opportunities as Guest"
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.replace('/(tabs)' as any)}
          icon={<ArrowRight size={18} color={colors.textInverse} />}
          iconPosition="right"
          style={{ marginBottom: spacing.md }}
        />

        <Button
          title="Sign In with Email or Google"
          variant="secondary"
          size="md"
          fullWidth
          onPress={() => router.push('/(auth)/login' as any)}
        />
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
    paddingVertical: 12,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

