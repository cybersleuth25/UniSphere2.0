import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {/* Background Orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.glassCard}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/Logo.jpg')} 
              style={{ width: 64, height: 64, borderRadius: 32 }} 
            />
          </View>
          <Text style={styles.title}>UniSphere</Text>
          <Text style={styles.subtitle}>Stay Updated. Stay Connected.</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="admin@unisphere.edu"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && { opacity: 0.7 }]}
            onPress={() => login(email, password)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.background} style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => router.push('/forgot-password')} style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Karla_500Medium', color: colors.text, textTransform: 'uppercase', letterSpacing: 1 }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            Powered by UniSphere
          </Text>

          <TouchableOpacity onPress={() => router.push('/signup')} style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Karla_400Regular', color: colors.textMuted }}>
              Don't have an account? <Text style={{ color: colors.text, fontFamily: 'Karla_700Bold' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orb1: {
    width: 300, height: 300,
    backgroundColor: isDark ? '#3A2E1C' : '#E7D5BA',
    opacity: 0.5,
    top: -80, left: -100,
  },
  orb2: {
    width: 200, height: 200,
    backgroundColor: isDark ? '#352121' : '#DECBCB',
    opacity: 0.4,
    bottom: 100, right: -80,
  },
  orb3: {
    width: 150, height: 150,
    backgroundColor: isDark ? '#3A2E1C20' : '#C49A4520',
    opacity: 0.6,
    bottom: -30, left: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  glassCard: {
    backgroundColor: colors.surface,
    padding: 40,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: isDark ? 'rgba(196,154,69,0.15)' : 'rgba(196,154,69,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    fontFamily: 'CormorantGaramond_600SemiBold_Italic',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Karla_500Medium',
    color: colors.textMuted,
    marginBottom: 32,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Karla_700Bold',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'CormorantGaramond_600SemiBold',
    color: colors.text,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    paddingVertical: 16,
    marginTop: 12,
  },
  buttonText: {
    color: colors.background,
    fontFamily: 'Karla_500Medium',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footerText: {
    marginTop: 32,
    fontSize: 11,
    fontFamily: 'Karla_400Regular',
    color: colors.border,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
