/**
 * Chapter Block Component
 * 
 * Renders different types of chapter blocks (text, image, audio, video, quote)
 */
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ChapterBlock as ChapterBlockType } from '@/services/api/chapters';
import { colors, spacing, typography } from '@/theme';

interface ChapterBlockProps {
  block: ChapterBlockType;
  onBlockPress?: (blockId: string) => void;
}

export const ChapterBlock: React.FC<ChapterBlockProps> = ({ block, onBlockPress }) => {
  const handlePress = () => {
    if (onBlockPress) {
      onBlockPress(block.id);
    }
  };

  const renderContent = () => {
    switch (block.block_type) {
      case 'text':
        return (
          <Pressable onLongPress={handlePress} delayLongPress={300}>
            <Text style={styles.text}>{block.content.text}</Text>
          </Pressable>
        );

      case 'quote':
        return (
          <Pressable onLongPress={handlePress} delayLongPress={300}>
            <View style={styles.quoteContainer}>
              <View style={styles.quoteMark} />
              <Text style={styles.quoteText}>{block.content.text}</Text>
              {block.content.attribution && (
                <Text style={styles.quoteAttribution}>— {block.content.attribution}</Text>
              )}
            </View>
          </Pressable>
        );

      case 'image':
        return (
          <Pressable onLongPress={handlePress} delayLongPress={300}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: block.content.url }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={block.content.caption || 'Chapter image'}
              />
              {block.content.caption && (
                <Text style={styles.caption}>{block.content.caption}</Text>
              )}
            </View>
          </Pressable>
        );

      case 'audio':
        return (
          <Pressable onPress={handlePress}>
            <View style={styles.mediaContainer}>
              <View style={styles.mediaIcon}>
                <Text style={styles.mediaIconText}>🎵</Text>
              </View>
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaLabel}>Audio</Text>
                {block.content.duration && (
                  <Text style={styles.mediaDuration}>
                    {formatDuration(block.content.duration)}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        );

      case 'video':
        return (
          <Pressable onPress={handlePress}>
            <View style={styles.mediaContainer}>
              <View style={styles.mediaIcon}>
                <Text style={styles.mediaIconText}>🎬</Text>
              </View>
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaLabel}>Video</Text>
                {block.content.duration && (
                  <Text style={styles.mediaDuration}>
                    {formatDuration(block.content.duration)}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  text: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.6,
    color: colors.inkBlue,
  },
  quoteContainer: {
    paddingLeft: spacing.xl,
    paddingVertical: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warmGray,
  },
  quoteMark: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    width: 4,
    height: 4,
    backgroundColor: colors.warmGray,
    borderRadius: 2,
  },
  quoteText: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.5,
    color: colors.dustyCharcoal,
    fontStyle: 'italic',
  },
  quoteAttribution: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: spacing.sm,
  },
  imageContainer: {
    marginVertical: spacing.md,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: colors.warmGray,
  },
  caption: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  mediaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.inkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mediaIconText: {
    fontSize: 24,
  },
  mediaInfo: {
    flex: 1,
  },
  mediaLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  mediaDuration: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: 2,
  },
});
