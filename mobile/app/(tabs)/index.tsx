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
import { Badge } from '../../src/components/ui/Badge';
import {
  fetchCategories,
  fetchFeed,
  Category,
  CommunityRequest,
} from '../../src/services/requestsApi';
import {
  MapPin,
  Bell,
  SlidersHorizontal,
  Flame,
  PlusCircle,
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
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const loadData = async () => {
    try {
      const [cats, feedData] = await Promise.all([
        fetchCategories().catch(() => []),
        fetchFeed({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          urgency: selectedUrgency !== 'all' ? selectedUrgency : undefined,
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
  }, [selectedCategory, selectedUrgency]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <View>
          <View style={styles.brandRow}>
            <Text style={[typography.h3, { color: colors.primary, fontWeight: '900', letterSpacing: 1.5 }]}>
              WAVY
            </Text>
            <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
          </View>
          <TouchableOpacity style={styles.locationSelector} activeOpacity={0.7}>
            <MapPin size={13} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.text, fontWeight: '600', marginLeft: 3 }]}>
              Gachibowli, Hyderabad
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionIcons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.urgent }]} />
          </TouchableOpacity>
        </View>
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
        {/* Hyperlocal Opportunity Hero Banner */}
        <View
          style={[
            styles.heroBanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.xl,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Badge label="HYPERLOCAL ASSISTANCE" variant="primary" size="sm" />
            <Text style={[typography.h3, { color: colors.text, marginTop: spacing.xs }]}>
              Help Someone Nearby,{' '}
              <Text style={{ color: colors.primary }}>Earn Privately</Text>
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xxs }]}>
              Real needs in your neighbourhood. From printing to tutoring and repairs.
            </Text>
          </View>
        </View>

        {/* Category Horizontal Filter Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h4, { color: colors.text }]}>Categories</Text>
          <TouchableOpacity onPress={() => setSelectedCategory('all')}>
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.categoryPill,
              {
                backgroundColor:
                  selectedCategory === 'all' ? colors.primary : colors.surfaceRaised,
                borderColor:
                  selectedCategory === 'all' ? colors.primary : colors.border,
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
                  styles.categoryPill,
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

        {/* Urgency Filter Pills */}
        <View style={styles.urgencyRow}>
          <Text style={[typography.caption, { color: colors.textTertiary, marginRight: spacing.sm }]}>
            Priority:
          </Text>
          {(['all', 'urgent', 'medium', 'low'] as const).map((urg) => {
            const isSelected = selectedUrgency === urg;
            return (
              <TouchableOpacity
                key={urg}
                onPress={() => setSelectedUrgency(urg)}
                style={[
                  styles.urgencyPill,
                  {
                    backgroundColor: isSelected ? colors.surfaceSubtle : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.tiny,
                    {
                      color: isSelected ? colors.primary : colors.textTertiary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {urg.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Live Requests Feed */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Flame size={18} color={colors.urgent} style={{ marginRight: 6 }} />
            <Text style={[typography.h4, { color: colors.text }]}>
              Nearby Opportunities
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            {requests.length} Active in Hyderabad
          </Text>
        </View>

        {/* Loading Skeleton State */}
        {loading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={140} borderRadius={radius.lg} />
            <Skeleton height={140} borderRadius={radius.lg} />
            <Skeleton height={140} borderRadius={radius.lg} />
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
            title="No Requests in this Filter"
            description="Be the first to create a request or broaden your category and urgency filters."
            actionTitle="Create a Request"
            onAction={() => router.push('/create' as any)}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 6,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  heroBanner: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  urgencyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    marginRight: 6,
  },
});
