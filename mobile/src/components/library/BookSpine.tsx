/**
 * BookSpine Component
 * 
 * Visual representation of a Book on the bookshelf
 * Shows avatar, name, and unread indicator
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { Badge } from '../ui/Badge';
import type { BookSpine as BookSpineType } from '@/services/api/library';

interface BookSpineProps {
  book: BookSpineType;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BookSpine: React.FC<BookSpineProps> = ({ book, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
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
      accessibilityLabel={`Book by ${book.display_name}`}
      accessibilityHint={
        book.unread_count > 0 
          ? `${book.unread_count} unread chapter${book.unread_count > 1 ? 's' : ''}`
          : 'No unread chapters'
      }
      accessibilityRole="button"
    >
      <View style={[styles.spine, shadows.md]}>
        {/* Avatar */}
        {book.avatar_url ? (
          <Image 
            source={{ uri: book.avatar_url }} 
            style={styles.avatar}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {book.display_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Display Name */}
        <Text 
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {book.display_name}
        </Text>

        {/* Unread Badge */}
        {book.unread_count > 0 && (
          <View style={styles.badgeContainer}>
            <Badge count={book.unread_count} />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};

const SPINE_WIDTH = 120;
const SPINE_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  spine: {
    width: SPINE_WIDTH,
    height: SPINE_HEIGHT,
    backgroundColor: colors.paperWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    backgroundColor: colors.dustyCharcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.light,
    color: colors.paperWhite,
  },
  name: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.inkBlack,
    textAlign: 'center',
    lineHeight: typography.lineHeight.tight * typography.size.sm,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
