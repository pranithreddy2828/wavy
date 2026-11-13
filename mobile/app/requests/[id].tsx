import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Star,
  MessageSquare,
  CheckCircle,
  Share2,
} from 'lucide-react-native';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, spacing, typography, radius } = useTheme();

  const [offerPrice, setOfferPrice] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  // Mock request detail
  const request = {
    id: id || 'req-001',
    title: 'Need 25 Pages Color Printing Urgently',
    description:
      'Final semester thesis printout needed near DLF Cybercity by 5 PM today. Double-sided 100gsm paper preferred. Will collect directly from your location.',
    category_name: 'Printing',
    urgency: 'urgent',
    budget: 200,
    is_negotiable: true,
    fulfillment_type: 'PICKUP',
    area_name: 'Gachibowli, Hyderabad',
    distance_km: 1.2,
    created_at: '25 minutes ago',
    requester: {
      display_name: 'Rahul Verma',
      username: 'rahul_hyd',
      rating_avg: 4.9,
      reviews_count: 14,
      is_verified: true,
      completed_activities: 8,
    },
    offers: [
      { id: '1', helper_name: 'Kiran Printer Hub', price: 180, time: '10 mins ago', rating: 4.9 },
      { id: '2', helper_name: 'TechPrint DLF', price: 200, time: '18 mins ago', rating: 4.7 },
    ],
  };

  const handleMakeOffer = () => {
    if (!offerPrice.trim()) {
      Alert.alert('Proposed Price Required', 'Please enter your offer price in INR.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOfferSubmitted(true);
      Alert.alert('Offer Submitted!', 'The requester has been notified and can accept or negotiate.');
    }, 700);
  };

  // Hardware & gesture back button support
  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          style={[styles.iconBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text }]}>Request Details</Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
        >
          <Share2 size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 }]}>
        {/* Category & Status */}
        <View style={styles.badgeRow}>
          <Badge label={request.category_name} variant="secondary" size="md" />
          <Badge
            label={request.urgency.toUpperCase()}
            variant={request.urgency === 'urgent' ? 'urgent' : 'warning'}
            size="md"
          />
        </View>

        {/* Title & Timing */}
        <Text style={[typography.h2, { color: colors.text, marginTop: spacing.sm }]}>
          {request.title}
        </Text>
        <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 4 }]}>
          Posted {request.created_at} • {request.area_name}
        </Text>

        {/* Budget Card */}
        <Card style={[styles.budgetCard, { backgroundColor: colors.surfaceRaised }]}>
          <View>
            <Text style={[typography.caption, { color: colors.textTertiary }]}>REQUESTER'S BUDGET</Text>
            <Text style={[typography.h2, { color: colors.primary, fontWeight: '900' }]}>
              ₹{request.budget}
            </Text>
          </View>
          <Badge
            label={request.is_negotiable ? 'PRICE NEGOTIABLE' : 'FIXED PRICE'}
            variant={request.is_negotiable ? 'primary' : 'neutral'}
            size="sm"
          />
        </Card>

        {/* Description */}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginTop: spacing.md }]}>
          REQUIREMENT SPECIFICATION
        </Text>
        <Text style={[typography.bodyLarge, { color: colors.text, marginTop: spacing.xs, lineHeight: 24 }]}>
          {request.description}
        </Text>

        {/* Privacy Location Details */}
        <Card style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[typography.bodyBold, { color: colors.text }]}>
                {request.area_name} (~{request.distance_km} km away)
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Fulfillment Mode: {request.fulfillment_type}
              </Text>
            </View>
          </View>
          <Text style={[typography.tiny, { color: colors.textTertiary, marginTop: 8 }]}>
            🔒 For security, exact address coordinates are provided only after an offer is accepted.
          </Text>
        </Card>

        {/* Requester Profile */}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginTop: spacing.lg }]}>
          POSTED BY
        </Text>
        <Card style={{ marginTop: spacing.xs }}>
          <View style={styles.requesterRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[typography.bodyBold, { color: colors.primary }]}>
                {request.requester.display_name.charAt(0)}
              </Text>
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[typography.bodyBold, { color: colors.text }]}>
                  {request.requester.display_name}
                </Text>
                {request.requester.is_verified && (
                  <ShieldCheck size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 3 }]}>
                  {request.requester.rating_avg} ({request.requester.reviews_count} reviews) • {request.requester.completed_activities} completed
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Existing Offers Received */}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginTop: spacing.lg }]}>
          OFFERS RECEIVED ({request.offers.length})
        </Text>
        <View style={{ gap: 8, marginTop: spacing.xs }}>
          {request.offers.map((off) => (
            <View
              key={off.id}
              style={[
                styles.offerItem,
                { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
              ]}
            >
              <View>
                <Text style={[typography.bodyBold, { color: colors.text }]}>{off.helper_name}</Text>
                <Text style={[typography.caption, { color: colors.textTertiary }]}>{off.time}</Text>
              </View>
              <Text style={[typography.h4, { color: colors.primary, fontWeight: '800' }]}>
                ₹{off.price}
              </Text>
            </View>
          ))}
        </View>

        {/* Submit Offer Form */}
        <Card style={{ marginTop: spacing.lg, borderColor: colors.primary }}>
          <Text style={[typography.h4, { color: colors.text }]}>Submit Your Offer</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm }]}>
            Nearby helpers can submit transparent bids and completion promises.
          </Text>

          <Input
            label="Your Proposed Price (₹)"
            placeholder="e.g. 190"
            value={offerPrice}
            onChangeText={setOfferPrice}
            keyboardType="numeric"
            leftIcon={<IndianRupee size={16} color={colors.textTertiary} />}
            containerStyle={{ marginBottom: spacing.sm }}
          />

          <Input
            label="Notes / Estimated Completion Time"
            placeholder="e.g. Can print on 100gsm Xerox laser right now, ready by 4:00 PM."
            value={offerNote}
            onChangeText={setOfferNote}
            multiline
            numberOfLines={2}
            style={{ minHeight: 60 }}
            containerStyle={{ marginBottom: spacing.md }}
          />

          <Button
            title={offerSubmitted ? 'Offer Sent ✓' : 'Submit Offer to Requester'}
            variant="primary"
            loading={isSubmitting}
            disabled={offerSubmitted}
            onPress={handleMakeOffer}
          />
        </Card>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
  },
  requesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
});

