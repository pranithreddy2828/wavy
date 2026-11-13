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
import { Search, Navigation } from 'lucide-react-native';
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
      {/* Google-Style Top Search */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <Input
          placeholder="Search requests (printing, laptop, ride...)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={colors.textTertiary} />}
        />

        {/* Distance Range Chips */}
        <View style={styles.radiusRow}>
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
                    styles.radiusPill,
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
                    {km} km
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Results Feed */}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 90 }]}>
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10 }]}>
          {filteredRequests.length} {filteredRequests.length === 1 ? 'REQUEST' : 'REQUESTS'} FOUND
        </Text>

        {loading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={140} borderRadius={20} />
            <Skeleton height={140} borderRadius={20} />
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
            title="No requests in this radius"
            description="Try expanding to 10 km or 20 km to find requests in neighbouring areas."
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radiusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
});
