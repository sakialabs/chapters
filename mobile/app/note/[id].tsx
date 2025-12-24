/**
 * Note Editor Screen
 * 
 * Simple note editor with tags
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
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from '@/hooks/useStudy';
import { colors, spacing, typography } from '@/theme';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { data: note, isLoading } = useNote(id);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagsInput(note.tags.join(', '));
    }
  }, [note]);

  const parseTags = (input: string): string[] => {
    return input
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      const tags = parseTags(tagsInput);

      if (isNew) {
        await createMutation.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          tags,
        });
        router.back();
      } else {
        await updateMutation.mutateAsync({
          noteId: id,
          data: {
            title: title.trim(),
            content: content.trim(),
            tags,
          },
        });
      }
      setHasChanges(false);
      Alert.alert('Success', 'Note saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
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
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
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
            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
              accessibilityLabel="Delete note"
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.saveButton, !hasChanges && !isNew && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges && !isNew}
            accessibilityLabel="Save note"
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
          placeholder="Note Title"
          placeholderTextColor={colors.warmGray}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setHasChanges(true);
          }}
        />

        {/* Tags Input */}
        <View style={styles.tagsSection}>
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.tagsInput}
            placeholder="writing, ideas, inspiration"
            placeholderTextColor={colors.warmGray}
            value={tagsInput}
            onChangeText={(text) => {
              setTagsInput(text);
              setHasChanges(true);
            }}
          />
        </View>

        {/* Content Input */}
        <View style={styles.contentSection}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.warmGray}
            value={content}
            onChangeText={(text) => {
              setContent(text);
              setHasChanges(true);
            }}
            multiline
            textAlignVertical="top"
          />
        </View>
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
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  tagsSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
    marginBottom: spacing.xs,
  },
  tagsInput: {
    fontSize: typography.size.md,
    color: colors.inkBlue,
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  contentSection: {
    flex: 1,
  },
  contentInput: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.6,
    color: colors.inkBlue,
    minHeight: 300,
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
});
