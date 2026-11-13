import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { checkApiHealth, API_BASE_URL, HealthCheckResponse } from '../src/services/api';
import { Button } from '../src/components/ui/Button';
import { Badge } from '../src/components/ui/Badge';
import { ArrowRight, Compass, ShieldCheck, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pingDuration, setPingDuration] = useState<number | null>(null);

  const testBackendConnection = async () => {
    setLoading(true);
    setErrorMsg(null);
    const start = Date.now();
    try {
      const data = await checkApiHealth();
      setPingDuration(Date.now() - start);
      setHealthData(data);
    } catch (err: any) {
      setPingDuration(Date.now() - start);
      setErrorMsg(
        err.message || 'Unable to connect to Flask API backend. Please check network/LAN IP.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={[styles.badge, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>MILESTONE 2 — UI/UX SYSTEM</Text>
          </View>
          <Text style={[typography.h1, { color: colors.text, letterSpacing: 2, fontSize: 38 }]}>
            WAVY
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4, maxWidth: 300 }]}>
            Hyperlocal Community Assistance & Opportunity Platform
          </Text>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '700', marginTop: 6 }]}>
            📍 Initial Market: Hyderabad, India
          </Text>
        </View>

        {/* Primary Launch Action */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <Badge label="2026 FLAGSHIP INTERFACE" variant="primary" size="sm" />
          <Text style={[typography.h3, { color: colors.text, marginTop: spacing.xs }]}>
            Launch WAVY Application
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.md }]}>
            Explore the 5-section tab navigation, categorized request feed, discovery radar, request creation wizard, and reputation profile.
          </Text>

          <Button
            title="Open WAVY Tabs App"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(tabs)' as any)}
            icon={<ArrowRight size={18} color={colors.textInverse} />}
            iconPosition="right"
          />

          <Button
            title="View Welcome & Onboarding"
            variant="secondary"
            size="md"
            fullWidth
            onPress={() => router.push('/(auth)/welcome' as any)}
            style={{ marginTop: spacing.sm }}
          />
        </View>

        {/* Live Diagnostics Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.h4, { color: colors.text }]}>API Diagnostics & Health</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
            Target: <Text style={{ color: colors.primary }}>{API_BASE_URL}</Text>
          </Text>

          <Button
            title="Ping Backend API (/health)"
            variant="outline"
            size="md"
            loading={loading}
            onPress={testBackendConnection}
          />

          {pingDuration !== null && (
            <Text style={[typography.tiny, { color: colors.textTertiary, textAlign: 'center', marginTop: 6 }]}>
              Roundtrip: {pingDuration} ms
            </Text>
          )}

          {healthData && (
            <View style={[styles.statusBox, { backgroundColor: colors.successMuted, borderColor: colors.success }]}>
              <Text style={[typography.caption, { color: colors.success, fontWeight: '700' }]}>
                ✓ Connected to {healthData.service} (v{healthData.version})
              </Text>
              <Text style={[typography.tiny, { color: colors.text, marginTop: 2 }]}>
                Database: {healthData.database.status} • City Target: {healthData.city}
              </Text>
            </View>
          )}

          {errorMsg && (
            <View style={[styles.statusBox, { backgroundColor: colors.dangerMuted, borderColor: colors.danger }]}>
              <Text style={[typography.caption, { color: colors.danger, fontWeight: '700' }]}>
                Diagnostic Notice
              </Text>
              <Text style={[typography.tiny, { color: colors.text, marginTop: 2 }]}>
                {errorMsg}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 16,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  statusBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
});
