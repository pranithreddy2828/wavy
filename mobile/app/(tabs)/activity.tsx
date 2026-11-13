import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  FileText,
  Tag,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type ActivityTab = 'my_requests' | 'my_offers' | 'ongoing' | 'completed';

export default function ActivityScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActivityTab>('ongoing');

  // Sample active engagements for 2026 UI preview
  const ongoingActivities = [
    {
      id: 'act-101',
      title: 'Urgent Printing of 25 Thesis Pages',
      category: 'Printing',
      role: 'Requester',
      partner: 'Kiran Printer Hub',
      agreedPrice: 200,
      status: 'In Progress',
      eta: 'Ready by 4:30 PM',
      locality: 'DLF Cybercity, Gachibowli',
    },
    {
      id: 'act-102',
      title: 'Python Asyncio Task Queue Debugging',
      category: 'Tutoring',
      role: 'Helper',
      partner: 'Ananya Reddy',
      agreedPrice: 800,
      status: 'Scheduled',
      eta: 'Google Meet @ 6:00 PM',
      locality: 'Remote Session',
    },
  ];

  const myRequests = [
    {
      id: 'req-201',
      title: 'Urgent Printing of 25 Thesis Pages',
      status: 'Receiving Offers',
      offersCount: 3,
      date: 'Today, 12:30 PM',
      budget: 200,
    },
    {
      id: 'req-202',
      title: 'Carpool coordination to Uppal Metro',
      status: 'Negotiating',
      offersCount: 2,
      date: 'Yesterday',
      budget: 250,
    },
  ];

  const myOffers = [
    {
      id: 'off-301',
      title: 'MacBook Air M2 Screen Diagnostics',
      proposedPrice: 500,
      status: 'Submitted',
      submittedAt: 'Today, 10:15 AM',
      note: 'Can inspect display ribbon cable with test meter',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
          Activity Dashboard
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Manage ongoing engagements, submitted offers & your requests
        </Text>

        {/* Tab Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {[
            { key: 'ongoing', label: 'Ongoing (2)' },
            { key: 'my_requests', label: 'My Requests (2)' },
            { key: 'my_offers', label: 'My Offers (1)' },
            { key: 'completed', label: 'Completed (8)' },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as ActivityTab)}
                style={[
                  styles.tabChip,
                  {
                    borderBottomColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        {activeTab === 'ongoing' && (
          <View style={{ gap: spacing.md }}>
            {ongoingActivities.map((act) => (
              <Card key={act.id} style={styles.activityCard}>
                <View style={styles.cardHeader}>
                  <Badge label={act.category} variant="secondary" size="sm" />
                  <Badge
                    label={act.status.toUpperCase()}
                    variant="warning"
                    size="sm"
                  />
                </View>

                <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs }]}>
                  {act.title}
                </Text>

                <View style={styles.detailRow}>
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>
                    Role: <Text style={{ color: colors.text }}>{act.role}</Text>
                  </Text>
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>
                    With: <Text style={{ color: colors.primary, fontWeight: '600' }}>{act.partner}</Text>
                  </Text>
                </View>

                <View style={[styles.highlightBox, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Clock size={14} color={colors.primary} />
                    <Text style={[typography.caption, { color: colors.text, marginLeft: 4, fontWeight: '600' }]}>
                      {act.eta}
                    </Text>
                  </View>
                  <Text style={[typography.h4, { color: colors.primary, fontWeight: '800' }]}>
                    ₹{act.agreedPrice}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <Button
                    title="Open Chat"
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                    icon={<MessageCircle size={14} color={colors.text} />}
                  />
                  <Button
                    title="Mark Completed"
                    variant="primary"
                    size="sm"
                    style={{ flex: 1, marginLeft: spacing.sm }}
                    icon={<CheckCircle size={14} color={colors.textInverse} />}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'my_requests' && (
          <View style={{ gap: spacing.md }}>
            {myRequests.map((req) => (
              <Card key={req.id}>
                <View style={styles.cardHeader}>
                  <Badge label={req.status} variant="primary" size="sm" />
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>{req.date}</Text>
                </View>
                <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs }]}>
                  {req.title}
                </Text>
                <View style={[styles.detailRow, { marginTop: spacing.sm }]}>
                  <Text style={[typography.caption, { color: colors.primary, fontWeight: '600' }]}>
                    💬 {req.offersCount} offers waiting for review
                  </Text>
                  <Text style={[typography.bodyBold, { color: colors.text }]}>₹{req.budget}</Text>
                </View>
                <Button
                  title="View & Compare Offers"
                  variant="outline"
                  size="sm"
                  style={{ marginTop: spacing.sm }}
                  icon={<ArrowRight size={14} color={colors.primary} />}
                  iconPosition="right"
                />
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'my_offers' && (
          <View style={{ gap: spacing.md }}>
            {myOffers.map((off) => (
              <Card key={off.id}>
                <View style={styles.cardHeader}>
                  <Badge label={off.status} variant="warning" size="sm" />
                  <Text style={[typography.h4, { color: colors.primary, fontWeight: '800' }]}>
                    Proposed: ₹{off.proposedPrice}
                  </Text>
                </View>
                <Text style={[typography.h4, { color: colors.text, marginTop: spacing.xs }]}>
                  {off.title}
                </Text>
                <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xxs }]}>
                  "{off.note}"
                </Text>
                <View style={[styles.detailRow, { marginTop: spacing.sm }]}>
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>{off.submittedAt}</Text>
                  <Button title="Edit Offer" variant="ghost" size="sm" />
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'completed' && (
          <EmptyState
            icon={<CheckCircle size={40} color={colors.success} />}
            title="8 Activities Completed"
            description="All mutual ratings and reviews have been submitted. Your community trust score is 4.95/5.0."
            actionTitle="View Reputation in Profile"
            onAction={() => router.push('/profile' as any)}
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
    padding: 16,
    borderBottomWidth: 1,
  },
  tabScroll: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  tabChip: {
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  content: {
    padding: 16,
  },
  activityCard: {
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  highlightBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
