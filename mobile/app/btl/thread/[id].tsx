/**
 * BTL Thread Screen
 * 
 * Intimate conversation between two readers
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useGetMessages,
  useSendMessage,
  useCloseThread,
  useGetPins,
  useGetThreads,
} from '@/hooks/useBTL';
import { colors, spacing, typography } from '@/theme';

export default function BTLThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messageText, setMessageText] = useState('');
  const [showPins, setShowPins] = useState(false);

  const { data: threads } = useGetThreads();
  const { data: messages, isLoading, error } = useGetMessages(id);
  const { data: pins } = useGetPins(id);
  const sendMutation = useSendMessage(id);
  const closeMutation = useCloseThread();

  const thread = threads?.find(t => t.id === id);
  const isClosed = thread?.status === 'closed';
  const otherParticipant = thread?.participants[0];

  useEffect(() => {
    // Scroll to bottom when messages load
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || isClosed) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      await sendMutation.mutateAsync({ content: text });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      Alert.alert('Error', 'Failed to send message');
      setMessageText(text); // Restore message
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Close Conversation',
      'This will end the conversation. Neither of you will be able to send new messages. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              await closeMutation.mutateAsync(id);
              Alert.alert('Conversation Closed', 'This thread is now closed.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err) {
              Alert.alert('Error', 'Failed to close conversation');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.inkBlue} />
      </View>
    );
  }

  if (error || !thread) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load conversation</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.participantName}>{otherParticipant?.username}</Text>
          {isClosed && <Text style={styles.closedBadge}>Closed</Text>}
        </View>
        <Pressable
          style={styles.menuButton}
          onPress={() => setShowPins(!showPins)}
          accessibilityLabel="Toggle pins"
        >
          <Text style={styles.menuButtonText}>📌</Text>
        </Pressable>
      </View>

      {/* Pins Panel */}
      {showPins && (
        <View style={styles.pinsPanel}>
          <Text style={styles.pinsPanelTitle}>Pinned Excerpts</Text>
          {pins && pins.length > 0 ? (
            pins.map((pin) => (
              <View key={pin.id} style={styles.pinCard}>
                <Text style={styles.pinChapterTitle}>{pin.chapter_title}</Text>
                <Text style={styles.pinExcerpt}>"{pin.excerpt}"</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noPinsText}>No pinned excerpts yet</Text>
          )}
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContainer}
      >
        {messages && messages.length > 0 ? (
          messages.map((message, index) => {
            const isOwn = message.sender_username !== otherParticipant?.username;
            const showDate =
              index === 0 ||
              new Date(messages[index - 1].created_at).toDateString() !==
                new Date(message.created_at).toDateString();

            return (
              <View key={message.id}>
                {showDate && (
                  <View style={styles.dateDivider}>
                    <Text style={styles.dateText}>
                      {new Date(message.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageContainer,
                    isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isOwn ? styles.ownMessageText : styles.otherMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        isOwn ? styles.ownMessageTime : styles.otherMessageTime,
                      ]}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyMessagesText}>
              Start your intimate reading conversation
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      {!isClosed ? (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.warmGray}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || sendMutation.isPending}
            accessibilityLabel="Send message"
          >
            <Text style={styles.sendButtonText}>
              {sendMutation.isPending ? '...' : '→'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.closeThreadButton}
            onPress={handleClose}
            accessibilityLabel="Close conversation"
          >
            <Text style={styles.closeThreadButtonText}>Close</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.closedBar}>
          <Text style={styles.closedBarText}>This conversation is closed</Text>
        </View>
      )}
    </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  participantName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.inkBlue,
  },
  closedBadge: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 20,
  },
  pinsPanel: {
    backgroundColor: colors.paperWhite,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmGray,
    maxHeight: 200,
  },
  pinsPanelTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.dustyCharcoal,
    marginBottom: spacing.sm,
  },
  pinCard: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  pinChapterTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.warmGray,
    marginBottom: spacing.xs,
  },
  pinExcerpt: {
    fontSize: typography.size.sm,
    color: colors.dustyCharcoal,
    fontStyle: 'italic',
  },
  noPinsText: {
    fontSize: typography.size.sm,
    color: colors.warmGray,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  messages: {
    flex: 1,
  },
  messagesContainer: {
    padding: spacing.lg,
  },
  emptyMessages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyMessagesText: {
    fontSize: typography.size.md,
    color: colors.warmGray,
    textAlign: 'center',
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dateText: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
    backgroundColor: colors.paperWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  messageContainer: {
    marginBottom: spacing.sm,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: 16,
  },
  ownMessageBubble: {
    backgroundColor: colors.btl,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.paperWhite,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.5,
  },
  ownMessageText: {
    color: colors.paperWhite,
  },
  otherMessageText: {
    color: colors.inkBlue,
  },
  messageTime: {
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
  },
  ownMessageTime: {
    color: 'rgba(250, 248, 244, 0.7)',
  },
  otherMessageTime: {
    color: colors.warmGray,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.paperWhite,
    borderTopWidth: 1,
    borderTopColor: colors.warmGray,
  },
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.inkBlue,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.btl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
    color: colors.paperWhite,
  },
  closeThreadButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  closeThreadButtonText: {
    fontSize: typography.size.xs,
    color: colors.warmGray,
  },
  closedBar: {
    padding: spacing.lg,
    backgroundColor: colors.warmGray,
    alignItems: 'center',
  },
  closedBarText: {
    fontSize: typography.size.md,
    color: colors.dustyCharcoal,
  },
  errorText: {
    fontSize: typography.size.lg,
    color: colors.dustyCharcoal,
  },
});
