/**
 * BTL Threads List Screen
 * 
 * View all Between the Lines conversations
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGetThreads } from '@/hooks/useBTL';
import { colors, spacing, typography } from '@/theme';

export default function BTLThreadsScreen() {
  const router = useRouter();
  const { data: threads, isLoading, error } = useGetThreads();

  const handleThreadPress = (threadId: string) => {
    router.push(`/btl/thread/${threadId}`);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load threads</Text>
      </View>
    );
  }

  const activeThreads = threads?.filter(t => t.status === 'open') || [];
  const closedThreads = threads?.filter(t => t.status === 'closed') || [];

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
        <Text style={styles.headerTitle}>Between the Lines</Text>
        <Pressable
          style={styles.invitesButton}
          onPress={() => router.push('/btl/invites')}
          accessibilityLabel="View invitations"
        >
          <Text style={styles.invitesButtonText}>✉️</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {activeThreads.length === 0 && closedThreads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No Conversations Yet</Text>
            <Text style={styles.emptySubtext}>
              Connect with mutual followers who have 3+ published chapters to start intimate reading conversations.
            </Text>
          </View>
        ) : (
          <>
            {/* Active Threads */}
            {activeThreads.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active</Text>
                {activeThreads.map((thread) => {
                  const otherParticipant = thread.participants[0]; // Simplified - assumes 2 participants
                  return (
                    <Pressable
                      key={thread.id}
                      style={styles.threadCard}
                      onPress={() => handleThreadPress(thread.id)}
                      accessibilityLabel={`Open conversation with ${otherParticipant.username}`}
                    >
                      <View style={styles.threadHeader}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {otherParticipant.username.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.threadInfo}>
                          <Text style={styles.participantName}>
                            {otherParticipant.username}
                          </Text>
                          <Text style={styles.threadDate}>
                            {thread.last_message_at
                              ? `Last message: ${new Date(thread.last_message_at).toLocaleDateString()}`
                              : `Started: ${new Date(thread.created_at).toLocaleDateString()}`}
                          </Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Closed Threads */}
            {closedThreads.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Closed</Text>
                {closedThreads.map((thread) => {
                  const otherParticipant = thread.participants[0];
                  return (
                    <Pressable
                      key={thread.id}
                      style={[styles.threadCard, styles.closedThreadCard]}
                      onPress={() => handleThreadPress(thread.id)}
                      accessibilityLabel={`View closed conversation with ${otherParticipant.username}`}
                    >
                      <View style={styles.threadHeader}>
                        <View style={[styles.avatar, styles.closedAvatar]}>
                          <Text style={styles.closedAvatarText}>
                            {otherParticipant.username.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.threadInfo}>
                          <Text style={styles.closedParticipantName}>
                            {otherParticipant.username}
                          </Text>
                          <Text style={styles.threadDate}>
                            Closed: {new Date(thread.closed_at!).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  invitesButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitesButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.size.md,
    color: colors.warmGray,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: typography.size.md * 1.5,
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
  threadCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  closedThreadCard: {
    opacity: 0.6,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.btl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  closedAvatar: {
    backgroundColor: colors.warmGray,
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.paperWhite,
  },
  closedAvatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.dustyCharcoal,
  },
  threadInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  closedParticipantName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
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
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
