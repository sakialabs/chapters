/**
 * Margins Drawer Component
 * 
 * Displays chapter margins (comments) in a bottom drawer
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Margin } from '@/services/api/chapters';
import { colors, spacing, typography } from '@/theme';

interface MarginsDrawerProps {
  margins: Margin[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const DRAWER_HEIGHT = 400;
const SNAP_THRESHOLD = 100;

export const MarginsDrawer: React.FC<MarginsDrawerProps> = ({
  margins,
  isLoading,
  isOpen,
  onClose,
}) => {
  const translateY = useSharedValue(DRAWER_HEIGHT);

  React.useEffect(() => {
    translateY.value = withSpring(isOpen ? 0 : DRAWER_HEIGHT, {
      damping: 20,
      stiffness: 90,
    });
  }, [isOpen, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SNAP_THRESHOLD) {
        translateY.value = withSpring(DRAWER_HEIGHT, {
          damping: 20,
          stiffness: 90,
        });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Drawer */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, animatedStyle]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Margins {margins.length > 0 && `(${margins.length})`}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.inkBlue} />
              </View>
            ) : margins.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No margins yet</Text>
                <Text style={styles.emptySubtext}>
                  Be the first to leave a comment
                </Text>
              </View>
            ) : (
              margins.map((margin) => (
                <View key={margin.id} style={styles.marginItem}>
                  <View style={styles.marginHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {margin.user_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.marginInfo}>
                      <Text style={styles.userName}>{margin.user_name}</Text>
                      <Text style={styles.timestamp}>
                        {formatDate(margin.created_at)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.marginText}>{margin.text}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: colors.paperWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.warmGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  emptySubtext: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: spacing.xs,
  },
  marginItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  marginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warmGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  marginInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  timestamp: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    marginTop: 2,
  },
  marginText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.dustyCharcoal,
  },
});
