/**
 * Muse Panel Component
 * 
 * AI writing assistant panel with prompts, title suggestions, and rewriting
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useGetPrompts, useGetTitleSuggestions, useRewriteText } from '@/hooks/useMuse';
import { colors, spacing, typography } from '@/theme';

interface MusePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
  onSelectTitle?: (title: string) => void;
  onRewriteComplete?: (text: string) => void;
  currentContent?: string;
}

type Tab = 'prompts' | 'titles' | 'rewrite';

const DRAWER_HEIGHT = 500;
const SNAP_THRESHOLD = 100;

export const MusePanel: React.FC<MusePanelProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onSelectTitle,
  onRewriteComplete,
  currentContent = '',
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('prompts');
  const [rewriteText, setRewriteText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'formal' | 'casual' | 'poetic' | 'concise' | 'elaborate'>('casual');

  const translateY = useSharedValue(DRAWER_HEIGHT);

  const promptsMutation = useGetPrompts();
  const titlesMutation = useGetTitleSuggestions();
  const rewriteMutation = useRewriteText();

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

  const handleGetPrompts = () => {
    promptsMutation.mutate({
      context: currentContent,
    });
  };

  const handleGetTitles = () => {
    if (currentContent.trim()) {
      titlesMutation.mutate({
        content: currentContent,
      });
    }
  };

  const handleRewrite = () => {
    if (rewriteText.trim()) {
      rewriteMutation.mutate({
        text: rewriteText,
        style: selectedStyle,
      });
    }
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
            <Text style={styles.title}>✨ Muse</Text>
            <Text style={styles.subtitle}>Your AI writing assistant</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'prompts' && styles.tabActive]}
              onPress={() => setActiveTab('prompts')}
            >
              <Text style={[styles.tabText, activeTab === 'prompts' && styles.tabTextActive]}>
                Prompts
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'titles' && styles.tabActive]}
              onPress={() => setActiveTab('titles')}
            >
              <Text style={[styles.tabText, activeTab === 'titles' && styles.tabTextActive]}>
                Titles
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'rewrite' && styles.tabActive]}
              onPress={() => setActiveTab('rewrite')}
            >
              <Text style={[styles.tabText, activeTab === 'rewrite' && styles.tabTextActive]}>
                Rewrite
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'prompts' && (
              <View>
                <Pressable style={styles.generateButton} onPress={handleGetPrompts}>
                  <Text style={styles.generateButtonText}>
                    {promptsMutation.isPending ? 'Generating...' : 'Generate Prompts'}
                  </Text>
                </Pressable>

                {promptsMutation.isPending && (
                  <ActivityIndicator size="large" color={colors.inkBlue} style={styles.loader} />
                )}

                {promptsMutation.data?.prompts.map((prompt, index) => (
                  <Pressable
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => onSelectPrompt?.(prompt)}
                  >
                    <Text style={styles.suggestionText}>{prompt}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {activeTab === 'titles' && (
              <View>
                <Pressable
                  style={[styles.generateButton, !currentContent.trim() && styles.generateButtonDisabled]}
                  onPress={handleGetTitles}
                  disabled={!currentContent.trim()}
                >
                  <Text style={styles.generateButtonText}>
                    {titlesMutation.isPending ? 'Generating...' : 'Suggest Titles'}
                  </Text>
                </Pressable>

                {titlesMutation.isPending && (
                  <ActivityIndicator size="large" color={colors.inkBlue} style={styles.loader} />
                )}

                {titlesMutation.data?.suggestions.map((title, index) => (
                  <Pressable
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => onSelectTitle?.(title)}
                  >
                    <Text style={styles.suggestionTitle}>{title}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {activeTab === 'rewrite' && (
              <View>
                <TextInput
                  style={styles.rewriteInput}
                  placeholder="Paste text to rewrite..."
                  placeholderTextColor={colors.warmGray}
                  value={rewriteText}
                  onChangeText={setRewriteText}
                  multiline
                  textAlignVertical="top"
                />

                <View style={styles.styleSelector}>
                  {(['casual', 'formal', 'poetic', 'concise', 'elaborate'] as const).map((style) => (
                    <Pressable
                      key={style}
                      style={[styles.styleButton, selectedStyle === style && styles.styleButtonActive]}
                      onPress={() => setSelectedStyle(style)}
                    >
                      <Text style={[styles.styleButtonText, selectedStyle === style && styles.styleButtonTextActive]}>
                        {style}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  style={[styles.generateButton, !rewriteText.trim() && styles.generateButtonDisabled]}
                  onPress={handleRewrite}
                  disabled={!rewriteText.trim()}
                >
                  <Text style={styles.generateButtonText}>
                    {rewriteMutation.isPending ? 'Rewriting...' : 'Rewrite'}
                  </Text>
                </Pressable>

                {rewriteMutation.isPending && (
                  <ActivityIndicator size="large" color={colors.inkBlue} style={styles.loader} />
                )}

                {rewriteMutation.data && (
                  <Pressable
                    style={styles.resultCard}
                    onPress={() => onRewriteComplete?.(rewriteMutation.data.rewritten_text)}
                  >
                    <Text style={styles.resultLabel}>Tap to use:</Text>
                    <Text style={styles.resultText}>{rewriteMutation.data.rewritten_text}</Text>
                  </Pressable>
                )}
              </View>
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
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    marginTop: spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.muse,
  },
  tabText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  tabTextActive: {
    color: colors.inkBlue,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  generateButton: {
    backgroundColor: colors.muse,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  suggestionCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  suggestionText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  suggestionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  rewriteInput: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    fontSize: typography.size.md,
    color: colors.inkBlue,
    minHeight: 100,
    marginBottom: spacing.md,
  },
  styleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  styleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  styleButtonActive: {
    backgroundColor: colors.muse,
    borderColor: colors.muse,
  },
  styleButtonText: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    textTransform: 'capitalize',
  },
  styleButtonTextActive: {
    color: colors.inkBlue,
    fontWeight: typography.weight.semibold,
  },
  resultCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.muse,
    marginTop: spacing.md,
  },
  resultLabel: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    marginBottom: spacing.xs,
  },
  resultText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.inkBlue,
  },
});
