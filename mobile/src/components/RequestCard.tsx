import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CommunityRequest } from '../services/requestsApi';
import { MapPin, Star, ArrowRight } from 'lucide-react-native';

export interface RequestCardProps {
  request: CommunityRequest;
  onPress?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 16,
        },
      ]}
    >
      {/* Top Meta: Category, Distance & Urgent tag */}
      <View style={styles.topRow}>
        <View style={[styles.categoryPill, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
            {request.category_name}
          </Text>
        </View>

        <View style={styles.distanceBadge}>
          <MapPin size={12} color={colors.textTertiary} />
          <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
            {request.distance_km} km away
          </Text>
        </View>

        {request.urgency === 'urgent' && (
          <View style={[styles.urgentChip, { backgroundColor: colors.dangerMuted }]}>
            <Text style={[typography.tiny, { color: colors.googleRed, fontWeight: '800' }]}>
              URGENT
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs, fontWeight: '700' }]} numberOfLines={2}>
        {request.title}
      </Text>

      {/* Description Snippet */}
      <Text
        style={[typography.body, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}
        numberOfLines={2}
      >
        {request.description}
      </Text>

      {/* Bottom Bar: Price, Requester rating & Google Action */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderSubtle }]}>
        <View>
          <Text style={[typography.tiny, { color: colors.textTertiary }]}>
            {request.is_negotiable ? 'BUDGET (NEGOTIABLE)' : 'FIXED BUDGET'}
          </Text>
          <Text style={[typography.h3, { color: colors.text, fontWeight: '800', marginTop: 1 }]}>
            ₹{request.budget ? request.budget.toFixed(0) : 'Open'}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          <View style={styles.ratingInfo}>
            <Star size={12} color={colors.googleYellow} fill={colors.googleYellow} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 3, fontWeight: '600' }]}>
              {request.requester.rating_avg.toFixed(1)}
            </Text>
          </View>

          <View style={[styles.helpButton, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '700', marginRight: 4 }]}>
              Offer Help
            </Text>
            <ArrowRight size={13} color={colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
});
