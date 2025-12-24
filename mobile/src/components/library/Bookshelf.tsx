/**
 * Bookshelf Component
 * 
 * Displays followed Books as visual spines on a bookshelf
 */

import React from 'react';
import { StyleSheet, View, FlatList, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { BookSpine } from './BookSpine';
import { useBookshelf } from '@/hooks/useLibrary';
import type { BookSpine as BookSpineType } from '@/services/api/library';

interface BookshelfProps {
  onBookPress: (bookId: string) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ onBookPress }) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useBookshelf();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
        <Text style={styles.loadingText}>Loading your bookshelf...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load bookshelf</Text>
        <Text style={styles.errorDetail}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!data || data.spines.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Your bookshelf is empty</Text>
        <Text style={styles.emptyText}>
          Follow other Books to see them here
        </Text>
      </View>
    );
  }

  const renderSpine = ({ item }: { item: BookSpineType }) => (
    <BookSpine 
      book={item} 
      onPress={() => onBookPress(item.book_id)} 
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Bookshelf</Text>
        <Text style={styles.subtitle}>
          {data.total} {data.total === 1 ? 'Book' : 'Books'}
        </Text>
      </View>

      <FlatList
        data={data.spines}
        renderItem={renderSpine}
        keyExtractor={(item) => item.book_id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.inkBlue}
            colors={[colors.inkBlue]}
          />
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-around',
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
});
