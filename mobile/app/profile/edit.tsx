/**
 * Edit Profile Screen
 * 
 * Edit Book profile (bio and privacy settings)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMyBook, useUpdateBook } from '@/hooks/useBooks';
import { colors, spacing, typography } from '@/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: book, isLoading } = useGetMyBook();
  const updateMutation = useUpdateBook(book?.id || '');

  const [bio, setBio] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (book) {
      setBio(book.bio || '');
      setIsPrivate(book.is_private);
    }
  }, [book]);

  const handleSave = async () => {
    if (!book) return;

    try {
      await updateMutation.mutateAsync({
        bio: bio.trim() || undefined,
        is_private: isPrivate,
      });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          disabled={updateMutation.isPending}
          accessibilityLabel="Save changes"
        >
          <Text style={styles.saveButtonText}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Username (Read-only) */}
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{book.username}</Text>
          </View>
          <Text style={styles.hint}>Username cannot be changed</Text>
        </View>

        {/* Bio */}
        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell readers about yourself..."
            placeholderTextColor={colors.warmGray}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/300</Text>
        </View>

        {/* Privacy Setting */}
        <View style={styles.field}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Private Book</Text>
              <Text style={styles.switchDescription}>
                Only followers can see your chapters
              </Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.warmGray, true: colors.inkBlue }}
              thumbColor={colors.paperWhite}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Privacy</Text>
          <Text style={styles.infoText}>
            • Public Books: Anyone can read your chapters{'\n'}
            • Private Books: Only followers can access{'\n'}
            • Changes take effect immediately{'\n'}
            • Your profile is always visible
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.inkBlue,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  readOnlyField: {
    padding: spacing.md,
    backgroundColor: colors.warmGray,
    borderRadius: 8,
  },
  readOnlyText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  hint: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    marginTop: spacing.xs,
  },
  bioInput: {
    fontSize: typography.size.md,
    color: colors.inkBlue,
    backgroundColor: colors.paperWhite,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    minHeight: 120,
  },
  charCount: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
  },
  infoBox: {
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    marginTop: spacing.md,
  },
  infoTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    lineHeight: typography.size.sm * 1.6,
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
