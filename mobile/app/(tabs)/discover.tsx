import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/ui/Input';
import { RequestCard } from '../../src/components/RequestCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { fetchFeed, CommunityRequest } from '../../src/services/requestsApi';
import {
  Search,
  MapPin,
  Navigation,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DiscoverScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const radiusOptions = [1, 5, 10, 20];

  useEffect(() => {
    setLoading(true);
    fetchFeed({ max_distance: selectedRadius })
      .then((res) => setRequests(res.requests || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [selectedRadius]);

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category_name.toLowerCase().includes(q) ||
      r.area_name.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header & Search */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
          Discover Nearby
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Explore community requests around Gachibowli, Hyderabad
        </Text>

        <Input
          placeholder="Search printing, laptop, tutoring, carpool..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={colors.textTertiary} />}
          containerStyle={{ marginTop: 12 }}
        />

        {/* Distance Selector */}
        <View style={styles.radiusBar}>
          <Text style={[typography.caption, { color: colors.textTertiary, marginRight: 8 }]}>
            Distance:
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {radiusOptions.map((km) => {
              const isSelected = selectedRadius === km;
              return (
                <TouchableOpacity
                  key={km}
                  onPress={() => setSelectedRadius(km)}
                  style={[
                    styles.radiusChip,
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
                    Within {km} km
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Results List */}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 90 }]}>
        <View style={styles.resultsInfo}>
          <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
            {filteredRequests.length} {filteredRequests.length === 1 ? 'REQUEST' : 'REQUESTS'} AVAILABLE
          </Text>
        </View>

        {loading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={130} borderRadius={radius.xl} />
            <Skeleton height={130} borderRadius={radius.xl} />
          </View>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onPress={() => router.push(`/requests/${req.id}` as any)}
            />
          ))
        ) : (
          <EmptyState
            icon={<Navigation size={36} color={colors.primary} />}
            title="No requests within this radius"
            description="Broaden your distance filter to 10 km or 20 km to see requests in surrounding areas."
            actionTitle="Expand to 20 km"
            onAction={() => setSelectedRadius(20)}
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  radiusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  radiusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
  resultsInfo: {
    marginBottom: 12,
  },
});
