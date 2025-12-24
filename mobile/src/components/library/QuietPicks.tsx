/**
 * QuietPicks Component
 * 
 * Daily personalized recommendations (max 5)
 * Based on taste, not popularity
 */

import React from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { ChapterCard } from './ChapterCard';
import { useQuietPicks } from '@/hooks/useLibrary';
import type { ChapterPreview } from '@/services/api/library';

interface QuietPicksProps {
  onChapterPress: (chapterId: string) => void;
}

export const QuietPicks: React.FC<QuietPicksProps> = ({ onChapterPress }) => {
  const { data, isLoading, isError, error } = useQuietPicks();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.mutedClay} />
        <Text style={styles.loadingText}>Finding your picks...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load Quiet Picks</Text>
        <Text style={styles.errorDetail}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!data || data.picks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No picks today</Text>
        <Text style={styles.emptyText}>
          Read and interact with chapters to help us understand your taste
        </Text>
      </View>
    );
  }

  const renderChapter = ({ item }: { item: ChapterPreview }) => (
    <ChapterCard 
      chapter={item} 
      onPress={() => onChapterPress(item.id)} 
    />
  );

  // Format refresh time
  const refreshTime = new Date(data.refreshes_at);
  const timeString = refreshTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🤫</Text>
          <Text style={styles.title}>Quiet Picks</Text>
        </View>
        <Text style={styles.subtitle}>
          {data.picks.length} {data.picks.length === 1 ? 'chapter' : 'chapters'} chosen for you
        </Text>
        <Text style={styles.refreshInfo}>
          Refreshes at {timeString}
        </Text>
      </View>

      <FlatList
        data={data.picks}
        renderItem={renderChapter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              These picks are based on your taste, not popularity.
            </Text>
            <Text style={styles.footerText}>
              Max 5 per day. No more until tomorrow.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.mutedClay + '10', // 10% opacity
    borderBottomWidth: 1,
    borderBottomColor: colors.mutedClay + '30',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: typography.size.xl,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.light,
    color: colors.inkBlack,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    marginBottom: spacing.xs,
  },
  refreshInfo: {
    fontSize: typography.size.sm,
    color: colors.mutedClay,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  errorText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.mutedClay,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.light,
    color: colors.inkBlack,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    textAlign: 'center',
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
