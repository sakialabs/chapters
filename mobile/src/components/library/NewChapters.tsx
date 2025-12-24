/**
 * NewChapters Component
 * 
 * Displays recent chapters from followed Books
 * Bounded pagination (no infinite scroll) - max 100 chapters total
 */

import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { ChapterCard } from './ChapterCard';
import { useNewChapters } from '@/hooks/useLibrary';
import type { ChapterPreview } from '@/services/api/library';

interface NewChaptersProps {
  onChapterPress: (chapterId: string) => void;
}

export const NewChapters: React.FC<NewChaptersProps> = ({ onChapterPress }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useNewChapters(page, 20);

  if (isLoading && page === 1) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
        <Text style={styles.loadingText}>Loading new chapters...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load chapters</Text>
        <Text style={styles.errorDetail}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!data || data.chapters.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No new chapters</Text>
        <Text style={styles.emptyText}>
          Follow more Books to see their chapters here
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

  const renderFooter = () => {
    if (!data) return null;

    return (
      <View style={styles.paginationContainer}>
        {/* Page Info */}
        <Text style={styles.pageInfo}>
          Page {data.page} of {data.total_pages} • {data.total} chapters
        </Text>

        {/* Pagination Buttons */}
        <View style={styles.paginationButtons}>
          {/* Previous Button */}
          <Pressable
            style={[
              styles.pageButton,
              page === 1 && styles.pageButtonDisabled
            ]}
            onPress={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            accessibilityLabel="Previous page"
            accessibilityRole="button"
          >
            <Text style={[
              styles.pageButtonText,
              page === 1 && styles.pageButtonTextDisabled
            ]}>
              Previous
            </Text>
          </Pressable>

          {/* Page Numbers (show current and nearby pages) */}
          <View style={styles.pageNumbers}>
            {Array.from({ length: Math.min(data.total_pages, 5) }, (_, i) => {
              let pageNum;
              if (data.total_pages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= data.total_pages - 2) {
                pageNum = data.total_pages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Pressable
                  key={pageNum}
                  style={[
                    styles.pageNumberButton,
                    page === pageNum && styles.pageNumberButtonActive
                  ]}
                  onPress={() => setPage(pageNum)}
                  accessibilityLabel={`Page ${pageNum}`}
                  accessibilityRole="button"
                >
                  <Text style={[
                    styles.pageNumberText,
                    page === pageNum && styles.pageNumberTextActive
                  ]}>
                    {pageNum}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Next Button */}
          <Pressable
            style={[
              styles.pageButton,
              !data.has_more && styles.pageButtonDisabled
            ]}
            onPress={() => setPage(p => p + 1)}
            disabled={!data.has_more}
            accessibilityLabel="Next page"
            accessibilityRole="button"
          >
            <Text style={[
              styles.pageButtonText,
              !data.has_more && styles.pageButtonTextDisabled
            ]}>
              Next
            </Text>
          </Pressable>
        </View>

        {/* Bounded Notice */}
        {data.total >= 100 && (
          <Text style={styles.boundedNotice}>
            Showing most recent 100 chapters
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Chapters</Text>
        <Text style={styles.subtitle}>
          From Books you follow
        </Text>
      </View>

      <FlatList
        data={data.chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
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
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.light,
    color: colors.inkBlack,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
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
  paginationContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
    alignItems: 'center',
  },
  pageInfo: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    marginBottom: spacing.md,
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.inkBlue,
    backgroundColor: colors.paperWhite,
  },
  pageButtonDisabled: {
    borderColor: colors.warmGray,
    backgroundColor: colors.background,
  },
  pageButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  pageButtonTextDisabled: {
    color: colors.warmGray,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  pageNumberButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.warmGray,
    backgroundColor: colors.paperWhite,
  },
  pageNumberButtonActive: {
    borderColor: colors.inkBlue,
    backgroundColor: colors.inkBlue,
  },
  pageNumberText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.inkBlack,
  },
  pageNumberTextActive: {
    color: colors.paperWhite,
  },
  boundedNotice: {
    marginTop: spacing.md,
    fontSize: typography.size.xs,
    color: colors.dustyCharcoal,
    fontStyle: 'italic',
  },
});
