import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BASE_URL } from '../../constants/Config';



export default function NotificationsScreen() {
  const { userToken } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setNotifications(response.data || []);
    } catch (e) {
      console.log('Error fetching notifications', e);
    }
    setIsLoading(false);
  }, [userToken]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/notifications/markRead`, null, {
        params: { id },
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.log('Error marking notification as read', e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'mention': return 'at';
      default: return 'notifications';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'like': return colors.error;
      case 'comment': return '#3498DB';
      case 'mention': return colors.accent;
      default: return colors.textMuted;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.isRead && styles.notifUnread]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { borderColor: getIconColor(item.type) }]}>
        <Ionicons name={getIcon(item.type)} size={20} color={getIconColor(item.type)} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifMessage}>{item.message}</Text>
        <Text style={styles.notifTime}>{item.timeAgo || 'Just now'}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Text style={styles.headerCount}>
          {notifications.filter(n => !n.isRead).length} unread
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color={colors.borderLight} />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: 28, fontFamily: 'CormorantGaramond_700Bold', color: colors.text, textTransform: 'uppercase' },
  headerCount: { fontSize: 11, fontFamily: 'Karla_700Bold', color: colors.accent, textTransform: 'uppercase', letterSpacing: 1 },
  listContainer: { padding: 16, paddingBottom: 100 },
  notifCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 24, marginBottom: 16,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  notifUnread: {
    backgroundColor: colors.surfaceSolid,
    borderColor: colors.accent,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 0,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
    borderWidth: 1, backgroundColor: 'transparent',
  },
  notifContent: { flex: 1 },
  notifMessage: { fontSize: 15, fontFamily: 'Karla_500Medium', color: colors.text, lineHeight: 22 },
  notifTime: { fontSize: 11, fontFamily: 'Karla_400Regular', color: colors.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 0, backgroundColor: colors.accent, marginLeft: 12,
  },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 24, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, fontFamily: 'Karla_400Regular', color: colors.textSecondary, marginTop: 8 },
});
