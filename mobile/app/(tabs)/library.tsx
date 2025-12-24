/**
 * Library Screen - Bookshelf, New Chapters, and Quiet Picks
 */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookshelf } from '@/components/library/Bookshelf';
import { NewChapters } from '@/components/library/NewChapters';
import { QuietPicks } from '@/components/library/QuietPicks';
import { colors, spacing, typography } from '@/theme';

type Tab = 'bookshelf' | 'new' | 'picks';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('bookshelf');
  const router = useRouter();

  const handleBookPress = (bookId: string) => {
    // TODO: Navigate to Book screen when implemented
    console.log('Navigate to book:', bookId);
  };

  const handleChapterPress = (chapterId: string) => {
    router.push(`/chapter/${chapterId}`);
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'bookshelf' && styles.tabActive]}
          onPress={() => setActiveTab('bookshelf')}
          accessibilityLabel="Bookshelf"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'bookshelf' }}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'bookshelf' && styles.tabTextActive
          ]}>
            Bookshelf
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'new' && styles.tabActive]}
          onPress={() => setActiveTab('new')}
          accessibilityLabel="New Chapters"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'new' }}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'new' && styles.tabTextActive
          ]}>
            New
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'picks' && styles.tabActive]}
          onPress={() => setActiveTab('picks')}
          accessibilityLabel="Quiet Picks"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'picks' }}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'picks' && styles.tabTextActive
          ]}>
            Quiet Picks
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'bookshelf' && (
        <Bookshelf onBookPress={handleBookPress} />
      )}
      {activeTab === 'new' && (
        <NewChapters onChapterPress={handleChapterPress} />
      )}
      {activeTab === 'picks' && (
        <QuietPicks onChapterPress={handleChapterPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
