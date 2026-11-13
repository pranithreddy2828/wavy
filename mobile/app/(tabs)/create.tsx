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
  Zap,
  Clock,
  CheckCircle2,
  MapPin,
  IndianRupee,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CreateRequestScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'medium'>('urgent');
  const [budget, setBudget] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const budgetPresets = ['100', '250', '500', '1000'];

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
      Alert.alert('Please enter a title', 'Tell your neighbours what you need help with.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
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
        <View style={styles.successWrapper}>
          <View style={[styles.successCircle, { backgroundColor: colors.successMuted, borderColor: colors.success }]}>
            <CheckCircle2 size={48} color={colors.success} />
          </View>
          <Text style={[typography.h2, { color: colors.text, textAlign: 'center', marginTop: spacing.md }]}>
            Request Posted!
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: 6, maxWidth: 300 },
            ]}
          >
            People nearby in Gachibowli have been notified. You will receive offers right here.
          </Text>

          <Button
            title="View Active Feed"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => {
              handleReset();
              router.push('/(tabs)' as any);
            }}
            style={{ marginTop: 24, marginBottom: 12 }}
          />
          <Button
            title="Create Another Request"
            variant="secondary"
            size="md"
            fullWidth
            onPress={handleReset}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
          Ask for Help
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Share what you need with nearby neighbours
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.form, { paddingBottom: 110 }]}>
        {/* Step 1: Category Picker */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginBottom: 8 }]}>
          SELECT CATEGORY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
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
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Step 2: What do you need? */}
        <Input
          label="What do you need?"
          placeholder="e.g. 20 Pages Color Printout by 4 PM"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginBottom: spacing.md }}
        />

        <Input
          label="Details or Instructions (Optional)"
          placeholder="e.g. Need double sided 100gsm paper, will collect near DLF."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ minHeight: 70 }}
          containerStyle={{ marginBottom: spacing.md }}
        />

        {/* Step 3: Priority Toggle (2 big simple buttons) */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginBottom: 8 }]}>
          HOW URGENT IS THIS?
        </Text>
        <View style={styles.urgencyRow}>
          <TouchableOpacity
            onPress={() => setUrgency('urgent')}
            style={[
              styles.urgencyButton,
              {
                backgroundColor: urgency === 'urgent' ? colors.urgentMuted : colors.surfaceRaised,
                borderColor: urgency === 'urgent' ? colors.urgent : colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Zap size={18} color={urgency === 'urgent' ? colors.urgent : colors.textSecondary} />
            <Text
              style={[
                typography.bodyBold,
                { color: urgency === 'urgent' ? colors.urgent : colors.text, marginLeft: 6 },
              ]}
            >
              Urgent (Today)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setUrgency('medium')}
            style={[
              styles.urgencyButton,
              {
                backgroundColor: urgency === 'medium' ? colors.primaryMuted : colors.surfaceRaised,
                borderColor: urgency === 'medium' ? colors.primary : colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Clock size={18} color={urgency === 'medium' ? colors.primary : colors.textSecondary} />
            <Text
              style={[
                typography.bodyBold,
                { color: urgency === 'medium' ? colors.primary : colors.text, marginLeft: 6 },
              ]}
            >
              Flexible Time
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step 4: Budget Quick Presets */}
        <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700', marginTop: spacing.md, marginBottom: 8 }]}>
          OFFERED BUDGET (₹ INR)
        </Text>
        <View style={styles.presetRow}>
          {budgetPresets.map((amt) => {
            const isSelected = budget === amt;
            return (
              <TouchableOpacity
                key={amt}
                onPress={() => setBudget(amt)}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceRaised,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    { color: isSelected ? colors.textInverse : colors.text },
                  ]}
                >
                  ₹{amt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          placeholder="Or enter custom budget (e.g. 350)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          leftIcon={<IndianRupee size={16} color={colors.textTertiary} />}
          containerStyle={{ marginTop: 8, marginBottom: spacing.md }}
        />

        {/* Negotiable Toggle */}
        <TouchableOpacity
          onPress={() => setIsNegotiable(!isNegotiable)}
          style={[styles.negotiableBox, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[typography.bodyBold, { color: colors.text }]}>Open to price negotiation</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Allow helpers to propose alternate prices
            </Text>
          </View>
          <View
            style={[
              styles.checkCircle,
              {
                backgroundColor: isNegotiable ? colors.primary : 'transparent',
                borderColor: isNegotiable ? colors.primary : colors.border,
              },
            ]}
          >
            {isNegotiable && <Text style={{ color: '#000', fontSize: 12, fontWeight: '900' }}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Locality Note */}
        <View style={styles.localityNote}>
          <MapPin size={13} color={colors.primary} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
            Location: <Text style={{ color: colors.text, fontWeight: '600' }}>Gachibowli, Hyderabad (5 km radius)</Text>
          </Text>
        </View>

        {/* Big Submit Button */}
        <Button
          title="Post Request to Neighbours"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
          style={{ marginTop: spacing.lg }}
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
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  form: {
    padding: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  negotiableBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
