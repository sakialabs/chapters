/**
 * Settings Screen
 * 
 * App settings, blocked users, and logout
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGetBlockedUsers, useUnblockUser } from '@/hooks/useBooks';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { data: blockedUsers, isLoading } = useGetBlockedUsers();
  const unblockMutation = useUnblockUser();

  const handleUnblock = (userId: string, username: string) => {
    Alert.alert(
      'Unblock User',
      `Unblock ${username}? They will be able to see your content and interact with you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              await unblockMutation.mutateAsync(userId);
              Alert.alert('Success', `${username} has been unblocked`);
            } catch (err) {
              Alert.alert('Error', 'Failed to unblock user');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            style={styles.settingItem}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.settingLabel}>Edit Profile</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={styles.settingItem}
            onPress={handleLogout}
          >
            <Text style={[styles.settingLabel, styles.logoutText]}>Logout</Text>
          </Pressable>
        </View>

        {/* Privacy & Safety Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>

          <View style={styles.blockedUsersSection}>
            <Text style={styles.blockedUsersTitle}>Blocked Users</Text>
            <Text style={styles.blockedUsersDescription}>
              Blocked users cannot see your content or interact with you
            </Text>

            {isLoading ? (
              <ActivityIndicator size="small" color={colors.inkBlue} style={styles.loader} />
            ) : blockedUsers && blockedUsers.length > 0 ? (
              blockedUsers.map((blocked) => (
                <View key={blocked.id} style={styles.blockedUserCard}>
                  <View style={styles.blockedUserInfo}>
                    <View style={styles.blockedUserAvatar}>
                      <Text style={styles.blockedUserAvatarText}>
                        {blocked.blocked_username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.blockedUsername}>{blocked.blocked_username}</Text>
                  </View>
                  <Pressable
                    style={styles.unblockButton}
                    onPress={() => handleUnblock(blocked.blocked_user_id, blocked.blocked_username)}
                    disabled={unblockMutation.isPending}
                  >
                    <Text style={styles.unblockButtonText}>Unblock</Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.noBlockedUsers}>No blocked users</Text>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Chapters</Text>
            <Text style={styles.infoText}>
              A calm, expressive, AI-assisted social platform built for depth, not dopamine.
            </Text>
            <Text style={styles.version}>Version 0.0.1</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paperWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.inkBlue,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.warmGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  settingLabel: {
    fontSize: typography.size.md,
    color: colors.inkBlue,
  },
  logoutText: {
    color: colors.error,
  },
  chevron: {
    fontSize: 24,
    color: colors.warmGray,
  },
  blockedUsersSection: {
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  blockedUsersTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.xs,
  },
  blockedUsersDescription: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.md,
  },
  blockedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
  },
  blockedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blockedUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  blockedUserAvatarText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.dustyCharcoal,
  },
  blockedUsername: {
    fontSize: typography.size.md,
    color: colors.inkBlue,
  },
  unblockButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  unblockButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  noBlockedUsers: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  infoBox: {
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  infoTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    lineHeight: typography.size.md * 1.5,
    marginBottom: spacing.md,
  },
  version: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
});
