/**
 * Send BTL Invite Modal
 * 
 * Modal for sending Between the Lines invitations
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSendInvite } from '@/hooks/useBTL';
import { colors, spacing, typography } from '@/theme';

interface SendInviteModalProps {
  visible: boolean;
  onClose: () => void;
  recipientId: string;
  recipientUsername: string;
}

export const SendInviteModal: React.FC<SendInviteModalProps> = ({
  visible,
  onClose,
  recipientId,
  recipientUsername,
}) => {
  const [note, setNote] = useState('');
  const [quotedLine, setQuotedLine] = useState('');
  const sendMutation = useSendInvite();

  const handleSend = async () => {
    if (!note.trim() && !quotedLine.trim()) {
      Alert.alert('Required', 'Please add a note or quote a line from their writing.');
      return;
    }

    try {
      await sendMutation.mutateAsync({
        recipient_id: recipientId,
        note: note.trim() || undefined,
        quoted_line: quotedLine.trim() || undefined,
      });

      Alert.alert(
        'Invitation Sent',
        `Your invitation to ${recipientUsername} has been sent.`
      );
      setNote('');
      setQuotedLine('');
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to send invitation';
      Alert.alert('Error', message);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Invite to Connect</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.recipientText}>
              Inviting <Text style={styles.recipientName}>{recipientUsername}</Text>
            </Text>

            <Text style={styles.label}>Quote a line (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="A line from their writing that resonated..."
              placeholderTextColor={colors.warmGray}
              value={quotedLine}
              onChangeText={setQuotedLine}
              multiline
              maxLength={200}
            />

            <Text style={styles.label}>Personal note (optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Why you'd like to connect..."
              placeholderTextColor={colors.warmGray}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={300}
            />

            <Text style={styles.hint}>
              At least one field is required. This is an intimate space - be thoughtful.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.sendButton]}
              onPress={handleSend}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <ActivityIndicator size="small" color={colors.paperWhite} />
              ) : (
                <Text style={styles.sendButtonText}>Send Invitation</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.paperWhite,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.inkBlue,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.dustyCharcoal,
  },
  content: {
    padding: spacing.lg,
  },
  recipientText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
    marginBottom: spacing.lg,
  },
  recipientName: {
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    fontSize: typography.size.md,
    color: colors.inkBlue,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmGray,
    minHeight: 60,
  },
  noteInput: {
    minHeight: 100,
  },
  hint: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.warmGray,
  },
  cancelButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.dustyCharcoal,
  },
  sendButton: {
    backgroundColor: colors.btl,
  },
  sendButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.paperWhite,
  },
});
