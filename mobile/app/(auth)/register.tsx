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
import { useAuthStore } from '../../src/store/authStore';
import { User, Mail, Lock, ArrowLeft, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!displayName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill out all registration fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    clearError();
    const success = await register({
      email,
      password,
      display_name: displayName,
      username,
      city: 'Hyderabad',
    });

    if (success) {
      Alert.alert(
        'Welcome to WAVY!',
        'Your account has been created. Connect with your neighbours in Hyderabad.',
        [{ text: 'Explore Community', onPress: () => router.replace('/(tabs)/index' as any) }]
      );
    } else {
      Alert.alert('Registration Failed', error || 'Could not complete registration.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
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

        <View style={[styles.cityBadge, { backgroundColor: colors.surfaceVariant }]}>
          <MapPin size={16} color={colors.googleBlue} />
          <Text style={[typography.bodyBold, { color: colors.text, marginLeft: 6 }]}>
            Launch City: Hyderabad, India
          </Text>
        </View>

        <Button
          title="Create Free Account"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          onPress={handleRegister}
          style={{ marginTop: spacing.lg }}
        />

        {/* Existing account link */}
        <View style={styles.footerRow}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
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
    borderRadius: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
