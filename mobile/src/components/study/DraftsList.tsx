/**
 * Drafts List Component
 * 
 * Displays user's drafts with preview
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useDrafts } from '@/hooks/useStudy';
import { Draft } from '@/services/api/study';
import { colors, spacing, typography } from '@/theme';

interface DraftsListProps {
  onDraftPress: (draftId: string) => void;
  onNewDraft: () => void;
}

export const DraftsList: React.FC<DraftsListProps> = ({
  onDraftPress,
  onNewDraft,
}) => {
  const { data, isLoading, error } = useDrafts();

  const getPreviewText = (draft: Draft): string => {
    const textBlock = draft.blocks.find(b => b.block_type === 'text');
    if (textBlock?.content.text) {
      return textBlock.content.text.substring(0, 150) + '...';
    }
    return 'Empty draft';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderDraft = ({ item }: { item: Draft }) => (
    <Pressable
      style={styles.draftCard}
      onPress={() => onDraftPress(item.id)}
      accessibilityLabel={`Draft: ${item.title || 'Untitled'}`}
      accessibilityRole="button"
    >
      <View style={styles.draftHeader}>
        <Text style={styles.draftTitle} numberOfLines={1}>
          {item.title || 'Untitled Draft'}
        </Text>
        <Text style={styles.draftDate}>{formatDate(item.updated_at)}</Text>
      </View>
      <Text style={styles.draftPreview} numberOfLines={3}>
        {getPreviewText(item)}
      </Text>
      <View style={styles.draftFooter}>
        <Text style={styles.blockCount}>
          {item.blocks.length} {item.blocks.length === 1 ? 'block' : 'blocks'}
        </Text>
      </View>
    </Pressable>
  );

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
        <Text style={styles.errorText}>Failed to load drafts</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* New Draft Button */}
      <Pressable
        style={styles.newButton}
        onPress={onNewDraft}
        accessibilityLabel="Create new draft"
        accessibilityRole="button"
      >
        <Text style={styles.newButtonIcon}>✍️</Text>
        <Text style={styles.newButtonText}>New Draft</Text>
      </Pressable>

      {/* Drafts List */}
      {data && data.drafts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No drafts yet</Text>
          <Text style={styles.emptySubtext}>
            Start writing your first chapter
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.drafts || []}
          renderItem={renderDraft}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.inkBlue,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newButtonIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  newButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
  listContent: {
    padding: spacing.lg,
  },
  draftCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  draftTitle: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginRight: spacing.sm,
  },
  draftDate: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  draftPreview: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.dustyCharcoal,
    marginBottom: spacing.sm,
  },
  draftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockCount: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
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
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
