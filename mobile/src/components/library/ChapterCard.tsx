/**
 * ChapterCard Component
 * 
 * Preview card for a chapter in feeds
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import type { ChapterPreview } from '@/services/api/library';

interface ChapterCardProps {
  chapter: ChapterPreview;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`Chapter: ${chapter.title} by ${chapter.author_name}`}
      accessibilityRole="button"
    >
      <View style={[styles.card, shadows.md]}>
        {/* Cover Image */}
        {chapter.cover_url && (
          <Image 
            source={{ uri: chapter.cover_url }} 
            style={styles.cover}
            accessibilityIgnoresInvertColors
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {chapter.title}
          </Text>

          {/* Author */}
          <View style={styles.authorRow}>
            {chapter.author_avatar && (
              <Image 
                source={{ uri: chapter.author_avatar }} 
                style={styles.authorAvatar}
                accessibilityIgnoresInvertColors
              />
            )}
            <Text style={styles.author} numberOfLines={1}>
              by {chapter.author_name}
            </Text>
          </View>

          {/* Metadata */}
          {(chapter.mood || chapter.theme) && (
            <View style={styles.metadataRow}>
              {chapter.mood && (
                <Text style={styles.metadata}>{chapter.mood}</Text>
              )}
              {chapter.mood && chapter.theme && (
                <Text style={styles.metadataDivider}>•</Text>
              )}
              {chapter.theme && (
                <Text style={styles.metadata}>{chapter.theme}</Text>
              )}
            </View>
          )}

          {/* Engagement */}
          <View style={styles.engagementRow}>
            <Text style={styles.engagement}>♥ {chapter.heart_count}</Text>
            {chapter.margin_count > 0 && (
              <>
                <Text style={styles.engagementDivider}>•</Text>
                <Text style={styles.engagement}>{chapter.margin_count} margins</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.paperWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: colors.warmGray,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.inkBlack,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.size.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.xs,
  },
  author: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    flex: 1,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadata: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
  },
  metadataDivider: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginHorizontal: spacing.xs,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagement: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
  },
  engagementDivider: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginHorizontal: spacing.xs,
  },
});
