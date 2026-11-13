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
import { colors } from '../src/theme/colors';
import { checkApiHealth, API_BASE_URL, HealthCheckResponse } from '../src/services/api';

export default function IndexScreen() {
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MILESTONE 1 VERIFIED</Text>
          </View>
          <Text style={styles.title}>WAVY</Text>
          <Text style={styles.subtitle}>
            Hyperlocal Community Assistance & Opportunity Platform
          </Text>
          <Text style={styles.market}>📍 Hyderabad, India</Text>
        </View>

        {/* System & Architecture Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Architecture Status</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Frontend:</Text>
            <Text style={styles.value}>React Native + Expo SDK 52 (TS)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Backend Core:</Text>
            <Text style={styles.value}>Python Flask REST + Socket.IO</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Database:</Text>
            <Text style={styles.value}>MySQL 8+ (23 Tables Normalized)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Target Endpoint:</Text>
            <Text style={[styles.value, styles.codeText]}>{API_BASE_URL}</Text>
          </View>
        </View>

        {/* API Diagnostic Connectivity Test */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend Ping & Health Diagnostic</Text>
          <Text style={styles.cardDescription}>
            Test live end-to-end HTTP connectivity between the mobile client and Flask backend.
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testBackendConnection}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.buttonText}>Ping Backend API (/health)</Text>
            )}
          </TouchableOpacity>

          {pingDuration !== null && (
            <Text style={styles.pingText}>Roundtrip Latency: {pingDuration} ms</Text>
          )}

          {healthData && (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>✓ Connected to WAVY Backend</Text>
              <Text style={styles.resultText}>• Service: {healthData.service}</Text>
              <Text style={styles.resultText}>• Version: {healthData.version}</Text>
              <Text style={styles.resultText}>• City Target: {healthData.city}</Text>
              <Text style={styles.resultText}>
                • Database Ping: {healthData.database.status}
              </Text>
              {healthData.database.error && (
                <Text style={styles.warningText}>
                  Note: {healthData.database.error}
                </Text>
              )}
            </View>
          )}

          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Connection Failed</Text>
              <Text style={styles.errorText}>{errorMsg}</Text>
              <Text style={styles.tipText}>
                Tip: If testing on a physical phone, ensure your mobile device and PC are on the same Wi-Fi and use your PC's LAN IP in mobile/.env.
              </Text>
            </View>
          )}
        </View>

        {/* Foundation Milestones Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestone 1 Checklist</Text>
          <Text style={styles.checkItem}>✓ Modular Multi-Tier Architecture</Text>
          <Text style={styles.checkItem}>✓ Relational Schema with 23 Tables & Category Seeds</Text>
          <Text style={styles.checkItem}>✓ Python Flask Application Factory & Blueprints</Text>
          <Text style={styles.checkItem}>✓ React Native Expo Shell & Navigation Foundation</Text>
          <Text style={styles.checkItem}>✓ Pytest Unit & Integration Health Suite</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    gap: 16,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  badge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  market: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  label: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  codeText: {
    color: colors.primary,
    fontSize: 11,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  pingText: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  successBox: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    gap: 4,
  },
  successTitle: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  resultText: {
    color: colors.text,
    fontSize: 12,
  },
  warningText: {
    color: colors.warning,
    fontSize: 11,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: colors.dangerMuted,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    gap: 4,
  },
  errorTitle: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: colors.text,
    fontSize: 12,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  checkItem: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingVertical: 3,
  },
});

