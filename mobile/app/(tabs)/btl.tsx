/**
 * Between the Lines Tab
 * 
 * Main entry point for BTL conversations
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetThreads, useGetInvites } from '@/hooks/useBTL';
import { colors, spacing, typography } from '@/theme';

export default function BTLTab() {
  const router = useRouter();
  const { data: threads } = useGetThreads();
  const { data: invites } = useGetInvites();

  const activeThreads = threads?.filter(t => t.status === 'open') || [];
  const pendingInvites = invites?.filter(inv => inv.status === 'pending') || [];

  const handleViewThreads = () => {
    router.push('/btl/threads');
  };

  const handleViewInvites = () => {
    router.push('/btl/invites');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Between the Lines</Text>
        <Text style={styles.headerSubtitle}>
          Intimate reading conversations with mutual followers
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Invites Card */}
        <Pressable
          style={styles.card}
          onPress={handleViewInvites}
          accessibilityLabel="View invitations"
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>✉️</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Invitations</Text>
              <Text style={styles.cardDescription}>
                {pendingInvites.length > 0
                  ? `${pendingInvites.length} pending invitation${pendingInvites.length > 1 ? 's' : ''}`
                  : 'No pending invitations'}
              </Text>
            </View>
            {pendingInvites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingInvites.length}</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Threads Card */}
        <Pressable
          style={styles.card}
          onPress={handleViewThreads}
          accessibilityLabel="View conversations"
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💬</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Conversations</Text>
              <Text style={styles.cardDescription}>
                {activeThreads.length > 0
                  ? `${activeThreads.length} active conversation${activeThreads.length > 1 ? 's' : ''}`
                  : 'No active conversations'}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What is Between the Lines?</Text>
          <Text style={styles.infoText}>
            An intimate space for deep conversations about writing with readers you trust.
          </Text>
          <Text style={styles.infoText}>
            • Only available with mutual followers{'\n'}
            • Both must have 3+ published chapters{'\n'}
            • Limited to 3 invitations per day{'\n'}
            • Either person can close the conversation
          </Text>
        </View>

        {/* Recent Threads Preview */}
        {activeThreads.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Conversations</Text>
            {activeThreads.slice(0, 3).map((thread) => {
              const otherParticipant = thread.participants[0];
              return (
                <Pressable
                  key={thread.id}
                  style={styles.threadPreview}
                  onPress={() => router.push(`/btl/thread/${thread.id}`)}
                >
                  <View style={styles.threadAvatar}>
                    <Text style={styles.threadAvatarText}>
                      {otherParticipant.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.threadInfo}>
                    <Text style={styles.threadName}>{otherParticipant.username}</Text>
                    <Text style={styles.threadDate}>
                      {thread.last_message_at
                        ? new Date(thread.last_message_at).toLocaleDateString()
                        : new Date(thread.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              );
            })}
          </View>
        )}
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
    padding: spacing.xl,
    backgroundColor: colors.paperWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    lineHeight: typography.size.md * 1.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  badge: {
    backgroundColor: colors.btl,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.paperWhite,
  },
  infoSection: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    lineHeight: typography.size.md * 1.6,
    marginBottom: spacing.sm,
  },
  recentSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.warmGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  threadPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  threadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.btl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  threadAvatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.paperWhite,
  },
  threadInfo: {
    flex: 1,
  },
  threadName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  threadDate: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.warmGray,
  },
});
