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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { fetchCategories, Category } from '../../src/services/requestsApi';
import {
  CheckCircle2,
  IndianRupee,
  MapPin,
  Sparkles,
  ArrowLeft,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CreateRequestScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('200');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const budgetOptions = ['100', '200', '500', '1000'];

  // Handle hardware & gesture back button on Android
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
      Alert.alert('What do you need?', 'Please enter a short title for your request.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setBudget('200');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.successWrapper}>
          <View style={[styles.successCircle, { backgroundColor: colors.primaryContainer }]}>
            <CheckCircle2 size={44} color={colors.primary} />
          </View>
          <Text style={[typography.h2, { color: colors.text, textAlign: 'center', marginTop: spacing.md }]}>
            Request Published
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: 6, maxWidth: 300 },
            ]}
          >
            People nearby in Gachibowli will see your request and send offers.
          </Text>

          <Button
            title="Back to Home Feed"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => {
              handleReset();
              router.push('/' as any);
            }}
            style={{ marginTop: 24, marginBottom: 12 }}
          />
          <Button
            title="Ask for something else"
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
      {/* Google-Style Header with Back Button */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <ArrowLeft size={18} color={colors.text} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
              Ask for Help
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Post a request to neighbours in Hyderabad
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.form, { paddingBottom: 100 }]}>
        {/* Category Pills */}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }]}>
          CATEGORY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
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
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title Input */}
        <Input
          label="What do you need?"
          placeholder="e.g. 20 Pages Color Printout by 4 PM"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginTop: 14, marginBottom: 12 }}
        />

        {/* Short Note */}
        <Input
          label="Details or specifications (Optional)"
          placeholder="e.g. Double sided Xerox on 100gsm paper, will collect."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ minHeight: 70 }}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* Budget Presets */}
        <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }]}>
          YOUR BUDGET (₹ INR)
        </Text>
        <View style={styles.budgetRow}>
          {budgetOptions.map((amt) => {
            const isSelected = budget === amt;
            return (
              <TouchableOpacity
                key={amt}
                onPress={() => setBudget(amt)}
                style={[
                  styles.budgetChip,
                  {
                    backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    { color: isSelected ? colors.primary : colors.text },
                  ]}
                >
                  ₹{amt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          placeholder="Or custom amount"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          leftIcon={<IndianRupee size={16} color={colors.textTertiary} />}
          containerStyle={{ marginTop: 8, marginBottom: 14 }}
        />

        {/* Location pill */}
        <View style={[styles.locationBox, { backgroundColor: colors.surfaceVariant }]}>
          <MapPin size={14} color={colors.primary} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
            Location: <Text style={{ color: colors.text, fontWeight: '600' }}>Gachibowli, Hyderabad (5 km)</Text>
          </Text>
        </View>

        {/* Submit */}
        <Button
          title="Post Request"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
          style={{ marginTop: 24 }}
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
