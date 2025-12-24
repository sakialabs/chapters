/**
 * Card Component
 * 
 * Base card component with paper-like styling
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevated = true 
}) => {
  return (
    <View style={[
      styles.card,
      elevated && shadows.md,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paperWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
});
