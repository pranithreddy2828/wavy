import React from 'react';
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
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { useAuthStore } from '../../src/store/authStore';
import {
  User,
  Star,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sun,
  Shield,
  FileText,
  Lock,
  ChevronRight,
  LogOut,
  MapPin,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors, spacing, typography, radius, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { user, isAuthenticated, logout, deleteAccount } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome' as any);
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account (DPDP Right to Erasure)',
      'This will permanently delete your profile, requests, offers, and chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteAccount();
            if (success) {
              Alert.alert('Account Deleted', 'All your data has been erased.');
              router.replace('/(auth)/welcome' as any);
            }
          },
        },
      ]
    );
  };

  const displayName = user?.profile?.display_name || 'Guest User';
  const username = user?.profile?.username ? `@${user.profile.username}` : '@neighbour';
  const locality = user?.profile?.general_locality || 'Gachibowli, Hyderabad';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[typography.h3, { color: colors.text, fontWeight: '800' }]}>
          Profile & Reputation
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={18} color={colors.googleYellow} />
          ) : (
            <Moon size={18} color={colors.googleBlue} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 }]}>
        {/* User Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
              <Text style={{ color: colors.googleBlue, fontWeight: '800', fontSize: 24 }}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[typography.h3, { color: colors.text }]}>{displayName}</Text>
                <ShieldCheck size={18} color={colors.googleBlue} style={{ marginLeft: 6 }} />
              </View>
              <Text style={[typography.body, { color: colors.textSecondary }]}>{username}</Text>
              <View style={styles.localityRow}>
                <MapPin size={12} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 2 }]}>
                  {locality}
                </Text>
              </View>
            </View>
          </View>

          {/* Verification Badges */}
          <View style={[styles.badgesRow, { marginTop: spacing.md }]}>
            <Badge
              label="EMAIL VERIFIED"
              variant="success"
              size="sm"
              icon={<CheckCircle2 size={12} color={colors.success} />}
            />
            <Badge label="COMMUNITY HELPER" variant="primary" size="sm" />
            <Badge label="ID OPTIONAL" variant="neutral" size="sm" />
          </View>
        </Card>

        {/* Reputation & Engagement Metrics */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={16} color={colors.googleYellow} fill={colors.googleYellow} />
              <Text style={[typography.h3, { color: colors.text, marginLeft: 4 }]}>5.0</Text>
            </View>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              Reputation
            </Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.h3, { color: colors.googleBlue }]}>
              {user?.profile?.completed_activities_count || 0}
            </Text>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              Activities
            </Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.h3, { color: colors.success }]}>100%</Text>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              Completion
            </Text>
          </View>
        </View>

        {/* Privacy & DPDP Notice */}
        <Card style={{ marginTop: spacing.md, padding: 0 }}>
          <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', padding: 16, paddingBottom: 8 }]}>
            PRIVACY & DPDP SETTINGS
          </Text>

          {[
            { label: 'Privacy & Approximate Location (500m)', icon: <Lock size={18} color={colors.textSecondary} /> },
            { label: 'Trusted Safety Contacts', icon: <Shield size={18} color={colors.textSecondary} /> },
            { label: 'Terms of Service & DPDP Notice', icon: <FileText size={18} color={colors.textSecondary} /> },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                { borderTopColor: colors.borderSubtle, borderTopWidth: 1 },
              ]}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.icon}
                <Text style={[typography.body, { color: colors.text, marginLeft: 12 }]}>
                  {item.label}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Account Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signoutRow} activeOpacity={0.7}>
            <LogOut size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[typography.bodyBold, { color: colors.textSecondary }]}>
              {isAuthenticated ? 'Sign Out of WAVY' : 'Switch or Sign In'}
            </Text>
          </TouchableOpacity>

          {isAuthenticated && (
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteRow} activeOpacity={0.7}>
              <Trash2 size={15} color={colors.error} style={{ marginRight: 6 }} />
              <Text style={[typography.caption, { color: colors.error, fontWeight: '700' }]}>
                Delete My Account & Personal Data (DPDP)
              </Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    padding: 18,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metricBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  actionSection: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  signoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
