/**
 * Profile Tab - User's Book
 * 
 * Display user's profile and published chapters
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMyBook, useGetBookChapters } from '@/hooks/useBooks';
import { colors, spacing, typography } from '@/theme';

export default function ProfileTab() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data: book, isLoading: bookLoading, refetch: refetchBook } = useGetMyBook();
  const { data: chaptersData, isLoading: chaptersLoading } = useGetBookChapters(
    book?.id || '',
    page
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchBook();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  const handleChapterPress = (chapterId: string) => {
    router.push(`/chapter/${chapterId}`);
  };

  if (bookLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Book</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={handleSettings}
          accessibilityLabel="Settings"
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {book.username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.username}>{book.username}</Text>

          {book.bio && <Text style={styles.bio}>{book.bio}</Text>}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{book.chapter_count}</Text>
              <Text style={styles.statLabel}>Chapters</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{book.follower_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{book.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Privacy Badge */}
          {book.is_private && (
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyBadgeText}>🔒 Private Book</Text>
            </View>
          )}

          {/* Edit Button */}
          <Pressable
            style={styles.editButton}
            onPress={handleEditProfile}
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Chapters Section */}
        <View style={styles.chaptersSection}>
          <Text style={styles.sectionTitle}>Published Chapters</Text>

          {chaptersLoading ? (
            <ActivityIndicator size="small" color={colors.inkBlue} style={styles.loader} />
          ) : chaptersData && chaptersData.chapters.length > 0 ? (
            <>
              {chaptersData.chapters.map((chapter) => (
                <Pressable
                  key={chapter.id}
                  style={styles.chapterCard}
                  onPress={() => handleChapterPress(chapter.id)}
                  accessibilityLabel={`Read ${chapter.title}`}
                >
                  <View style={styles.chapterHeader}>
                    <Text style={styles.chapterTitle} numberOfLines={2}>
                      {chapter.title}
                    </Text>
                    {chapter.mood && (
                      <Text style={styles.chapterMood}>{chapter.mood}</Text>
                    )}
                  </View>
                  <View style={styles.chapterFooter}>
                    <Text style={styles.chapterDate}>
                      {new Date(chapter.published_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.chapterHearts}>♥ {chapter.heart_count}</Text>
                  </View>
                </Pressable>
              ))}

              {/* Pagination */}
              {(page > 1 || chaptersData.has_more) && (
                <View style={styles.pagination}>
                  {page > 1 && (
                    <Pressable
                      style={styles.pageButton}
                      onPress={() => setPage(page - 1)}
                    >
                      <Text style={styles.pageButtonText}>← Previous</Text>
                    </Pressable>
                  )}
                  <Text style={styles.pageInfo}>
                    Page {page} of {chaptersData.total_pages}
                  </Text>
                  {chaptersData.has_more && (
                    <Pressable
                      style={styles.pageButton}
                      onPress={() => setPage(page + 1)}
                    >
                      <Text style={styles.pageButtonText}>Next →</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyChapters}>
              <Text style={styles.emptyIcon}>📖</Text>
              <Text style={styles.emptyText}>No chapters yet</Text>
              <Text style={styles.emptySubtext}>
                Start writing in Study or use the Composer
              </Text>
            </View>
          )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.paperWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.inkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.paperWhite,
  },
  username: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.5,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
  },
  statLabel: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: spacing.xs,
  },
  privacyBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  privacyBadgeText: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
  },
  editButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.inkBlue,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
  chaptersSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  chapterCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  chapterHeader: {
    marginBottom: spacing.sm,
  },
  chapterTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.xs,
  },
  chapterMood: {
    fontSize: typography.size.sm,
    color: colors.muse,
    fontStyle: 'italic',
  },
  chapterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterDate: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
  },
  chapterHearts: {
    fontSize: typography.size.sm,
    color: colors.success,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  pageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  pageButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  pageInfo: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
  },
  emptyChapters: {
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
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
