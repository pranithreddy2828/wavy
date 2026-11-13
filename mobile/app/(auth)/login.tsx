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
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    clearError();
    const success = await login({ email, password });
    if (success) {
      router.replace('/(tabs)/index' as any);
    } else {
      Alert.alert('Login Failed', error || 'Invalid email or password.');
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
        <Text style={[typography.h4, { color: colors.text }]}>Sign In</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, { color: colors.text, marginTop: spacing.md }]}>
          Welcome Back to WAVY
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl }]}>
          Enter your registered email address to access your requests and community offers.
        </Text>

        {/* Google One-Tap Sign In */}
        <Button
          title="Continue with Google"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => {
            Alert.alert(
              'Google Sign-In',
              'To configure Google Sign-In on mobile, add your Google Web Client ID in the Google Cloud Console.'
            );
          }}
          style={{ marginBottom: spacing.lg }}
        />

        <View style={styles.dividerRow}>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <Text style={[typography.caption, { color: colors.textTertiary, marginHorizontal: 12 }]}>
            OR WITH EMAIL
          </Text>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        </View>

        {/* Email & Password Form */}
        <Input
          label="Email Address"
          placeholder="e.g. rahul@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={18} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.md, marginTop: spacing.md }}
        />

        <Input
          label="Password"
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={18} color={colors.textTertiary} />}
          containerStyle={{ marginBottom: spacing.sm }}
        />

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}>
          <Text style={[typography.caption, { color: colors.googleBlue, fontWeight: '600' }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Button
          title="Sign In to WAVY"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          onPress={handleLogin}
        />

        {/* Registration Link */}
        <View style={styles.footerRow}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={[typography.bodyBold, { color: colors.googleBlue }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View style={[styles.privacyBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderSubtle }]}>
          <Shield size={14} color={colors.googleBlue} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6, flex: 1 }]}>
            Phone numbers are NOT mandatory. Your private data is strictly protected under Indian DPDP Act standards.
          </Text>
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
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
  },
});
