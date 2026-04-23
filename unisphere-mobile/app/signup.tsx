import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../constants/Config';

const BRANCHES = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Information Technology', 'Other'];



export default function SignupScreen() {
  const { setSession } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [semester, setSemester] = useState('1');
  const [showPassword, setShowPassword] = useState(false);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/doSignup`, null, {
        params: {
          newUsername: username.trim(),
          newEmail: email.trim(),
          newPassword: password,
          branch: branch,
          semester: parseInt(semester) || 1,
        },
      });

      if (response.data.success && response.data.token) {
        // Use AuthContext's setSession to update in-memory state + persist to storage
        await setSession(response.data.token, response.data.user);

        Alert.alert('Welcome!', 'Your account has been created.', [
          { text: 'OK', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Signup failed.');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      Alert.alert('Error', msg);
    }
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.glassCard}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add-outline" size={36} color={colors.accent} />
            </View>
            <Text style={styles.title}>Join UniSphere</Text>
            <Text style={styles.subtitle}>Create your account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.textMuted}
                  value={username} onChangeText={setUsername} autoCapitalize="words" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="you@university.edu" placeholderTextColor={colors.textMuted}
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                  value={email} onChangeText={setEmail} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Min 6 characters" placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch</Text>
              <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowBranchPicker(!showBranchPicker)}>
                <Ionicons name="school-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <Text style={styles.pickerText}>{branch}</Text>
                <Ionicons name={showBranchPicker ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
              {showBranchPicker && (
                <View style={styles.branchList}>
                  {BRANCHES.map((b) => (
                    <TouchableOpacity key={b} style={[styles.branchItem, branch === b && styles.branchItemActive]}
                      onPress={() => { setBranch(b); setShowBranchPicker(false); }}>
                      <Text style={[styles.branchItemText, branch === b && { color: colors.text, fontFamily: 'Karla_700Bold' }]}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Semester</Text>
              <View style={styles.semesterRow}>
                {['1','2','3','4','5','6','7','8'].map((s) => (
                  <TouchableOpacity key={s}
                    style={[styles.semesterChip, semester === s && styles.semesterChipActive]}
                    onPress={() => setSemester(s)}>
                    <Text style={[styles.semesterText, semester === s && { color: isDark ? '#121212' : '#FFF' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSignup} disabled={isSubmitting} activeOpacity={0.8}>
              {isSubmitting ? <ActivityIndicator color={colors.background} /> : (
                <>
                  <Text style={styles.buttonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.background} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
              <Text style={styles.linkText}>Already have an account? <Text style={{ color: colors.text, fontFamily: 'Karla_700Bold' }}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  orb: { position: 'absolute', borderRadius: 9999 },
  orb1: { width: 250, height: 250, backgroundColor: isDark ? '#3A2E1C' : '#E7D5BA', opacity: 0.5, top: -60, right: -80 },
  orb2: { width: 200, height: 200, backgroundColor: isDark ? '#352121' : '#DECBCB', opacity: 0.4, bottom: -40, left: -60 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  glassCard: {
    backgroundColor: colors.surface, padding: 40,
    borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center',
  },
  logoContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(196,154,69,0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 36, fontFamily: 'CormorantGaramond_600SemiBold_Italic', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 11, fontFamily: 'Karla_500Medium', color: colors.textMuted, marginBottom: 24, letterSpacing: 1.5, textTransform: 'uppercase' },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 11, fontFamily: 'Karla_700Bold', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent',
    borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingHorizontal: 0, paddingVertical: 4,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text },
  pickerText: { flex: 1, paddingVertical: 12, fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text },
  branchList: {
    backgroundColor: colors.surfaceSolid, marginTop: 6,
    borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden',
  },
  branchItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  branchItemActive: { backgroundColor: 'rgba(196,154,69,0.1)' },
  branchItemText: { fontSize: 14, fontFamily: 'Karla_400Regular', color: colors.textSecondary },
  semesterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  semesterChip: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.borderLight,
  },
  semesterChipActive: { backgroundColor: colors.accent },
  semesterText: { fontFamily: 'Karla_700Bold', color: colors.textSecondary },
  button: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.text, paddingVertical: 16, marginTop: 12,
  },
  buttonText: { color: colors.background, fontFamily: 'Karla_500Medium', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' },
  linkText: { fontSize: 13, fontFamily: 'Karla_400Regular', color: colors.textMuted },
});
