/**
 * Study Screen - Drafts and Notes
 */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { DraftsList } from '@/components/study/DraftsList';
import { NotesList } from '@/components/study/NotesList';
import { colors, spacing, typography } from '@/theme';

type Tab = 'drafts' | 'notes';

export default function StudyScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const router = useRouter();

  const handleDraftPress = (draftId: string) => {
    router.push(`/draft/${draftId}`);
  };

  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleNewDraft = () => {
    router.push('/draft/new');
  };

  const handleNewNote = () => {
    router.push('/note/new');
  };

  const handleCompose = () => {
    router.push('/compose');
  };

  return (
    <View style={styles.container}>
      {/* Header with Compose Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study</Text>
        <Pressable
          style={styles.composeButton}
          onPress={handleCompose}
          accessibilityLabel="Compose new chapter"
        >
          <Text style={styles.composeButtonText}>✨ Compose</Text>
        </Pressable>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'drafts' && styles.tabActive]}
          onPress={() => setActiveTab('drafts')}
          accessibilityLabel="Drafts"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'drafts' }}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'drafts' && styles.tabTextActive
          ]}>
            Drafts
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
          onPress={() => setActiveTab('notes')}
          accessibilityLabel="Notes"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'notes' }}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'notes' && styles.tabTextActive
          ]}>
            Note Nook
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'drafts' ? (
        <DraftsList
          onDraftPress={handleDraftPress}
          onNewDraft={handleNewDraft}
        />
      ) : (
        <NotesList
          onNotePress={handleNotePress}
          onNewNote={handleNewNote}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.paperWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
  },
  composeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.muse,
    borderRadius: 8,
  },
  composeButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.paperWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.inkBlue,
  },
  tabText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  tabTextActive: {
    color: colors.inkBlue,
  },
});
