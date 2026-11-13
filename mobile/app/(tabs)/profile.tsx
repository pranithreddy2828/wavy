import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import {
  Star,
  ShieldCheck,
  Moon,
  Sun,
  Shield,
  FileText,
  ChevronRight,
  MapPin,
  ArrowLeft,
  Clock,
  Sliders,
  LogOut,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCREEN_PADDING = 18;
const SEGMENT_PADDING = 4;
const SEGMENT_WIDTH = SCREEN_WIDTH - SCREEN_PADDING * 2;
const TAB_WIDTH = (SEGMENT_WIDTH - SEGMENT_PADDING * 2) / 2;

type ViewMode = 'activity' | 'settings';
type ActivityFilter = 'all' | 'requests' | 'offers' | 'completed';

export default function ProfileScreen() {
  const { colors, typography, isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('activity');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [fuzzyLocation, setFuzzyLocation] = useState(true);

  // Animated values
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const segmentSlideAnim = useRef(new Animated.Value(0)).current; // 0 = activity, 1 = settings
  const filterFadeAnim = useRef(new Animated.Value(1)).current;

  // Mount entrance spring animation
  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      damping: 20,
      mass: 0.9,
      stiffness: 130,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle segment switch with spring slider & cross-fade
  const handleSwitchSegment = (mode: ViewMode) => {
    if (mode === viewMode) return;
    setViewMode(mode);
    Animated.spring(segmentSlideAnim, {
      toValue: mode === 'activity' ? 0 : 1,
      damping: 22,
      mass: 0.8,
      stiffness: 170,
      useNativeDriver: true,
    }).start();
  };

  // Handle filter chip switch with subtle fade
  const handleFilterChange = (filter: ActivityFilter) => {
    if (filter === activityFilter) return;
    Animated.timing(filterFadeAnim, {
      toValue: 0.35,
      duration: 80,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setActivityFilter(filter);
      Animated.timing(filterFadeAnim, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  // Interpolated animation values
  const headerScale = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const headerOpacity = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bodyTranslateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const bodyOpacity = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const indicatorTranslateX = segmentSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  // Clean activity data
  const activities = [
    {
      id: 'act-1',
      type: 'request',
      title: 'Urgent Printing of 25 Thesis Pages',
      category: 'Printing',
      status: 'In Progress',
      statusColor: colors.googleBlue,
      price: 200,
      partner: 'Kiran Hub',
      time: 'Today, 4:30 PM',
      locality: 'Gachibowli',
    },
    {
      id: 'act-2',
      type: 'request',
      title: 'Carpool to Uppal Metro Station',
      category: 'Carpool',
      status: '2 Offers',
      statusColor: colors.googleGreen,
      price: 250,
      partner: 'Receiving Offers',
      time: 'Yesterday',
      locality: 'Hitech City',
    },
    {
      id: 'act-3',
      type: 'offer',
      title: 'MacBook Air M2 Screen Diagnostics',
      category: 'Repair',
      status: 'Offer Sent',
      statusColor: colors.googleYellow,
      price: 500,
      partner: 'Aakash P.',
      time: 'Today, 10:15 AM',
      locality: 'Kondapur',
    },
    {
      id: 'act-4',
      type: 'completed',
      title: 'Python Asyncio Task Queue Debugging',
      category: 'Tutoring',
      status: 'Completed',
      statusColor: colors.googleGreen,
      price: 800,
      partner: 'Ananya R.',
      time: '3 days ago',
      locality: 'Remote',
    },
    {
      id: 'act-5',
      type: 'completed',
      title: 'WiFi Mesh Router Setup',
      category: 'Tech Help',
      status: 'Completed',
      statusColor: colors.googleGreen,
      price: 400,
      partner: 'Vikram S.',
      time: 'Last week',
      locality: 'Gachibowli',
    },
  ];

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'requests') return act.type === 'request';
    if (activityFilter === 'offers') return act.type === 'offer';
    if (activityFilter === 'completed') return act.type === 'completed';
    return true;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* 1. Google Top Bar with Back Button */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>

        <Text style={[typography.bodyBold, { color: colors.text, fontSize: 17 }]}>
          Account
        </Text>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={17} color="#FBBC04" />
          ) : (
            <Moon size={17} color={colors.googleBlue} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Google Account Centered Identity (Spring Entrance) */}
        <Animated.View
          style={[
            styles.profileHeaderSection,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <View style={[styles.largeAvatar, { backgroundColor: colors.googleBlue }]}>
            <Text style={styles.largeAvatarInitial}>R</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
              Rahul Verma
            </Text>
            <ShieldCheck size={18} color={colors.googleGreen} style={{ marginLeft: 6 }} />
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            rahul.verma@wavy.local
          </Text>

          {/* Clean Location & Reputation Pill */}
          <View style={[styles.infoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MapPin size={12} color={colors.googleBlue} />
            <Text style={[typography.caption, { color: colors.text, fontWeight: '600', marginLeft: 4 }]}>
              Gachibowli, Hyderabad
            </Text>
            <Text style={{ color: colors.textTertiary, marginHorizontal: 6 }}>•</Text>
            <Star size={12} color="#FBBC04" fill="#FBBC04" />
            <Text style={[typography.caption, { color: colors.text, fontWeight: '700', marginLeft: 3 }]}>
              4.9
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 2 }]}>
              (14 assists)
            </Text>
          </View>
        </Animated.View>

        {/* 3. Smooth Sliding Segmented Pill Control */}
        <Animated.View
          style={[
            styles.segmentedContainer,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.border,
              opacity: bodyOpacity,
              transform: [{ translateY: bodyTranslateY }],
            },
          ]}
        >
          {/* Animated Sliding White Background Pill */}
          <Animated.View
            style={[
              styles.slidingPill,
              {
                width: TAB_WIDTH,
                backgroundColor: colors.surface,
                shadowColor: '#000',
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />

          <TouchableOpacity
            onPress={() => handleSwitchSegment('activity')}
            style={styles.segmentBtn}
            activeOpacity={0.8}
          >
            <Clock size={15} color={viewMode === 'activity' ? colors.googleBlue : colors.textSecondary} />
            <Text
              style={[
                typography.caption,
                {
                  color: viewMode === 'activity' ? colors.googleBlue : colors.textSecondary,
                  fontWeight: viewMode === 'activity' ? '700' : '600',
                  marginLeft: 6,
                },
              ]}
            >
              My Activity ({activities.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSwitchSegment('settings')}
            style={styles.segmentBtn}
            activeOpacity={0.8}
          >
            <Sliders size={15} color={viewMode === 'settings' ? colors.googleBlue : colors.textSecondary} />
            <Text
              style={[
                typography.caption,
                {
                  color: viewMode === 'settings' ? colors.googleBlue : colors.textSecondary,
                  fontWeight: viewMode === 'settings' ? '700' : '600',
                  marginLeft: 6,
                },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 4. ACTIVITY VIEW (Smooth Fade on Filtering) */}
        {viewMode === 'activity' && (
          <Animated.View
            style={[
              styles.viewSection,
              {
                opacity: bodyOpacity,
                transform: [{ translateY: bodyTranslateY }],
              },
            ]}
          >
            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {[
                { key: 'all', label: `All (${activities.length})` },
                { key: 'requests', label: 'Requests (2)' },
                { key: 'offers', label: 'Offers (1)' },
                { key: 'completed', label: 'Completed (2)' },
              ].map((chip) => {
                const isSelected = activityFilter === chip.key;
                return (
                  <TouchableOpacity
                    key={chip.key}
                    onPress={() => handleFilterChange(chip.key as ActivityFilter)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                        borderColor: isSelected ? colors.googleBlue : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
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
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Filtered Activity Cards with Soft Fade Transition */}
            <Animated.View style={{ gap: 10, marginTop: 12, opacity: filterFadeAnim }}>
              {filteredActivities.map((act) => (
                <TouchableOpacity
                  key={act.id}
                  activeOpacity={0.88}
                  style={[
                    styles.cleanCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.categoryTag, { backgroundColor: colors.surfaceVariant }]}>
                      <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600', fontSize: 11 }]}>
                        {act.category}
                      </Text>
                    </View>
                    <View style={[styles.statusTag, { backgroundColor: colors.primaryContainer }]}>
                      <Text style={[typography.caption, { color: act.statusColor, fontWeight: '700', fontSize: 11 }]}>
                        {act.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={[typography.bodyBold, { color: colors.text, marginTop: 8 }]}>
                    {act.title}
                  </Text>

                  <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {act.partner} • {act.locality}
                  </Text>

                  <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                      {act.time}
                    </Text>
                    <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
                      ₹{act.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </Animated.View>
        )}

        {/* 5. SETTINGS VIEW */}
        {viewMode === 'settings' && (
          <Animated.View
            style={[
              styles.viewSection,
              {
                opacity: bodyOpacity,
                transform: [{ translateY: bodyTranslateY }],
              },
            ]}
          >
            <View style={[styles.cleanSettingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Dark Theme */}
              <View style={styles.settingItem}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[typography.bodyBold, { color: colors.text }]}>Dark Theme</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    Comfortable display for night time
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.googleBlue }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Urgent Broadcast Alerts */}
              <View style={[styles.settingItem, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[typography.bodyBold, { color: colors.text }]}>Urgent Hyperlocal Alerts</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    Notify when neighbours need urgent help (2 km)
                  </Text>
                </View>
                <Switch
                  value={urgentAlerts}
                  onValueChange={setUrgentAlerts}
                  trackColor={{ false: colors.border, true: colors.googleBlue }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* DPDP Location Masking */}
              <View style={[styles.settingItem, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[typography.bodyBold, { color: colors.text }]}>1 km Location Masking</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    Obfuscate exact GPS coordinates (DPDP Act)
                  </Text>
                </View>
                <Switch
                  value={fuzzyLocation}
                  onValueChange={setFuzzyLocation}
                  trackColor={{ false: colors.border, true: colors.googleBlue }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Trusted Emergency Contacts */}
              <TouchableOpacity
                style={[styles.settingMenuItem, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Shield size={17} color={colors.textSecondary} />
                  <Text style={[typography.bodyBold, { color: colors.text, marginLeft: 12 }]}>
                    Trusted Safety Contacts
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </TouchableOpacity>

              {/* DPDP Data Rights */}
              <TouchableOpacity
                style={[styles.settingMenuItem, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={17} color={colors.textSecondary} />
                  <Text style={[typography.bodyBold, { color: colors.text, marginLeft: 12 }]}>
                    Privacy Policy & DPDP Data
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity
              style={[styles.cleanLogoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <LogOut size={16} color={colors.googleRed} />
              <Text style={[typography.bodyBold, { color: colors.googleRed, marginLeft: 8 }]}>
                Sign Out / Switch Account
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileHeaderSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  largeAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  largeAvatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  segmentedContainer: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1,
    padding: SEGMENT_PADDING,
    marginTop: 16,
    marginBottom: 8,
  },
  slidingPill: {
    position: 'absolute',
    top: SEGMENT_PADDING,
    left: SEGMENT_PADDING,
    bottom: SEGMENT_PADDING,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 2,
  },
  viewSection: {
    marginTop: 10,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  cleanCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  cleanSettingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  cleanLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
});
