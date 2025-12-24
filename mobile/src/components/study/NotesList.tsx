/**
 * Notes List Component
 * 
 * Displays user's notes with tags
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNotes } from '@/hooks/useStudy';
import { Note } from '@/services/api/study';
import { colors, spacing, typography } from '@/theme';

interface NotesListProps {
  onNotePress: (noteId: string) => void;
  onNewNote: () => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  onNotePress,
  onNewNote,
}) => {
  const { data, isLoading, error } = useNotes();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <Pressable
      style={styles.noteCard}
      onPress={() => onNotePress(item.id)}
      accessibilityLabel={`Note: ${item.title}`}
      accessibilityRole="button"
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.voice_memo_url && (
          <Text style={styles.voiceIcon}>🎤</Text>
        )}
      </View>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.noteFooter}>
        <View style={styles.tags}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
        <Text style={styles.noteDate}>{formatDate(item.updated_at)}</Text>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load notes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* New Note Button */}
      <Pressable
        style={styles.newButton}
        onPress={onNewNote}
        accessibilityLabel="Create new note"
        accessibilityRole="button"
      >
        <Text style={styles.newButtonIcon}>📝</Text>
        <Text style={styles.newButtonText}>New Note</Text>
      </Pressable>

      {/* Notes List */}
      {data && data.notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗒️</Text>
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>
            Capture your thoughts and ideas
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.notes || []}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.inkBlue,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newButtonIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  newButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
  listContent: {
    padding: spacing.lg,
  },
  noteCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  noteTitle: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginRight: spacing.sm,
  },
  voiceIcon: {
    fontSize: 20,
  },
  noteContent: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
    color: colors.dustyCharcoal,
    marginBottom: spacing.md,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.softSage,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.inkBlue,
  },
  moreTagsText: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  noteDate: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.size.md,
    color: colors.warmGray,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
