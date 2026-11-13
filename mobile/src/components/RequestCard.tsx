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
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 20,
        },
      ]}
    >
      {/* Top Meta: Category & Distance */}
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
          <View style={[styles.urgentDot, { backgroundColor: colors.error }]} />
        )}
      </View>

      {/* Title */}
      <Text style={[typography.h4, { color: colors.text, marginTop: spacing.sm, fontWeight: '700' }]} numberOfLines={2}>
        {request.title}
      </Text>

      {/* Description Snippet */}
      <Text
        style={[typography.body, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}
        numberOfLines={2}
      >
        {request.description}
      </Text>

      {/* Bottom Bar: Price & Action */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderSubtle }]}>
        <View>
          <Text style={[typography.tiny, { color: colors.textTertiary }]}>
            {request.is_negotiable ? 'BUDGET (NEGOTIABLE)' : 'FIXED BUDGET'}
          </Text>
          <Text style={[typography.h3, { color: colors.text, fontWeight: '800', marginTop: 1 }]}>
            ₹{request.budget ? request.budget.toFixed(0) : 'Open'}
          </Text>
        </View>

        <View style={[styles.helpButton, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '700', marginRight: 4 }]}>
            Offer Help
          </Text>
          <ArrowRight size={13} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
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
  urgentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 'auto',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
});
