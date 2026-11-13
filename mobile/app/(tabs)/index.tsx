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
  Search,
  Plus,
  HelpCircle,
  MapPin,
  SlidersHorizontal,
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
      {/* 1. Google Signature Search Bar */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/discover' as any)}
          style={[
            styles.googleSearchPill,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Iconic Google 4-Color Quartet Indicator */}
          <View style={styles.googleDots}>
            <View style={[styles.gDot, { backgroundColor: colors.googleBlue }]} />
            <View style={[styles.gDot, { backgroundColor: colors.googleRed }]} />
            <View style={[styles.gDot, { backgroundColor: colors.googleYellow }]} />
            <View style={[styles.gDot, { backgroundColor: colors.googleGreen }]} />
          </View>

          <Text style={[typography.body, { color: colors.textSecondary, marginLeft: 10, flex: 1 }]}>
            Search requests in Hyderabad...
          </Text>

          {/* Profile Circle Avatar */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile' as any)}
            style={[styles.profileAvatar, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>R</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 2. Google Material Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedCategory === 'all' ? colors.primaryContainer : colors.surface,
                borderColor: selectedCategory === 'all' ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: selectedCategory === 'all' ? colors.primary : colors.textSecondary,
                  fontWeight: selectedCategory === 'all' ? '700' : '500',
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.slug)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
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

      {/* 3. Clean Google-Style Feed */}
      <ScrollView
        contentContainerStyle={[styles.feedContent, { paddingBottom: 110 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.feedHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={13} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 4, fontWeight: '600' }]}>
              Gachibowli, Hyderabad
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            {requests.length} active needs
          </Text>
        </View>

        {loading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={140} borderRadius={16} />
            <Skeleton height={140} borderRadius={16} />
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
            title="No requests nearby"
            description="Tap the '+ Ask Help' button to post what you need in seconds."
            actionTitle="Ask for Help"
            onAction={() => router.push('/(tabs)/create' as any)}
          />
        )}
      </ScrollView>

      {/* 4. Google Material 3 Floating Action Button (FAB) in Google Blue */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push('/(tabs)/create' as any)}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={2.8} />
        <Text style={[typography.bodyBold, { color: '#FFFFFF', marginLeft: 6 }]}>
          Ask Help
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  googleSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleDots: {
    flexDirection: 'row',
    gap: 3,
  },
  gDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
