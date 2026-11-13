import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/ui/Input';
import { fetchCategories, Category } from '../../src/services/requestsApi';
import {
  MapPin,
  Sparkles,
  Compass,
  X,
  CheckCircle2,
  IndianRupee,
  ArrowUp,
  Send,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, typography, radius } = useTheme();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('200');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const budgetOptions = ['100', '200', '500', '1000'];

  // Radar wave animations
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  // Transition animations
  const transitionAnim = useRef(new Animated.Value(0)).current; // 0 = center radar, 1 = expanded form

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      })
      .catch(() => {});
  }, []);

  // Radar looping effect
  useEffect(() => {
    let anim1: Animated.CompositeAnimation;
    let anim2: Animated.CompositeAnimation;
    let anim3: Animated.CompositeAnimation;
    let pulseAnim: Animated.CompositeAnimation;

    if (!isExpanded) {
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

      pulseAnim = Animated.loop(
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

      anim1 = createRingAnimation(ring1, 0);
      anim2 = createRingAnimation(ring2, 800);
      anim3 = createRingAnimation(ring3, 1600);

      anim1.start();
      anim2.start();
      anim3.start();
      pulseAnim.start();
    }

    return () => {
      anim1?.stop();
      anim2?.stop();
      anim3?.stop();
      pulseAnim?.stop();
    };
  }, [isExpanded]);

  // Trigger smooth transition from Center Radar to Bottom Dock
  const handleOpenForm = () => {
    setIsExpanded(true);
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(0.2, 0.9, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  // Trigger smooth reverse transition back to Center Radar
  const handleCloseForm = () => {
    Animated.timing(transitionAnim, {
      toValue: 0,
      duration: 450,
      easing: Easing.bezier(0.2, 0.9, 0.3, 1),
      useNativeDriver: true,
    }).start(() => {
      setIsExpanded(false);
      setSubmitted(false);
    });
  };

  const handlePostRequest = () => {
    if (!title.trim()) {
      Alert.alert('What do you need?', 'Please enter a title for your request.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  // Interpolated animation values
  // Moves button down from center towards the bottom
  const buttonTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT * 0.33],
  });

  // Scale down the button slightly as it docks to the bottom
  const buttonScale = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.78],
  });

  // Radar rings fade out smoothly
  const radarOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });

  // Category and form fade in and slide up
  const formOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.2, 1],
  });

  const formTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

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
            opacity: Animated.multiply(opacity, radarOpacity),
          },
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={[styles.locationChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MapPin size={14} color={colors.googleBlue} />
          <Text style={[typography.caption, { color: colors.text, fontWeight: '600', marginLeft: 5 }]}>
            Gachibowli, Hyderabad
          </Text>
        </View>

        {isExpanded ? (
          <TouchableOpacity
            onPress={handleCloseForm}
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant }]}
            activeOpacity={0.8}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/discover' as any)}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <Compass size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Body Container */}
      <View style={styles.mainContainer}>
        {/* Animated Radar Rings in Center */}
        {!isExpanded && (
          <View style={styles.radarWrapper}>
            {renderRadarRing(ring1)}
            {renderRadarRing(ring2)}
            {renderRadarRing(ring3)}
          </View>
        )}

        {/* Revealed Categories & Post Form */}
        {isExpanded && (
          <Animated.View
            style={[
              styles.expandedFormContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              },
            ]}
          >
            {submitted ? (
              <View style={styles.successBox}>
                <View style={[styles.successCircle, { backgroundColor: colors.primaryContainer }]}>
                  <CheckCircle2 size={44} color={colors.googleBlue} />
                </View>
                <Text style={[typography.h2, { color: colors.text, textAlign: 'center', marginTop: 14 }]}>
                  Request Published!
                </Text>
                <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
                  Helpers near Gachibowli are receiving your request now.
                </Text>
                <TouchableOpacity
                  onPress={handleCloseForm}
                  style={[styles.doneBtn, { backgroundColor: colors.googleBlue }]}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 130 }}
              >
                <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
                  Post a Request
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2, marginBottom: 12 }]}>
                  Choose category and let nearby neighbours assist you
                </Text>

                {/* Categories Horizontal Carousel */}
                <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 }]}>
                  CATEGORY
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        style={[
                          styles.catPill,
                          {
                            backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                            borderColor: isSelected ? colors.googleBlue : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.caption,
                            {
                              color: isSelected ? colors.googleBlue : colors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Request Inputs */}
                <Input
                  label="What do you need?"
                  placeholder="e.g. 20 Pages Color Printout by 4 PM"
                  value={title}
                  onChangeText={setTitle}
                  containerStyle={{ marginTop: 10, marginBottom: 10 }}
                />

                <Input
                  label="Optional note"
                  placeholder="e.g. Double-sided 100gsm Xerox near DLF"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                  style={{ minHeight: 50 }}
                  containerStyle={{ marginBottom: 12 }}
                />

                {/* Quick Budget Chips */}
                <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 }]}>
                  OFFERED BUDGET (₹ INR)
                </Text>
                <View style={styles.budgetRow}>
                  {budgetOptions.map((amt) => {
                    const isSelected = budget === amt;
                    return (
                      <TouchableOpacity
                        key={amt}
                        onPress={() => setBudget(amt)}
                        style={[
                          styles.budgetChip,
                          {
                            backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                            borderColor: isSelected ? colors.googleBlue : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.bodyBold,
                            { color: isSelected ? colors.googleBlue : colors.text },
                          ]}
                        >
                          ₹{amt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </Animated.View>
        )}

        {/* The Transitioning Circular "Ask for Help" Button */}
        <Animated.View
          style={[
            styles.animatedButtonWrapper,
            {
              transform: [
                { translateY: buttonTranslateY },
                { scale: isExpanded ? buttonScale : buttonPulse },
              ],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={isExpanded ? handlePostRequest : handleOpenForm}
            style={[
              styles.centerCircleButton,
              {
                backgroundColor: colors.googleBlue,
                shadowColor: colors.googleBlue,
              },
            ]}
          >
            {isExpanded ? (
              <>
                <Send size={26} color="#FFFFFF" />
                <Text style={styles.buttonMainText}>Publish</Text>
              </>
            ) : (
              <>
                <Sparkles size={32} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.buttonMainText}>Ask for Help</Text>
                <Text style={styles.buttonSubText}>Tap to Start</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Radar caption when not expanded */}
        {!isExpanded && (
          <View style={styles.captionContainer}>
            <Text style={[typography.caption, { color: colors.textTertiary, letterSpacing: 0.5 }]}>
              HYPERLOCAL RADAR ACTIVE
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, textAlign: 'center', maxWidth: 260 }]}>
              Connect with nearby helpers for printing, repairs, rides & tutoring
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Shortcut to Browse */}
      {!isExpanded && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/discover' as any)}
            style={[styles.browseButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
              Browse Nearby Requests
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 10,
    zIndex: 10,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarWrapper: {
    ...StyleSheet.absoluteFill,
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
  animatedButtonWrapper: {
    zIndex: 20,
    position: 'absolute',
  },
  centerCircleButton: {
    width: 164,
    height: 164,
    borderRadius: 82,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonMainText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  buttonSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  expandedFormContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 5,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  budgetChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  successBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
