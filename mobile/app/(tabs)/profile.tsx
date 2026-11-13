import React from 'react';
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
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, spacing, typography, radius, isDark, toggleTheme } = useTheme();

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
            { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={18} color="#F59E0B" />
          ) : (
            <Moon size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        {/* User Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
              <User size={38} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[typography.h3, { color: colors.text }]}>Rahul Verma</Text>
                <ShieldCheck size={18} color={colors.primary} style={{ marginLeft: 6 }} />
              </View>
              <Text style={[typography.body, { color: colors.textSecondary }]}>@rahul_hyd</Text>
              <View style={styles.localityRow}>
                <MapPin size={12} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 2 }]}>
                  Gachibowli, Hyderabad
                </Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <Text style={[typography.body, { color: colors.text, marginTop: spacing.md }]}>
            Software engineer & tech enthusiast. Can help with Python tutoring, laptop diagnostics, and urgent Xerox/printing in Gachibowli area.
          </Text>

          {/* Verification Badges */}
          <View style={[styles.badgesRow, { marginTop: spacing.md }]}>
            <Badge label="EMAIL VERIFIED" variant="success" size="sm" icon={<CheckCircle2 size={12} color={colors.success} />} />
            <Badge label="COMMUNITY HELPER" variant="primary" size="sm" />
            <Badge label="ID OPTIONAL" variant="neutral" size="sm" />
          </View>
        </Card>

        {/* Reputation & Engagement Metrics */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={[typography.h3, { color: colors.text, marginLeft: 4 }]}>4.9</Text>
            </View>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              14 Reviews
            </Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.h3, { color: colors.primary }]}>8</Text>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              Activities Completed
            </Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.h3, { color: colors.success }]}>100%</Text>
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              Completion Rate
            </Text>
          </View>
        </View>

        {/* Skills & Services Offered */}
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.xs }]}>
            Skills & Services Offered
          </Text>
          <View style={styles.skillsWrapper}>
            {['Python Debugging', 'Laser Printing & Xerox', 'Laptop Upgrades', 'Carpool Gachibowli'].map((skill) => (
              <View
                key={skill}
                style={[
                  styles.skillChip,
                  { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
                ]}
              >
                <Text style={[typography.caption, { color: colors.text, fontWeight: '600' }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Safety, Privacy & Settings Menu */}
        <Card style={{ marginTop: spacing.md, padding: 0 }}>
          <Text style={[typography.caption, { color: colors.textTertiary, fontWeight: '700', padding: 16, paddingBottom: 8 }]}>
            PRIVACY & SAFETY SETTINGS (DPDP ACT)
          </Text>

          {[
            { label: 'Privacy & Obfuscation Preferences', icon: <Lock size={18} color={colors.textSecondary} /> },
            { label: 'Trusted Safety Contacts', icon: <Shield size={18} color={colors.textSecondary} /> },
            { label: 'Terms of Service & DPDP Notice', icon: <FileText size={18} color={colors.textSecondary} /> },
          ].map((item, idx) => (
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

        {/* Logout / Switch Account */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <LogOut size={16} color={colors.danger} style={{ marginRight: 6 }} />
          <Text style={[typography.bodyBold, { color: colors.danger }]}>Sign Out of WAVY</Text>
        </TouchableOpacity>
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
    padding: 16,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
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
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 12,
  },
});
