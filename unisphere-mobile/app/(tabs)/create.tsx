import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BASE_URL } from '../../constants/Config';

const POST_TYPES = [
  { key: 'announcements', label: 'Announcement', icon: 'megaphone-outline', adminOnly: true },
  { key: 'events', label: 'Event', icon: 'calendar-outline', adminOnly: true },
  { key: 'lostfound', label: 'Lost & Found', icon: 'search-outline', adminOnly: false },
  { key: 'resources', label: 'Resource', icon: 'book-outline', adminOnly: false },
  { key: 'groups', label: 'Community', icon: 'people-outline', adminOnly: false },
  { key: 'courses', label: 'Course', icon: 'school-outline', adminOnly: false },
];



export default function CreatePostScreen() {
  const { userInfo, userToken } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [selectedType, setSelectedType] = useState('groups');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userInfo?.role === 'admin';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your post.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for your post.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('postType', selectedType);
      formData.append('title', title.trim());
      formData.append('description', description.trim());

      if (image) {
        const uri = image.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('image', { uri, name: filename, type });
      }

      const response = await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          // NOTE: Do NOT set Content-Type manually for multipart — axios auto-generates
          // the boundary. Setting it manually strips the boundary and breaks parsing.
        },
      });

      if (response.data.success) {
        Alert.alert('Posted!', 'Your post has been published successfully.', [{ text: 'OK' }]);
        setTitle('');
        setDescription('');
        setImage(null);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create post.');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      Alert.alert('Error', msg);
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.headerTitle}>Create Post</Text>
          <Text style={styles.headerSub}>Share with the UniSphere community</Text>

          {/* Category Selector */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {POST_TYPES.map((type) => {
              const disabled = type.adminOnly && !isAdmin;
              const active = selectedType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                    disabled && styles.categoryChipDisabled,
                  ]}
                  onPress={() => !disabled && setSelectedType(type.key)}
                  disabled={disabled}
                >
                  <Ionicons
                    name={type.icon}
                    size={18}
                    color={active ? (isDark ? '#121212' : '#FFF') : disabled ? colors.borderLight : colors.textSecondary}
                  />
                  <Text style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                    disabled && { color: colors.borderLight },
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Title */}
          <Text style={styles.sectionLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a title..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your post content..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          {/* Image Picker */}
          <Text style={styles.sectionLabel}>Image (Optional)</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                <Text style={styles.imageSelectedText}>Image selected</Text>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePickerInner}>
                <Ionicons name="image-outline" size={32} color={colors.textMuted} />
                <Text style={styles.imagePickerText}>Tap to select an image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={isDark ? '#121212' : '#FFF'} />
            ) : (
              <>
                <Ionicons name="send" size={18} color={isDark ? '#121212' : '#FFF'} style={{ marginRight: 8 }} />
                <Text style={styles.submitText}>Publish Post</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24, paddingBottom: 120 },
  headerTitle: { fontSize: 36, fontFamily: 'CormorantGaramond_600SemiBold_Italic', color: colors.text, marginBottom: 4 },
  headerSub: { fontSize: 13, fontFamily: 'Karla_400Regular', color: colors.textMuted, marginBottom: 32, letterSpacing: 1 },
  sectionLabel: {
    fontSize: 11, fontFamily: 'Karla_700Bold', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginTop: 12,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.borderLight,
  },
  categoryChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  categoryChipDisabled: { opacity: 0.4 },
  categoryChipText: { marginLeft: 8, color: colors.text, fontFamily: 'Karla_500Medium' },
  categoryChipTextActive: { color: isDark ? '#121212' : '#FFF', fontFamily: 'Karla_700Bold' },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingVertical: 12, fontSize: 18, fontFamily: 'CormorantGaramond_600SemiBold', color: colors.text, marginBottom: 20,
  },
  textArea: { height: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.borderLight, padding: 16 },
  imagePicker: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.border,
    padding: 32, alignItems: 'center', marginBottom: 32,
    borderStyle: 'dashed',
  },
  imagePickerInner: { alignItems: 'center' },
  imagePickerText: { color: colors.textMuted, marginTop: 12, fontFamily: 'Karla_400Regular', textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 },
  imagePreviewContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',
  },
  imageSelectedText: { color: colors.accent, fontFamily: 'Karla_700Bold', flex: 1, marginLeft: 12, textTransform: 'uppercase', letterSpacing: 1 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.text, paddingVertical: 18, marginTop: 16,
  },
  submitText: { color: colors.background, fontFamily: 'Karla_500Medium', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5 },
});
