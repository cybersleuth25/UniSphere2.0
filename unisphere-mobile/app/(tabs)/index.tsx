import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, TextInput, RefreshControl, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BASE_URL } from '../../constants/Config';
import CommentsModal from '../../components/CommentsModal';

const TABS = ['Announcements', 'Events', 'Lost & Found', 'Resource', 'Community', 'Courses'];


export default function HomeScreen() {
  const { userInfo, userToken } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [activeTab, setActiveTab] = useState('Announcements');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [commentPostId, setCommentPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      let backendType = activeTab.toLowerCase().replace(' & ', '').replace(' ', '');
      if (backendType === 'community') backendType = 'groups';
      if (backendType === 'resource') backendType = 'resources';

      const url = searchText.trim()
        ? `${BASE_URL}/api/posts?postType=${backendType}&search=${encodeURIComponent(searchText)}`
        : `${BASE_URL}/api/posts?postType=${backendType}`;

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setPosts(response.data || []);
    } catch (e) {
      console.log('Error fetching posts', e);
    }
    setIsLoading(false);
  }, [activeTab, searchText, userToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const likePost = async (postId) => {
    // Optimistic UI update
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: (p.likes || 0) + (likedPosts[postId] ? -1 : 1) } : p
    ));
    try {
      await axios.post(`${BASE_URL}/api/posts/like`, null, {
        params: { likePostId: postId },
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
    } catch (e) {
      // Revert on failure
      setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
      fetchPosts();
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        Alert.alert('Error', response.data.message || 'Could not delete.');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      Alert.alert('Error', msg);
    }
  };

  const handlePostLongPress = (item) => {
    const isOwner = item.author === userInfo?.email || item.author === userInfo?.username;
    const isAdmin = userInfo?.role === 'admin';

    const buttons = [{ text: 'Cancel', style: 'cancel' }];

    buttons.push({
      text: 'Share',
      onPress: () => Share.share({ message: `${item.title}\n\n${item.description}\n\n— UniSphere` }),
    });

    if (isOwner || isAdmin) {
      buttons.push({
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deletePost(item.id) },
          ]);
        },
      });
    }

    Alert.alert(item.title, 'Choose an action', buttons);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.9}
      onLongPress={() => handlePostLongPress(item)}
      delayLongPress={500}
    >
      <View style={styles.postHeader}>
        <Image
          source={{ uri: `https://api.dicebear.com/9.x/micah/png?seed=${item.author || 'user'}&backgroundColor=transparent&size=80` }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{item.author || 'Unknown'}</Text>
          <Text style={styles.date}>{item.date || 'Just now'}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.postType}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDesc} numberOfLines={4}>{item.description}</Text>

      {item.image && (
        <Image
          style={styles.postImage}
          source={{ uri: `${BASE_URL}/${item.image}` }}
          resizeMode="cover"
        />
      )}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => likePost(item.id)}>
          <Ionicons
            name={likedPosts[item.id] ? 'heart' : 'heart-outline'}
            size={20}
            color="#E74C3C"
          />
          <Text style={styles.actionText}>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => { setCommentPostId(item.id); setShowComments(true); }}>
          <Ionicons name="chatbubble-outline" size={20} color="#3498DB" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() =>
          Share.share({ message: `${item.title}\n\n${item.description}\n\n— UniSphere` })
        }>
          <Ionicons name="share-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image style={styles.headerLogoImage} source={require('../../assets/images/Logo.jpg')} />
          <Text style={styles.logo}>UniSphere</Text>
        </View>
        <TouchableOpacity style={styles.headerRight} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={fetchPosts}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scrollable Horizontal Tabs */}
      <View style={{ height: 50 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TABS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item && styles.activeTab]}
              onPress={() => setActiveTab(item)}
            >
              <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPosts} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>No posts found</Text>
              <Text style={styles.emptySubtext}>Be the first to share something!</Text>
            </View>
          ) : null
        }
      />

      {/* Comments Bottom Sheet */}
      <CommentsModal
        postId={commentPostId}
        visible={showComments}
        onClose={() => { setShowComments(false); setCommentPostId(null); }}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { padding: 4 },
  headerLogoImage: { width: 32, height: 32, borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: colors.borderLight },
  logo: { fontSize: 28, fontFamily: 'CormorantGaramond_700Bold', color: colors.text, letterSpacing: 0, textTransform: 'uppercase' },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 16 },
  searchBar: {
    flexDirection: 'row', backgroundColor: 'transparent',
    padding: 10, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Karla_400Regular', color: colors.text },

  tabsContainer: { paddingHorizontal: 16, alignItems: 'center' },
  tab: {
    paddingHorizontal: 12, paddingVertical: 8,
    marginRight: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: colors.text },
  tabText: { color: colors.textSecondary, fontFamily: 'Karla_500Medium', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  activeTabText: { color: colors.text, fontFamily: 'Karla_700Bold' },

  feedContainer: { padding: 16, paddingBottom: 100 },

  postCard: {
    backgroundColor: colors.surface,
    padding: 24, marginBottom: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: isDark ? '#2A2A2A' : '#E7D5BA', borderWidth: 1, borderColor: colors.accent },
  author: { fontFamily: 'Karla_700Bold', color: colors.text, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  date: { fontSize: 11, fontFamily: 'Karla_400Regular', color: colors.textMuted, marginTop: 2 },
  typeBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.accent,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 0,
  },
  typeBadgeText: { fontSize: 10, color: colors.accent, fontFamily: 'Karla_700Bold', textTransform: 'uppercase', letterSpacing: 1 },
  postTitle: { fontSize: 24, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text, marginBottom: 8, lineHeight: 28 },
  postDesc: { color: colors.textSecondary, fontFamily: 'Karla_400Regular', lineHeight: 24, marginBottom: 16, fontSize: 15 },
  postImage: { width: '100%', height: 240, marginTop: 4, marginBottom: 16, borderWidth: 1, borderColor: colors.borderLight },

  actionBar: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: colors.borderLight,
    paddingTop: 16, marginTop: 4,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  actionText: { marginLeft: 8, color: colors.textSecondary, fontFamily: 'Karla_500Medium', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 24, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, fontFamily: 'Karla_400Regular', color: colors.textMuted, marginTop: 8 },
});
