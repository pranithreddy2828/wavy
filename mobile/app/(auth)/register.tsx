import React, { useState } from 'react';
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
import { Badge } from '../../src/components/ui/Badge';
import { User, Mail, Lock, ArrowLeft, Shield, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!displayName || !username || !email || !password) {
      Alert.alert('Required Fields', 'Please fill out all registration fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Account Registered',
        'Verification link sent! Navigating to the community hub.',
        [{ text: 'Proceed', onPress: () => router.replace('/(tabs)' as any) }]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text }]}>Create Account</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, { color: colors.text, marginTop: spacing.xs }]}>
          Join WAVY Community
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
          Connect with nearby helpers and neighbours in Hyderabad. Phone number is not required.
        </Text>

        <Input
          label="Display Name"
          placeholder="e.g. Rahul Verma"
          value={displayName}
          onChangeText={setDisplayName}
          leftIcon={<User size={18} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.md }}
        />

        <Input
          label="Username (@handle)"
          placeholder="e.g. rahul_hyd"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          containerStyle={{ marginBottom: spacing.md }}
        />

        <Input
          label="Email Address"
          placeholder="e.g. rahul@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={18} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.md }}
        />

        <Input
          label="Password (Minimum 8 Characters)"
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={18} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.lg }}
        />

        <View style={[styles.cityBadge, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <MapPin size={16} color={colors.primary} />
          <Text style={[typography.bodyBold, { color: colors.text, marginLeft: 6 }]}>
            Initial Launch City: Hyderabad, India
          </Text>
        </View>

        <Button
          title="Create Free Account"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleRegister}
          style={{ marginTop: spacing.lg }}
        />

        {/* Existing account link */}
        <View style={styles.footerRow}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={[typography.bodyBold, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});

