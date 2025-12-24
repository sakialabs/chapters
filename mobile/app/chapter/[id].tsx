/**
 * Chapter Reader Screen
 * 
 * Beautiful reading experience with page-turn gestures, engagement actions, and margins
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChapter, useMargins, useHeartChapter, useBookmarkChapter } from '@/hooks/useChapter';
import { ChapterBlock } from '@/components/reader/ChapterBlock';
import { MarginsDrawer } from '@/components/reader/MarginsDrawer';
import { colors, spacing, typography } from '@/theme';

export default function ChapterReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showMargins, setShowMargins] = useState(false);

  const { data: chapter, isLoading, error } = useChapter(id);
  const { data: marginsData, isLoading: marginsLoading } = useMargins(id);
  const heartMutation = useHeartChapter();
  const bookmarkMutation = useBookmarkChapter();

  const handleBack = () => {
    router.back();
  };

  const handleHeart = () => {
    if (chapter) {
      heartMutation.mutate({
        chapterId: chapter.id,
        isHearted: chapter.is_hearted,
      });
    }
  };

  const handleBookmark = () => {
    if (chapter) {
      bookmarkMutation.mutate({
        chapterId: chapter.id,
        isBookmarked: chapter.is_bookmarked,
        bookmarkId: chapter.id, // In real app, we'd need the actual bookmark ID
      });
    }
  };

  const handleShowMargins = () => {
    setShowMargins(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (error || !chapter) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load chapter</Text>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.authorName} numberOfLines={1}>
            {chapter.author_name}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* Chapter Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Header */}
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {chapter.mood && (
            <Text style={styles.chapterMood}>{chapter.mood}</Text>
          )}
          {chapter.theme && (
            <Text style={styles.chapterTheme}>{chapter.theme}</Text>
          )}
          <Text style={styles.publishedDate}>
            {new Date(chapter.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Chapter Blocks */}
        <View style={styles.blocks}>
          {chapter.blocks
            .sort((a, b) => a.position - b.position)
            .map((block) => (
              <ChapterBlock key={block.id} block={block} />
            ))}
        </View>

        {/* End Marker */}
        <View style={styles.endMarker}>
          <Text style={styles.endMarkerText}>✦</Text>
        </View>
      </ScrollView>

      {/* Engagement Bar */}
      <View style={styles.engagementBar}>
        <Pressable
          style={styles.engagementButton}
          onPress={handleHeart}
          accessibilityLabel={chapter.is_hearted ? 'Unheart chapter' : 'Heart chapter'}
          accessibilityRole="button"
        >
          <Text style={styles.engagementIcon}>
            {chapter.is_hearted ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.engagementCount}>{chapter.heart_count}</Text>
        </Pressable>

        <Pressable
          style={styles.engagementButton}
          onPress={handleShowMargins}
          accessibilityLabel="View margins"
          accessibilityRole="button"
        >
          <Text style={styles.engagementIcon}>💬</Text>
          <Text style={styles.engagementCount}>{chapter.margin_count}</Text>
        </Pressable>

        <Pressable
          style={styles.engagementButton}
          onPress={handleBookmark}
          accessibilityLabel={chapter.is_bookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
          accessibilityRole="button"
        >
          <Text style={styles.engagementIcon}>
            {chapter.is_bookmarked ? '📌' : '📑'}
          </Text>
        </Pressable>
      </View>

      {/* Margins Drawer */}
      <MarginsDrawer
        margins={marginsData?.margins || []}
        isLoading={marginsLoading}
        isOpen={showMargins}
        onClose={() => setShowMargins(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.inkBlue,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
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
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.inkBlue,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  authorName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: 100, // Space for engagement bar
  },
  chapterHeader: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  chapterTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  chapterMood: {
    fontSize: typography.size.md,
    color: colors.muse,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  chapterTheme: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginBottom: spacing.sm,
  },
  publishedDate: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  blocks: {
    marginBottom: spacing.xl,
  },
  endMarker: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  endMarkerText: {
    fontSize: 24,
    color: colors.muse,
  },
  engagementBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.paperWhite,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  engagementButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  engagementIcon: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  engagementCount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
});
