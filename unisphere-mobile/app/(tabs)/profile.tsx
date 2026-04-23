import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { userInfo, logout } = useAuth();
  const { colors, isDark, themeType, setThemeType } = useTheme();
  const styles = getStyles(colors, isDark);

  if (!userInfo) return null;

  const avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=${userInfo.email}&backgroundColor=transparent&size=200`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my UniSphere profile! I'm ${userInfo.username} on UniSphere.`,
      });
    } catch (e) {}
  };

  const menuItems = [
    {
      icon: 'person-outline', label: 'Edit Profile', color: colors.accent,
      onPress: () => router.push('/edit-profile'),
    },
    {
      icon: 'key-outline', label: 'Change Password', color: '#3498DB',
      onPress: () => router.push('/forgot-password'),
    },
    {
      icon: isDark ? 'sunny-outline' : 'moon-outline', 
      label: themeType === 'system' ? 'Theme: System' : (themeType === 'dark' ? 'Theme: Dark' : 'Theme: Light'), 
      color: '#9B59B6',
      onPress: () => {
        if (themeType === 'system') setThemeType('light');
        else if (themeType === 'light') setThemeType('dark');
        else setThemeType('system');
      }
    },
    {
      icon: 'share-social-outline', label: 'Share Profile', color: '#27AE60',
      onPress: handleShare,
    },
    {
      icon: 'information-circle-outline', label: 'About UniSphere', color: '#666',
      onPress: () => Alert.alert('UniSphere', 'Version 1.0.0\nBuilt with React Native + Grails\n\nA campus social platform for students.')
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.goldRing} />
          </View>

          <Text style={styles.name}>{userInfo.username}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>

          <View style={styles.roleBadge}>
            <Ionicons
              name={userInfo.role === 'admin' ? 'shield-checkmark' : 'school'}
              size={14}
              color={colors.accent}
            />
            <Text style={styles.roleText}>
              {userInfo.role === 'admin' ? 'Administrator' : 'Student'}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/edit-profile')}>
              <Ionicons name="create-outline" size={18} color={colors.accent} />
              <Text style={styles.quickBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color={colors.accent} />
              <Text style={styles.quickBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7} onPress={item.onPress}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}
          onPress={() => {
            Alert.alert('Log Out', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: logout },
            ]);
          }}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>UniSphere Mobile v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24, paddingBottom: 120 },

  profileCard: {
    backgroundColor: colors.surface,
    padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.borderLight,
    marginBottom: 20,
  },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  goldRing: {
    position: 'absolute', top: -6, left: -6, right: -6, bottom: -6,
    borderRadius: 60, borderWidth: 1, borderColor: colors.accent,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: isDark ? '#2A2A2A' : '#E7D5BA' },
  name: { fontSize: 32, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text, marginBottom: 4, letterSpacing: 0.5 },
  email: { fontSize: 13, fontFamily: 'Karla_400Regular', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.text,
    paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 16,
  },
  roleText: { color: colors.text, fontFamily: 'Karla_700Bold', fontSize: 11, marginLeft: 6, textTransform: 'uppercase', letterSpacing: 1.5 },

  quickActions: { flexDirection: 'row', gap: 12 },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  quickBtnText: { color: colors.text, fontFamily: 'Karla_500Medium', fontSize: 11, marginLeft: 6, textTransform: 'uppercase', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: 'transparent',
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: colors.borderLight,
  },
  statNumber: { fontSize: 28, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.accent },
  statLabel: { fontSize: 11, fontFamily: 'Karla_500Medium', color: colors.textSecondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },

  menuSection: {
    backgroundColor: colors.surface,
    marginBottom: 24, paddingHorizontal: 24, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
    borderWidth: 1, borderColor: 'transparent',
  },
  menuLabel: { flex: 1, fontSize: 13, fontFamily: 'Karla_500Medium', color: colors.text, textTransform: 'uppercase', letterSpacing: 1 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.error,
    paddingVertical: 16,
  },
  logoutText: { color: colors.error, fontFamily: 'Karla_700Bold', fontSize: 13, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 2 },

  version: { textAlign: 'center', color: colors.textMuted, fontSize: 11, fontFamily: 'Karla_400Regular', textTransform: 'uppercase', letterSpacing: 2, marginTop: 32 },
});
