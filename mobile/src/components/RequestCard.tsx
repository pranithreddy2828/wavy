import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CommunityRequest } from '../services/requestsApi';
import { MapPin, Star, ArrowRight, Zap } from 'lucide-react-native';

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
          borderRadius: radius.xl,
        },
      ]}
    >
      {/* Top Header: Category, Distance, and Urgency */}
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
            {request.category_name}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
          <MapPin size={13} color={colors.textSecondary} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 2 }]}>
            {request.distance_km} km
          </Text>
        </View>

        {request.urgency === 'urgent' && (
          <View style={[styles.urgentChip, { backgroundColor: colors.urgentMuted, borderColor: colors.urgent }]}>
            <Zap size={11} color={colors.urgent} />
            <Text style={[typography.tiny, { color: colors.urgent, fontWeight: '800', marginLeft: 2 }]}>
              URGENT
            </Text>
          </View>
        )}
      </View>

      {/* Main Request Title */}
      <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs, fontSize: 16 }]} numberOfLines={2}>
        {request.title}
      </Text>

      {/* Area & Details snippet */}
      <Text
        style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}
        numberOfLines={2}
      >
        {request.description}
      </Text>

      {/* Bottom Bar: Price, Requester info, and Action */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderSubtle }]}>
        <View>
          <Text style={[typography.tiny, { color: colors.textTertiary, textTransform: 'uppercase' }]}>
            {request.is_negotiable ? 'Budget (Negotiable)' : 'Fixed Budget'}
          </Text>
          <Text style={[typography.h3, { color: colors.primary, fontWeight: '900', marginTop: 1 }]}>
            ₹{request.budget ? request.budget.toFixed(0) : 'Open'}
          </Text>
        </View>

        <View style={styles.rightSide}>
          <View style={styles.requesterBrief}>
            <Text style={[typography.caption, { color: colors.text, fontWeight: '600' }]}>
              {request.requester.display_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={11} color="#F59E0B" fill="#F59E0B" />
              <Text style={[typography.tiny, { color: colors.textSecondary, marginLeft: 2 }]}>
                {request.requester.rating_avg.toFixed(1)}
              </Text>
            </View>
          </View>

          <View style={[styles.actionButton, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
              Help
            </Text>
            <ArrowRight size={13} color={colors.primary} style={{ marginLeft: 3 }} />
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
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 6,
  },
  urgentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requesterBrief: {
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
});
