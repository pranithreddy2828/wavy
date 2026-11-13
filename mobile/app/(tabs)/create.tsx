import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { fetchCategories, Category } from '../../src/services/requestsApi';
import {
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  Shield,
  CheckCircle2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CreateRequestScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'urgent'>('medium');
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery' | 'on_premise' | 'remote'>('on_premise');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [budget, setBudget] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a title for your request.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please explain what assistance or service you need.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setBudget('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={[styles.successBadge, { backgroundColor: colors.successMuted, borderColor: colors.success }]}>
            <CheckCircle2 size={54} color={colors.success} />
          </View>
          <Text style={[typography.h2, { color: colors.text, textAlign: 'center', marginTop: spacing.md }]}>
            Request Published!
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, maxWidth: 320 },
            ]}
          >
            Nearby community members and helpers in <Text style={{ color: colors.primary }}>Gachibowli (within {radiusKm} km)</Text> have been notified. You can review and negotiate offers as they arrive.
          </Text>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.caption, { color: colors.textTertiary }]}>REQUEST SUMMARY</Text>
            <Text style={[typography.h4, { color: colors.text, marginTop: 4 }]}>{title}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
              <Badge label={urgency.toUpperCase()} variant={urgency === 'urgent' ? 'urgent' : 'warning'} size="sm" />
              <Badge label={`Within ${radiusKm} km`} variant="secondary" size="sm" />
              {budget ? <Badge label={`₹${budget}`} variant="primary" size="sm" /> : null}
            </View>
          </View>

          <Button
            title="Create Another Request"
            variant="outline"
            onPress={handleReset}
            style={{ width: '100%', marginBottom: spacing.sm }}
          />
          <Button
            title="Go to Home Feed"
            variant="primary"
            onPress={() => {
              handleReset();
              router.push('/(tabs)' as any);
            }}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Sparkles size={22} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
            Create Request
          </Text>
        </View>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
          Ask for urgent assistance, repairs, printing, transport, and more
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.form, { paddingBottom: 100 }]}>
        {/* Step 1: Category Selection */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginBottom: 8 }]}>
          1. CHOOSE SERVICE CATEGORY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceRaised,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: isSelected ? colors.primary : colors.text,
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

        {/* Step 2: Request Title & Details */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginBottom: 8 }]}>
          2. REQUEST DETAILS
        </Text>
        <Input
          label="Title"
          placeholder="e.g. Need 20 Pages Color Printout by 4 PM"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginBottom: spacing.md }}
        />

        <Input
          label="Description"
          placeholder="Provide clear details on what you need, specifications, deadlines, and requirements..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
          containerStyle={{ marginBottom: spacing.md }}
        />

        {/* Step 3: Priority & Fulfillment Mode */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginBottom: 8 }]}>
          3. URGENCY & FULFILLMENT MODE
        </Text>
        <View style={styles.buttonGroup}>
          {(['low', 'medium', 'urgent'] as const).map((level) => {
            const isSelected = urgency === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setUrgency(level)}
                style={[
                  styles.groupButton,
                  {
                    backgroundColor: isSelected ? (level === 'urgent' ? colors.urgentMuted : colors.primaryMuted) : colors.surfaceRaised,
                    borderColor: isSelected ? (level === 'urgent' ? colors.urgent : colors.primary) : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: isSelected ? (level === 'urgent' ? colors.urgent : colors.primary) : colors.textSecondary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {level.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.buttonGroup, { marginTop: 8 }]}>
          {(['pickup', 'delivery', 'on_premise', 'remote'] as const).map((mode) => {
            const isSelected = fulfillment === mode;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => setFulfillment(mode)}
                style={[
                  styles.groupButton,
                  {
                    backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceRaised,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.tiny,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {mode.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 4: Location Radius & Privacy */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginTop: spacing.md, marginBottom: 8 }]}>
          4. DISCOVERY RADIUS (HYDERABAD)
        </Text>
        <View style={styles.radiusSelector}>
          {[1, 3, 5, 10, 20].map((km) => {
            const isSelected = radiusKm === km;
            return (
              <TouchableOpacity
                key={km}
                onPress={() => setRadiusKm(km)}
                style={[
                  styles.radiusPill,
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
        </View>
        <Text style={[typography.tiny, { color: colors.textTertiary, marginTop: 4 }]}>
          🔒 Your exact GPS coordinates will never be shown. A 500m fuzzy centroid is applied.
        </Text>

        {/* Step 5: Budget & Negotiation */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginTop: spacing.md, marginBottom: 8 }]}>
          5. BUDGET & PRICING
        </Text>
        <Input
          label="Estimated Budget (₹ INR)"
          placeholder="e.g. 250 (Leave blank if open to bids)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          leftIcon={<IndianRupee size={16} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.sm }}
        />

        <TouchableOpacity
          onPress={() => setIsNegotiable(!isNegotiable)}
          style={[styles.negotiableToggle, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
        >
          <View>
            <Text style={[typography.bodyBold, { color: colors.text }]}>Allow Price Negotiation</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Helpers can propose alternate prices and completion times
            </Text>
          </View>
          <View
            style={[
              styles.switchTrack,
              { backgroundColor: isNegotiable ? colors.primary : colors.surfaceSubtle },
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                { transform: [{ translateX: isNegotiable ? 16 : 0 }] },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button
          title="Publish Request to Nearby Community"
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: spacing.xl }}
        />
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
  form: {
    padding: 16,
  },
  categoryCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  negotiableToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  switchTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 20,
  },
});
