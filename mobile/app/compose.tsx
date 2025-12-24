/**
 * Chapter Composer Screen
 * 
 * Direct chapter composition with Muse AI integration
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MusePanel } from '@/components/composer/MusePanel';
import { DraftBlock } from '@/services/api/study';
import { colors, spacing, typography } from '@/theme';

const MAX_BLOCKS = 12;
const MAX_MEDIA_BLOCKS = 2;

export default function ComposeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState('');
  const [blocks, setBlocks] = useState<DraftBlock[]>([]);
  const [showMuse, setShowMuse] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  const mediaBlockCount = blocks.filter(
    b => b.block_type === 'image' || b.block_type === 'audio' || b.block_type === 'video'
  ).length;

  const canAddBlock = blocks.length < MAX_BLOCKS;

  const handleAddTextBlock = () => {
    if (!canAddBlock) {
      Alert.alert('Limit Reached', `Maximum ${MAX_BLOCKS} blocks allowed`);
      return;
    }

    const newBlock: DraftBlock = {
      id: `temp-${Date.now()}`,
      block_type: 'text',
      position: blocks.length,
      content: { text: '' },
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (index: number, text: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      content: { ...updatedBlocks[index].content, text },
    };
    setBlocks(updatedBlocks);
  };

  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
  };

  const handleOpenMuse = (blockIndex?: number) => {
    setSelectedBlockIndex(blockIndex ?? null);
    setShowMuse(true);
  };

  const handleSelectPrompt = (prompt: string) => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      handleUpdateBlock(selectedBlockIndex, prompt);
    } else {
      handleAddTextBlock();
      setTimeout(() => {
        handleUpdateBlock(blocks.length, prompt);
      }, 100);
    }
    setShowMuse(false);
  };

  const handleSelectTitle = (suggestedTitle: string) => {
    setTitle(suggestedTitle);
    setShowMuse(false);
  };

  const handleRewriteComplete = (rewrittenText: string) => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      handleUpdateBlock(selectedBlockIndex, rewrittenText);
    }
    setShowMuse(false);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please add a title for your chapter');
      return;
    }

    if (blocks.length === 0) {
      Alert.alert('Empty Chapter', 'Please add some content');
      return;
    }

    Alert.alert(
      'Publish Chapter',
      'This will use one Open Page. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            // TODO: Implement chapter publishing
            Alert.alert('Success', 'Chapter published!', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ]
    );
  };

  const getCurrentContent = () => {
    return blocks
      .filter(b => b.block_type === 'text')
      .map(b => b.content.text)
      .join('\n\n');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.museButton}
            onPress={() => handleOpenMuse()}
            accessibilityLabel="Open Muse AI"
          >
            <Text style={styles.museButtonText}>✨ Muse</Text>
          </Pressable>
          <Pressable
            style={styles.publishButton}
            onPress={handlePublish}
            accessibilityLabel="Publish chapter"
          >
            <Text style={styles.publishButtonText}>Publish</Text>
          </Pressable>
        </View>
      </View>

      {/* Composer */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Chapter Title"
          placeholderTextColor={colors.warmGray}
          value={title}
          onChangeText={setTitle}
          multiline
        />

        {/* Metadata */}
        <View style={styles.metadata}>
          <TextInput
            style={styles.metadataInput}
            placeholder="Mood (optional)"
            placeholderTextColor={colors.warmGray}
            value={mood}
            onChangeText={setMood}
          />
          <TextInput
            style={styles.metadataInput}
            placeholder="Theme (optional)"
            placeholderTextColor={colors.warmGray}
            value={theme}
            onChangeText={setTheme}
          />
        </View>

        {/* Block Count Info */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {blocks.length}/{MAX_BLOCKS} blocks
          </Text>
          <Text style={styles.infoText}>
            {mediaBlockCount}/{MAX_MEDIA_BLOCKS} media
          </Text>
        </View>

        {/* Blocks */}
        {blocks.map((block, index) => (
          <View key={block.id} style={styles.blockContainer}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockNumber}>Block {index + 1}</Text>
              <Pressable
                style={styles.blockMuseButton}
                onPress={() => handleOpenMuse(index)}
              >
                <Text style={styles.blockMuseText}>✨</Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.blockInput}
              placeholder="Start writing..."
              placeholderTextColor={colors.warmGray}
              value={block.content.text || ''}
              onChangeText={(text) => handleUpdateBlock(index, text)}
              multiline
              textAlignVertical="top"
            />
            <Pressable
              style={styles.deleteBlockButton}
              onPress={() => handleDeleteBlock(index)}
              accessibilityLabel="Delete block"
            >
              <Text style={styles.deleteBlockText}>Delete Block</Text>
            </Pressable>
          </View>
        ))}

        {/* Add Block Button */}
        {canAddBlock && (
          <Pressable
            style={styles.addBlockButton}
            onPress={handleAddTextBlock}
            accessibilityLabel="Add text block"
          >
            <Text style={styles.addBlockIcon}>+</Text>
            <Text style={styles.addBlockText}>Add Text Block</Text>
          </Pressable>
        )}

        {!canAddBlock && (
          <View style={styles.limitMessage}>
            <Text style={styles.limitMessageText}>
              Maximum {MAX_BLOCKS} blocks reached
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Muse Panel */}
      <MusePanel
        isOpen={showMuse}
        onClose={() => setShowMuse(false)}
        onSelectPrompt={handleSelectPrompt}
        onSelectTitle={handleSelectTitle}
        onRewriteComplete={handleRewriteComplete}
        currentContent={getCurrentContent()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  museButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.muse,
    borderRadius: 8,
  },
  museButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  publishButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.inkBlue,
    borderRadius: 8,
  },
  publishButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
  },
  titleInput: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
    marginBottom: spacing.lg,
    minHeight: 60,
  },
  metadata: {
    marginBottom: spacing.lg,
  },
  metadataInput: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    marginBottom: spacing.sm,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
  },
  blockContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  blockNumber: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  blockMuseButton: {
    padding: spacing.xs,
  },
  blockMuseText: {
    fontSize: 20,
  },
  blockInput: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.6,
    color: colors.inkBlue,
    minHeight: 120,
    marginBottom: spacing.sm,
  },
  deleteBlockButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteBlockText: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  addBlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.warmGray,
    borderStyle: 'dashed',
  },
  addBlockIcon: {
    fontSize: 24,
    color: colors.inkBlue,
    marginRight: spacing.sm,
  },
  addBlockText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  limitMessage: {
    padding: spacing.lg,
    backgroundColor: colors.warmGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  limitMessageText: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
  },
});
