import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../constants/Config';



export default function CommentsModal({ postId, visible, onClose }) {
  const { userToken, userInfo } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/posts/comments`, {
        params: { postId },
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setComments(response.data || []);
    } catch (e) {
      console.log('Error fetching comments', e);
    }
    setIsLoading(false);
  };

  const sendComment = async () => {
    if (!newComment.trim()) return;
    setIsSending(true);
    try {
      await axios.post(`${BASE_URL}/api/posts/comments`, null, {
        params: { postId, commentContent: newComment.trim() },
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setNewComment('');
      fetchComments();
    } catch (e) {
      console.log('Error sending comment', e);
    }
    setIsSending(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheet}>
        {/* Handle Bar */}
        <View style={styles.handleBar} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.commentsList}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image
                  source={{ uri: `https://api.dicebear.com/9.x/micah/png?seed=${item.author || 'user'}&backgroundColor=transparent&size=60` }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{item.author || 'Anonymous'}</Text>
                  <Text style={styles.commentText}>{item.content}</Text>
                  <Text style={styles.commentTime}>{item.timeAgo || 'Just now'}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.borderLight} />
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubtext}>Be the first to share your thoughts!</Text>
              </View>
            }
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <Image
            source={{ uri: `https://api.dicebear.com/9.x/micah/png?seed=${userInfo?.email || 'me'}&backgroundColor=transparent&size=60` }}
            style={styles.myAvatar}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textMuted}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!newComment.trim() || isSending) && { opacity: 0.4 }]}
            onPress={sendComment}
            disabled={!newComment.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={isDark ? '#121212' : '#FFF'} />
            ) : (
              <Ionicons name="send" size={18} color={isDark ? '#121212' : '#FFF'} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'flex-end', zIndex: 100,
  },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '75%', minHeight: '40%',
  },
  handleBar: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  commentsList: { padding: 16 },
  commentItem: { flexDirection: 'row', marginBottom: 16 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? '#3A2E1C' : '#E7D5BA', marginRight: 10 },
  commentBubble: {
    flex: 1, backgroundColor: colors.surface,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  commentAuthor: { fontWeight: '600', color: colors.text, fontSize: 13, marginBottom: 4 },
  commentText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  commentTime: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textMuted, marginTop: 12 },
  emptySubtext: { fontSize: 13, color: colors.border, marginTop: 4 },
  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1, borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  myAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: isDark ? '#3A2E1C' : '#E7D5BA', marginRight: 10 },
  input: {
    flex: 1, backgroundColor: colors.surfaceSolid,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: colors.text, maxHeight: 80,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  },
});
