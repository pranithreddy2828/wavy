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
import { Badge } from '../../src/components/ui/Badge';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { fetchFeed, CommunityRequest } from '../../src/services/requestsApi';
import {
  Search,
  MapPin,
  Compass,
  Sliders,
  Map as MapIcon,
  List,
  Navigation,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DiscoverScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const radiusOptions = [1, 3, 5, 10, 20];

  useEffect(() => {
    setLoading(true);
    fetchFeed({ max_distance: selectedRadius })
      .then((res) => setRequests(res.requests || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [selectedRadius]);

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category_name.toLowerCase().includes(query) ||
      r.area_name.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Search & Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
              Discover Nearby
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Finding requests within {selectedRadius} km of Gachibowli
            </Text>
          </View>

          {/* Toggle Map / List view */}
          <View
            style={[
              styles.viewToggle,
              { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[
                styles.toggleBtn,
                viewMode === 'list' && { backgroundColor: colors.primary },
              ]}
            >
              <List
                size={16}
                color={viewMode === 'list' ? colors.textInverse : colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('map')}
              style={[
                styles.toggleBtn,
                viewMode === 'map' && { backgroundColor: colors.primary },
              ]}
            >
              <MapIcon
                size={16}
                color={viewMode === 'map' ? colors.textInverse : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <Input
          placeholder="Search requests, skills, or localities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={colors.textTertiary} />}
          containerStyle={{ marginTop: spacing.md }}
        />

        {/* Radius Range Filter Chips */}
        <View style={styles.radiusContainer}>
          <Text style={[typography.caption, { color: colors.textTertiary, marginRight: 8 }]}>
            Radius:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
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
                    {km} km
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        // OpenStreetMap Interactive Graphic Representation
        <View style={styles.mapContainer}>
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
            <Compass size={48} color={colors.primary} />
            <Text style={[typography.h4, { color: colors.text, marginTop: spacing.sm }]}>
              OpenStreetMap Geodesic Radar
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, textAlign: 'center', maxWidth: 280, marginTop: 4 },
              ]}
            >
              Showing privacy-protected approximate centroids across Hyderabad ({filteredRequests.length} pins active within {selectedRadius} km).
            </Text>

            {/* Pins overview */}
            <View style={styles.pinsSummary}>
              {filteredRequests.map((req) => (
                <View
                  key={req.id}
                  style={[
                    styles.pinChip,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                  ]}
                >
                  <MapPin size={12} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.text, marginLeft: 4 }]}>
                    {req.category_name} ({req.distance_km}km)
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[styles.switchToListBtn, { backgroundColor: colors.primary, borderRadius: radius.md }]}
            >
              <Text style={[typography.bodyBold, { color: colors.textInverse }]}>
                Switch to List Results
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 90 }]}>
          <View style={styles.resultsBar}>
            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
              {filteredRequests.length} {filteredRequests.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
            </Text>
            <View style={styles.privacyShield}>
              <Text style={[typography.tiny, { color: colors.primary, fontWeight: '700' }]}>
                🔒 500M PRIVACY MASK ACTIVE
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={{ gap: spacing.md }}>
              <Skeleton height={140} borderRadius={radius.lg} />
              <Skeleton height={140} borderRadius={radius.lg} />
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
              title="No Requests in this Radius"
              description={`Try expanding your search radius to 10 km or 20 km to see requests in neighbouring areas.`}
              actionTitle="Expand to 20 km"
              onAction={() => setSelectedRadius(20)}
            />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  radiusChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyShield: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pinsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 16,
  },
  pinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  switchToListBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 20,
  },
});
