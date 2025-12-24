/**
 * BTL Invites Screen
 * 
 * View and respond to Between the Lines invitations
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGetInvites, useAcceptInvite, useDeclineInvite } from '@/hooks/useBTL';
import { colors, spacing, typography } from '@/theme';

export default function BTLInvitesScreen() {
  const router = useRouter();
  const { data: invites, isLoading, error } = useGetInvites();
  const acceptMutation = useAcceptInvite();
  const declineMutation = useDeclineInvite();

  const handleAccept = async (inviteId: string) => {
    try {
      const thread = await acceptMutation.mutateAsync(inviteId);
      Alert.alert(
        'Connection Opened',
        'Your Between the Lines conversation has begun.',
        [
          {
            text: 'Open Thread',
            onPress: () => router.push(`/btl/thread/${thread.id}`),
          },
          { text: 'Later', style: 'cancel' },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to accept invite. Please try again.');
    }
  };

  const handleDecline = (inviteId: string) => {
    Alert.alert(
      'Decline Invitation',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              await declineMutation.mutateAsync(inviteId);
            } catch (err) {
              Alert.alert('Error', 'Failed to decline invite.');
            }
          },
        },
      ]
    );
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
        <Text style={styles.errorText}>Failed to load invites</Text>
      </View>
    );
  }

  const pendingInvites = invites?.filter(inv => inv.status === 'pending') || [];

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
        <Text style={styles.headerTitle}>Invitations</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {pendingInvites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✉️</Text>
            <Text style={styles.emptyText}>No Pending Invites</Text>
            <Text style={styles.emptySubtext}>
              When someone invites you to connect Between the Lines, it will appear here.
            </Text>
          </View>
        ) : (
          pendingInvites.map((invite) => (
            <View key={invite.id} style={styles.inviteCard}>
              {/* Sender Info */}
              <View style={styles.inviteHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {invite.sender_username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.inviteInfo}>
                  <Text style={styles.senderName}>{invite.sender_username}</Text>
                  <Text style={styles.inviteDate}>
                    {new Date(invite.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Note or Quoted Line */}
              {invite.quoted_line && (
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteText}>"{invite.quoted_line}"</Text>
                </View>
              )}

              {invite.note && (
                <Text style={styles.noteText}>{invite.note}</Text>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.declineButton]}
                  onPress={() => handleDecline(invite.id)}
                  disabled={declineMutation.isPending}
                  accessibilityLabel="Decline invitation"
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAccept(invite.id)}
                  disabled={acceptMutation.isPending}
                  accessibilityLabel="Accept invitation"
                >
                  <Text style={styles.acceptButtonText}>
                    {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
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
  headerRight: {
    width: 40,
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
  },
  inviteCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.paperWhite,
  },
  inviteInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  inviteDate: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: 2,
  },
  quoteContainer: {
    paddingLeft: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.btl,
    marginBottom: spacing.md,
  },
  quoteText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.dustyCharcoal,
    fontStyle: 'italic',
  },
  noteText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.dustyCharcoal,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  declineButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  acceptButton: {
    backgroundColor: colors.btl,
  },
  acceptButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
