/**
 * Badge Component
 * 
 * Small badge for unread indicators, counts, etc.
 */

import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { colors, borderRadius, typography, spacing } from '@/theme';

interface BadgeProps {
  count: number;
  style?: ViewStyle;
  variant?: 'default' | 'accent';
}

export const Badge: React.FC<BadgeProps> = ({ 
  count, 
  style,
  variant = 'default'
}) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[
      styles.badge,
      variant === 'accent' && styles.badgeAccent,
      style
    ]}>
      <Text style={[
        styles.text,
        variant === 'accent' && styles.textAccent
      ]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.mutedClay,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAccent: {
    backgroundColor: colors.inkBlue,
  },
  text: {
    color: colors.paperWhite,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  textAccent: {
    color: colors.paperWhite,
  },
});
