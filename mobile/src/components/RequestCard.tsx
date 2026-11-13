import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { CommunityRequest } from '../services/requestsApi';
import {
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight,
} from 'lucide-react-native';

export interface RequestCardProps {
  request: CommunityRequest;
  onPress?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
  const { colors, spacing, typography, radius } = useTheme();

  const getUrgencyBadge = () => {
    switch (request.urgency) {
      case 'urgent':
        return <Badge label="URGENT" variant="urgent" size="sm" />;
      case 'medium':
        return <Badge label="Medium" variant="warning" size="sm" />;
      case 'low':
      default:
        return <Badge label="Flexible" variant="neutral" size="sm" />;
    }
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Header: Category Badge + Urgency Tag */}
      <View style={styles.headerRow}>
        <View style={styles.categoryContainer}>
          <Badge
            label={request.category_name}
            variant="secondary"
            size="sm"
          />
          <View style={styles.dot} />
          <View style={styles.locationWrapper}>
            <MapPin size={12} color={colors.textTertiary} />
            <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 2 }]}>
              {request.distance_km} km away
            </Text>
          </View>
        </View>
        {getUrgencyBadge()}
      </View>

      {/* Title & Description */}
      <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs }]} numberOfLines={2}>
        {request.title}
      </Text>
      <Text
        style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xxs }]}
        numberOfLines={2}
      >
        {request.description}
      </Text>

      {/* Locality & Fulfillment */}
      <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
        <Text style={[typography.caption, { color: colors.primary, fontWeight: '600' }]}>
          📍 {request.area_name}
        </Text>
        <Text style={[typography.caption, { color: colors.textTertiary }]}>
          • Mode: {request.fulfillment_type.replace('_', ' ').toUpperCase()}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

      {/* Footer: Requester Info + Budget / Action */}
      <View style={styles.footerRow}>
        <View style={styles.requesterInfo}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>
            {request.requester.display_name}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 2 }]}>
              {request.requester.rating_avg.toFixed(1)} ({request.requester.reviews_count})
            </Text>
            {request.requester.is_verified && (
              <ShieldCheck size={14} color={colors.primary} style={{ marginLeft: 4 }} />
            )}
          </View>
        </View>

        <View style={styles.budgetContainer}>
          <Text style={[typography.tiny, { color: colors.textTertiary }]}>
            {request.is_negotiable ? 'BUDGET (NEG)' : 'FIXED BUDGET'}
          </Text>
          <Text style={[typography.h4, { color: colors.primary, fontWeight: '800' }]}>
            ₹{request.budget ? request.budget.toFixed(0) : 'Open'}
          </Text>
        </View>
      </View>

      {/* Active Offers Indicator */}
      {request.offers_count > 0 && (
        <View style={[styles.offersRow, { backgroundColor: colors.surfaceSubtle, borderRadius: radius.sm }]}>
          <MessageSquare size={12} color={colors.primary} />
          <Text style={[typography.caption, { color: colors.primary, marginLeft: 4, fontWeight: '600' }]}>
            {request.offers_count} {request.offers_count === 1 ? 'offer submitted' : 'offers submitted'}
          </Text>
          <ChevronRight size={14} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#64748B',
    marginHorizontal: 6,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requesterInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  budgetContainer: {
    alignItems: 'flex-end',
  },
  offersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },
});
