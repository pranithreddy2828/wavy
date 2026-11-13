import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { RequestCard } from '../../src/components/RequestCard';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { EmptyState } from '../../src/components/ui/EmptyState';
import {
  fetchCategories,
  fetchFeed,
  Category,
  CommunityRequest,
} from '../../src/services/requestsApi';
import {
  MapPin,
  Bell,
  PlusCircle,
  Compass,
  Sparkles,
  HelpCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadData = async () => {
    try {
      const [cats, feedData] = await Promise.all([
        fetchCategories().catch(() => []),
        fetchFeed({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        }).catch(() => ({ requests: [] })),
      ]);
      setCategories(cats);
      setRequests(feedData.requests || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* 1. Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <View>
          <Text style={[typography.h3, { color: colors.primary, fontWeight: '900', letterSpacing: 1.5 }]}>
            WAVY
          </Text>
          <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
            <MapPin size={12} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 3 }]}>
              Gachibowli, Hyderabad
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.bellButton, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Bell size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* 2. Welcome Greeting */}
        <View style={styles.greetingBox}>
          <Text style={[typography.h2, { color: colors.text, fontWeight: '800' }]}>
            Community Help Hub
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 2 }]}>
            Connect with neighbours for printing, repairs, tutoring & everyday tasks.
          </Text>
        </View>

        {/* 3. Two Big, Dead-Simple Action Cards */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/(tabs)/create' as any)}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.primaryMuted,
                borderColor: colors.primary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <View style={[styles.actionIconBubble, { backgroundColor: colors.primary }]}>
              <PlusCircle size={24} color={colors.textInverse} />
            </View>
            <Text style={[typography.h4, { color: colors.text, marginTop: spacing.sm, fontWeight: '700' }]}>
              Ask for Help
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Post what you need in seconds
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/(tabs)/discover' as any)}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.secondaryMuted,
                borderColor: colors.secondary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <View style={[styles.actionIconBubble, { backgroundColor: colors.secondary }]}>
              <Compass size={24} color="#FFFFFF" />
            </View>
            <Text style={[typography.h4, { color: colors.text, marginTop: spacing.sm, fontWeight: '700' }]}>
              Browse & Earn
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Help neighbours nearby
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Category Filter Chips */}
        <View style={styles.categorySection}>
          <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }]}>
            FILTER BY CATEGORY
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === 'all' ? colors.primary : colors.surfaceRaised,
                  borderColor: selectedCategory === 'all' ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: selectedCategory === 'all' ? colors.textInverse : colors.text,
                    fontWeight: '700',
                  },
                ]}
              >
                All Needs
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.slug)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceRaised,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: radius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.caption,
                      {
                        color: isSelected ? colors.textInverse : colors.text,
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
        </View>

        {/* 5. Request Feed Header */}
        <View style={styles.feedHeader}>
          <Text style={[typography.h4, { color: colors.text, fontWeight: '700' }]}>
            Nearby Requests ({requests.length})
          </Text>
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            Hyderabad
          </Text>
        </View>

        {/* 6. Feed Cards */}
        {loading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={130} borderRadius={radius.xl} />
            <Skeleton height={130} borderRadius={radius.xl} />
          </View>
        ) : requests.length > 0 ? (
          requests.map((item) => (
            <RequestCard
              key={item.id}
              request={item}
              onPress={() => router.push(`/requests/${item.id}` as any)}
            />
          ))
        ) : (
          <EmptyState
            icon={<HelpCircle size={36} color={colors.primary} />}
            title="No requests found here"
            description="Try selecting 'All Needs' or post your own request for nearby neighbours to see."
            actionTitle="Post a Request"
            onAction={() => router.push('/(tabs)/create' as any)}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  greetingBox: {
    marginVertical: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 10,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
  },
  actionIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    marginTop: 14,
    marginBottom: 10,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
});
