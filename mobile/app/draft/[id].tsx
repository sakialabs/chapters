/**
 * Draft Editor Screen
 * 
 * Block-based editor for creating and editing drafts
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useDraft,
  useCreateDraft,
  useUpdateDraft,
  usePromoteDraft,
  useDeleteDraft,
} from '@/hooks/useStudy';
import { DraftBlock } from '@/services/api/study';
import { colors, spacing, typography } from '@/theme';

export default function DraftEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { data: draft, isLoading } = useDraft(id);
  const createMutation = useCreateDraft();
  const updateMutation = useUpdateDraft();
  const promoteMutation = usePromoteDraft();
  const deleteMutation = useDeleteDraft();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<DraftBlock[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (draft) {
      setTitle(draft.title || '');
      setBlocks(draft.blocks);
    }
  }, [draft]);

  const handleSave = async () => {
    try {
      if (isNew) {
        const result = await createMutation.mutateAsync({
          title: title || undefined,
          blocks,
        });
        router.replace(`/draft/${result.id}`);
      } else {
        await updateMutation.mutateAsync({
          draftId: id,
          data: { title: title || undefined, blocks },
        });
      }
      setHasChanges(false);
      Alert.alert('Success', 'Draft saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const handlePublish = () => {
    Alert.alert(
      'Publish Chapter',
      'This will use one Open Page. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            try {
              const result = await promoteMutation.mutateAsync(id);
              Alert.alert('Success', 'Chapter published!', [
                {
                  text: 'View Chapter',
                  onPress: () => router.replace(`/chapter/${result.chapter_id}`),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to publish chapter');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Draft',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete draft');
            }
          },
        },
      ]
    );
  };

  const handleAddTextBlock = () => {
    const newBlock: DraftBlock = {
      id: `temp-${Date.now()}`,
      block_type: 'text',
      position: blocks.length,
      content: { text: '' },
    };
    setBlocks([...blocks, newBlock]);
    setHasChanges(true);
  };

  const handleUpdateBlock = (index: number, text: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      content: { ...updatedBlocks[index].content, text },
    };
    setBlocks(updatedBlocks);
    setHasChanges(true);
  };

  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    setHasChanges(true);
  };

  if (isLoading && !isNew) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

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
          {!isNew && (
            <>
              <Pressable
                style={styles.deleteButton}
                onPress={handleDelete}
                accessibilityLabel="Delete draft"
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </Pressable>
              <Pressable
                style={styles.publishButton}
                onPress={handlePublish}
                accessibilityLabel="Publish chapter"
              >
                <Text style={styles.publishButtonText}>Publish</Text>
              </Pressable>
            </>
          )}
          <Pressable
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
            accessibilityLabel="Save draft"
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Editor */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Untitled Draft"
          placeholderTextColor={colors.warmGray}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setHasChanges(true);
          }}
          multiline
        />

        {/* Blocks */}
        {blocks.map((block, index) => (
          <View key={block.id} style={styles.blockContainer}>
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
              <Text style={styles.deleteBlockText}>×</Text>
            </Pressable>
          </View>
        ))}

        {/* Add Block Button */}
        <Pressable
          style={styles.addBlockButton}
          onPress={handleAddTextBlock}
          accessibilityLabel="Add text block"
        >
          <Text style={styles.addBlockIcon}>+</Text>
          <Text style={styles.addBlockText}>Add Text Block</Text>
        </Pressable>
      </ScrollView>
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
  deleteButton: {
    padding: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 20,
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
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.inkBlue,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
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
    marginBottom: spacing.xl,
    minHeight: 60,
  },
  blockContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  blockInput: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.6,
    color: colors.inkBlue,
    minHeight: 100,
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  deleteBlockButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
  },
  deleteBlockText: {
    fontSize: 24,
    color: colors.dustyCharcoal,
    lineHeight: 24,
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
});
