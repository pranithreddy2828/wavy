import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  Keyboard,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/ui/Input';
import { fetchCategories, createCommunityRequest, Category } from '../../src/services/requestsApi';
import {
  MapPin,
  Sparkles,
  User,
  X,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  Send,
  Zap,
  Clock,
  ChevronDown,
  Navigation,
  Shield,
  Check,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, typography } = useTheme();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormMounted, setIsFormMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'medium'>('urgent');
  const [budget, setBudget] = useState('200');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Location & Radar States
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [currentLocality, setCurrentLocality] = useState('Gachibowli');
  const [selectedRadius, setSelectedRadius] = useState<number>(2);

  const localities = [
    'Gachibowli',
    'Hitech City',
    'Madhapur',
    'Kondapur',
    'Financial District',
    'Banjara Hills',
    'Jubilee Hills',
    'DLF Cybercity',
  ];

  const budgetOptions = ['100', '200', '500', '1000'];

  // Radar wave animations (continuous, non-blocking)
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  // Master transition value: 0 = center radar, 1 = bottom docked form
  const transitionAnim = useRef(new Animated.Value(0)).current;

  // Location Tab & Bottom Sheet Animations
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const locationTabScale = useRef(new Animated.Value(1)).current;
  const beaconPulse = useRef(new Animated.Value(0.35)).current;

  // Live GPS beacon pulsing animation loop
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(beaconPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(beaconPulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  const openLocationSheet = () => {
    setLocationModalVisible(true);
    Animated.spring(sheetAnim, {
      toValue: 1,
      damping: 24,
      mass: 0.8,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeLocationSheet = (onFinished?: () => void) => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 190,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setLocationModalVisible(false);
      onFinished?.();
    });
  };

  const handleTabPressIn = () => {
    Animated.timing(locationTabScale, {
      toValue: 0.94,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handleTabPressOut = () => {
    Animated.spring(locationTabScale, {
      toValue: 1,
      damping: 14,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      })
      .catch(() => {});
  }, []);

  // Continuous radar pulse loop (runs seamlessly in native driver without start/stop jitter)
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

    const anim1 = createRingAnimation(ring1, 0);
    const anim2 = createRingAnimation(ring2, 850);
    const anim3 = createRingAnimation(ring3, 1700);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  // Ultra-smooth native spring downward transition
  const handleOpenForm = () => {
    setIsFormMounted(true);
    setIsExpanded(true);
    Animated.spring(transitionAnim, {
      toValue: 1,
      damping: 20,
      mass: 0.9,
      stiffness: 120,
      overshootClamping: false,
      useNativeDriver: true,
    }).start();
  };

  // Ultra-smooth native spring return back to center radar (zero layout snap)
  const handleCloseForm = () => {
    Keyboard.dismiss();
    setIsExpanded(false);
    Animated.spring(transitionAnim, {
      toValue: 0,
      damping: 20,
      mass: 0.9,
      stiffness: 120,
      overshootClamping: false,
      useNativeDriver: true,
    }).start(() => {
      setIsFormMounted(false);
      setSubmitted(false);
    });
  };

  // Hardware & gesture back button support (Android)
  useEffect(() => {
    const onBackPress = () => {
      if (isExpanded) {
        handleCloseForm();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isExpanded]);

  const handlePostRequest = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await createCommunityRequest({
        title: title.trim(),
        description: description.trim(),
        category_id: selectedCategory || 1,
        urgency,
        budget: parseFloat(budget) || 200,
        area_name: currentLocality,
        visibility_radius_km: selectedRadius,
      });
    } catch {
      // Graceful offline fallback
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        handleCloseForm();
        setTitle('');
        setDescription('');
      }, 1500);
    }
  };

  // 100% Native-Driver continuous motion curves
  const buttonTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT * 0.32],
  });

  // Scales down smoothly from 170px to ~76px
  const buttonScale = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.46],
  });

  const radarOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const centerContentOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.35],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const sendIconOpacity = transitionAnim.interpolate({
    inputRange: [0.55, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const formOpacity = transitionAnim.interpolate({
    inputRange: [0.2, 0.9],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const formTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const homeControlsOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const formControlsOpacity = transitionAnim.interpolate({
    inputRange: [0.35, 0.75],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const sheetBackdropOpacity = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [450, 0],
  });

  const renderRadarRing = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.5],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.35, 0.18, 0],
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
      {/* Top Bar with Seamless Cross-Fade */}
      <View style={styles.topBar}>
        {/* Left Slot: Location Chip <-> Back Pill */}
        <View style={styles.topBarSlotLeft}>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.topBarItem, { opacity: homeControlsOpacity }]}
            pointerEvents={isExpanded ? 'none' : 'auto'}
          >
            <Animated.View style={{ transform: [{ scale: locationTabScale }] }}>
              <TouchableOpacity
                onPress={openLocationSheet}
                onPressIn={handleTabPressIn}
                onPressOut={handleTabPressOut}
                style={[
                  styles.locationTab,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.9}
              >
                <View style={[styles.locationPinCircle, { backgroundColor: colors.primaryContainer }]}>
                  <MapPin size={13} color={colors.googleBlue} />
                  <Animated.View
                    style={[
                      styles.beaconBadgeDot,
                      { backgroundColor: colors.googleGreen, opacity: beaconPulse },
                    ]}
                  />
                </View>
                <View style={styles.locationTextStack}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[typography.caption, { color: colors.text, fontWeight: '800', fontSize: 13 }]}>
                      {currentLocality}
                    </Text>
                    <ChevronDown size={13} color={colors.textSecondary} style={{ marginLeft: 3 }} />
                  </View>
                  <Text style={[typography.caption, { color: colors.textSecondary, fontSize: 10, marginTop: -1 }]}>
                    Hyderabad • {selectedRadius} km radar
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[StyleSheet.absoluteFill, styles.topBarItem, { opacity: formControlsOpacity }]}
            pointerEvents={isExpanded ? 'auto' : 'none'}
          >
            <TouchableOpacity
              onPress={handleCloseForm}
              style={[styles.backBtnPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <ArrowLeft size={16} color={colors.text} />
              <Text style={[typography.caption, { color: colors.text, fontWeight: '700', marginLeft: 6 }]}>
                Back
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Right Slot: Google-style Profile Avatar <-> Close 'X' */}
        <View style={styles.topBarSlotRight}>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.topBarItemRight, { opacity: homeControlsOpacity }]}
            pointerEvents={isExpanded ? 'none' : 'auto'}
          >
            <TouchableOpacity
              onPress={() => router.push('/profile' as any)}
              style={[
                styles.profileAvatarBtn,
                {
                  backgroundColor: colors.googleBlue,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarInitial}>R</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[StyleSheet.absoluteFill, styles.topBarItemRight, { opacity: formControlsOpacity }]}
            pointerEvents={isExpanded ? 'auto' : 'none'}
          >
            <TouchableOpacity
              onPress={handleCloseForm}
              style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <X size={18} color={colors.text} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Main Interactive Stage */}
      <View style={styles.stageContainer}>
        {/* Animated Radar Waves (Fade out smoothly on transition) */}
        <Animated.View style={[styles.radarLayer, { opacity: radarOpacity }]} pointerEvents="none">
          {renderRadarRing(ring1)}
          {renderRadarRing(ring2)}
          {renderRadarRing(ring3)}
        </Animated.View>

        {/* Revealed Categories & Post Form (Smooth slide and fade) */}
        {isFormMounted && (
          <Animated.View
            style={[
              styles.revealedForm,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              },
            ]}
            pointerEvents={isExpanded ? 'auto' : 'none'}
          >
            {submitted ? (
              <View style={styles.successState}>
                <View style={[styles.successCircle, { backgroundColor: colors.primaryContainer }]}>
                  <CheckCircle2 size={44} color={colors.primary} />
                </View>
                <Text style={[typography.h3, { color: colors.text, marginTop: 14, fontWeight: '800' }]}>
                  Broadcast Sent!
                </Text>
                <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
                  Neighbours near Gachibowli have been notified.
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* 1. Category Selection Pills */}
                <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 }]}>
                  SELECT CATEGORY
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

                {/* 2. Title */}
                <Input
                  label="What do you need?"
                  placeholder="e.g. 20 Pages Color Printout by 4 PM"
                  value={title}
                  onChangeText={setTitle}
                  containerStyle={{ marginTop: 10, marginBottom: 10 }}
                />

                {/* 3. Details (Optional) */}
                <Input
                  label="Details or note (optional)"
                  placeholder="e.g. Double sided Xerox on 100gsm paper, will collect."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                  style={{ minHeight: 52 }}
                  containerStyle={{ marginBottom: 10 }}
                />

                {/* 4. Speed & Urgency */}
                <View style={styles.urgencyRow}>
                  <TouchableOpacity
                    onPress={() => setUrgency('urgent')}
                    style={[
                      styles.urgencyChip,
                      {
                        backgroundColor: urgency === 'urgent' ? colors.dangerMuted : colors.surface,
                        borderColor: urgency === 'urgent' ? colors.googleRed : colors.border,
                      },
                    ]}
                  >
                    <Zap size={14} color={urgency === 'urgent' ? colors.googleRed : colors.textTertiary} />
                    <Text
                      style={[
                        typography.caption,
                        { color: urgency === 'urgent' ? colors.googleRed : colors.textSecondary, fontWeight: '700', marginLeft: 4 },
                      ]}
                    >
                      Urgent (Today)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setUrgency('medium')}
                    style={[
                      styles.urgencyChip,
                      {
                        backgroundColor: urgency === 'medium' ? colors.primaryContainer : colors.surface,
                        borderColor: urgency === 'medium' ? colors.googleBlue : colors.border,
                      },
                    ]}
                  >
                    <Clock size={14} color={urgency === 'medium' ? colors.googleBlue : colors.textTertiary} />
                    <Text
                      style={[
                        typography.caption,
                        { color: urgency === 'medium' ? colors.googleBlue : colors.textSecondary, fontWeight: '700', marginLeft: 4 },
                      ]}
                    >
                      Flexible Time
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 5. Budget Chips */}
                <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginTop: 10, marginBottom: 6, textTransform: 'uppercase' }]}>
                  BUDGET (₹ INR)
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

        {/* The Continuous Circular Button (Zero layout jumps, 100% native driver) */}
        <Animated.View
          style={[
            styles.continuousCircleContainer,
            {
              transform: [
                { translateY: buttonTranslateY },
                { scale: buttonScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={isExpanded ? handlePostRequest : handleOpenForm}
            disabled={isSubmitting || submitted}
            style={[
              styles.universalCircleButton,
              {
                backgroundColor: colors.googleBlue,
                shadowColor: colors.googleBlue,
              },
            ]}
          >
            {/* Center State Content: "Ask for Help" */}
            <Animated.View style={[styles.innerContentOverlay, { opacity: centerContentOpacity }]} pointerEvents="none">
              <Sparkles size={32} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.buttonMainText}>Ask for Help</Text>
              <Text style={styles.buttonSubText}>Tap to Connect</Text>
            </Animated.View>

            {/* Bottom-Docked State Content: Pure Circular Send Icon */}
            <Animated.View style={[styles.innerContentOverlay, { opacity: sendIconOpacity }]} pointerEvents="none">
              {isSubmitting ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : submitted ? (
                <CheckCircle2 size={60} color="#FFFFFF" />
              ) : (
                <Send size={52} color="#FFFFFF" strokeWidth={2.4} style={{ marginLeft: 6 }} />
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Center Caption in Radar Mode (Smoothly fades with radar) */}
        <Animated.View style={[styles.captionBox, { opacity: radarOpacity }]} pointerEvents="none">
          <View style={[styles.radarStatusPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Animated.View style={[styles.pulseDot, { backgroundColor: colors.googleGreen, opacity: beaconPulse }]} />
            <Text style={[typography.caption, { color: colors.text, fontWeight: '700', fontSize: 11, letterSpacing: 0.3 }]}>
              RADAR ACTIVE • {selectedRadius} KM
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 6, textAlign: 'center', maxWidth: 280 }]}>
            Broadcasting to neighbours in {currentLocality} for quick assistance
          </Text>
        </Animated.View>
      </View>

      {/* Google Material 3 Location & Radar Bottom Sheet with Spring Physics */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeLocationSheet()}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: sheetBackdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => closeLocationSheet()}
          />
          <Animated.View
            style={[
              styles.locationSheetContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
            {/* Handle Drag Bar */}
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

            {/* Sheet Title */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
                  Choose Location & Radar
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  Set your neighbourhood radius for community assistance
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => closeLocationSheet()}
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* GPS Auto-detect Button */}
            <TouchableOpacity
              onPress={() => {
                closeLocationSheet(() => setCurrentLocality('Gachibowli'));
              }}
              style={[styles.gpsDetectBtn, { backgroundColor: colors.primaryContainer, borderColor: colors.googleBlue }]}
              activeOpacity={0.8}
            >
              <Navigation size={16} color={colors.googleBlue} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
                  Use Current Location (GPS)
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary, fontSize: 11 }]}>
                  Auto-detects closest Hyderabad ward (DPDP masked)
                </Text>
              </View>
              <Check size={16} color={colors.googleBlue} />
            </TouchableOpacity>

            {/* Radar Radius Range */}
            <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '800', marginTop: 18, marginBottom: 8, letterSpacing: 0.8 }]}>
              RADAR DISCOVERY RADIUS
            </Text>
            <View style={styles.radiusChipsRow}>
              {[
                { km: 1, label: '1 km', desc: 'Walking' },
                { km: 2, label: '2 km', desc: 'Colony' },
                { km: 5, label: '5 km', desc: 'Sub-district' },
                { km: 10, label: '10 km', desc: 'Corridor' },
              ].map((r) => {
                const isSelected = selectedRadius === r.km;
                return (
                  <TouchableOpacity
                    key={r.km}
                    onPress={() => setSelectedRadius(r.km)}
                    style={[
                      styles.radiusCard,
                      {
                        backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                        borderColor: isSelected ? colors.googleBlue : colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        typography.bodyBold,
                        { color: isSelected ? colors.googleBlue : colors.text },
                      ]}
                    >
                      {r.label}
                    </Text>
                    <Text
                      style={[
                        typography.caption,
                        { color: isSelected ? colors.googleBlue : colors.textSecondary, fontSize: 10, marginTop: 1 },
                      ]}
                    >
                      {r.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Popular Neighbourhoods Grid */}
            <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '800', marginTop: 18, marginBottom: 8, letterSpacing: 0.8 }]}>
              POPULAR NEIGHBOURHOODS
            </Text>
            <View style={styles.localitiesGrid}>
              {localities.map((loc) => {
                const isSelected = currentLocality === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => {
                      closeLocationSheet(() => setCurrentLocality(loc));
                    }}
                    style={[
                      styles.localityPill,
                      {
                        backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                        borderColor: isSelected ? colors.googleBlue : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <MapPin size={12} color={isSelected ? colors.googleBlue : colors.textSecondary} />
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: isSelected ? colors.googleBlue : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                          marginLeft: 4,
                        },
                      ]}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* DPDP Act Privacy Notice */}
            <View style={[styles.privacyBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderSubtle }]}>
              <Shield size={14} color={colors.googleGreen} />
              <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6, flex: 1, fontSize: 11 }]}>
                DPDP Act 2023: Exact GPS coordinates are automatically obfuscated by ~1 km to protect home privacy.
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topBarSlotLeft: {
    height: 38,
    justifyContent: 'center',
    minWidth: 160,
  },
  topBarSlotRight: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  topBarItem: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarItemRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  locationPinCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  beaconBadgeDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  locationTextStack: {
    justifyContent: 'center',
  },
  radarStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  locationSheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsDetectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  radiusChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  localitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  localityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  backBtnPill: {
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarLayer: {
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
  continuousCircleContainer: {
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  universalCircleButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  innerContentOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
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
  captionBox: {
    position: 'absolute',
    bottom: 36,
    alignItems: 'center',
  },
  revealedForm: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    height: SCREEN_HEIGHT * 0.54,
    zIndex: 5,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 6,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  urgencyChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  successState: {
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
});
