import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../constants/Config';



export default function EditProfileScreen() {
  const { userInfo, userToken, logout } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [username, setUsername] = useState(userInfo?.username || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [bio, setBio] = useState(userInfo?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await axios.post(`${BASE_URL}/profile/update`, null, {
        params: { username: username.trim(), email: email.trim(), bio: bio.trim() },
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.data.success) {
        Alert.alert('Updated!', 'Your profile has been updated.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update.');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      Alert.alert('Error', msg);
    }
    setIsSaving(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Form */}
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput style={styles.input} value={username} onChangeText={setUsername}
                  placeholder="Your name" placeholderTextColor={colors.textMuted} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput style={styles.input} value={email} onChangeText={setEmail}
                  placeholder="your@email.com" placeholderTextColor={colors.textMuted}
                  keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
                <Ionicons name="document-text-outline" size={20} color={colors.textMuted} style={{ marginRight: 10, marginTop: 14 }} />
                <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={bio} onChangeText={setBio} multiline
                  placeholder="Tell us about yourself..." placeholderTextColor={colors.textMuted} />
              </View>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
            onPress={handleSave} disabled={isSaving} activeOpacity={0.8}>
            {isSaving ? <ActivityIndicator color={colors.background} /> : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity style={styles.dangerBtn} onPress={() => {
              Alert.alert('Log Out', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout },
              ]);
            }}>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.dangerBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24, paddingBottom: 80 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 28,
  },
  headerTitle: { fontSize: 24, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text },
  card: {
    backgroundColor: 'transparent', padding: 20,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: 20,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontFamily: 'Karla_700Bold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent',
    borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingHorizontal: 0, paddingVertical: 4,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text },
  saveBtn: {
    backgroundColor: colors.text, paddingVertical: 16,
    alignItems: 'center', marginBottom: 32,
  },
  saveBtnText: { color: colors.background, fontFamily: 'Karla_500Medium', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 13 },
  dangerZone: {
    backgroundColor: 'transparent', padding: 20,
    borderWidth: 1, borderColor: isDark ? 'rgba(255, 107, 129, 0.3)' : 'rgba(107,16,26,0.3)',
  },
  dangerTitle: { fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.error, marginBottom: 12 },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent',
    borderWidth: 1, borderColor: isDark ? 'rgba(255, 107, 129, 0.6)' : 'rgba(107,16,26,0.6)',
    padding: 14, justifyContent: 'center'
  },
  dangerBtnText: { color: colors.error, fontFamily: 'Karla_700Bold', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
