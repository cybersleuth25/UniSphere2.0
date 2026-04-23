import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const BASE_URL_FN = () => Platform.OS === 'web' ? 'http://localhost:8090' : 'http://192.168.29.43:8090';

export default function ForgotPasswordScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL_FN()}/auth/doForgotPassword`, null, {
        params: { email: email.trim() },
      });
      setSent(true);
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.orb, styles.orb1]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.glassCard}>
            {sent ? (
              <>
                <View style={styles.iconCircle}>
                  <Ionicons name="mail-open-outline" size={40} color={colors.accent} />
                </View>
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.description}>
                  If an account exists for {email}, you'll receive a password reset link shortly.
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => router.back()} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconCircle}>
                  <Ionicons name="key-outline" size={40} color={colors.accent} />
                </View>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.description}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={{ marginRight: 10 }} />
                    <TextInput style={styles.input} value={email} onChangeText={setEmail}
                      placeholder="your@email.com" placeholderTextColor={colors.textMuted}
                      keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && { opacity: 0.7 }]}
                  onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.8}>
                  {isSubmitting ? <ActivityIndicator color={colors.background} /> : (
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  orb: { position: 'absolute', borderRadius: 9999 },
  orb1: { width: 250, height: 250, backgroundColor: isDark ? '#3A2E1C' : '#E7D5BA', opacity: 0.4, top: -60, right: -80 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  backBtn: { position: 'absolute', top: 16, left: 24, zIndex: 10 },
  glassCard: {
    backgroundColor: colors.surface, padding: 40,
    borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center',
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(196,154,69,0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 32, fontFamily: 'CormorantGaramond_600SemiBold_Italic', color: colors.text, marginBottom: 8, letterSpacing: 0.5 },
  description: { fontSize: 13, fontFamily: 'Karla_400Regular', color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 32, letterSpacing: 0.5 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 11, fontFamily: 'Karla_700Bold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent',
    borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingHorizontal: 0, paddingVertical: 4,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text },
  button: {
    width: '100%', backgroundColor: colors.text, paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: colors.background, fontFamily: 'Karla_500Medium', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5 },
});
