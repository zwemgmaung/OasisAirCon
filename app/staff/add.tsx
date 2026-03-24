import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import { POSITIONS, LOGO_URL } from '../../constants/config';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SelectModal from '../../components/ui/SelectModal';

export default function AddStaffScreen() {
  const { settings, addStaff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [photo, setPhoto] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPosition, setShowPosition] = useState(false);

  const pickPhoto = async () => {
    Alert.alert(t.staffPhoto, '', [
      { text: t.takePhoto, onPress: async () => {
        const r = await ImagePicker.launchCameraAsync({ quality: 0.7, aspect: [1, 1], allowsEditing: true });
        if (!r.canceled && r.assets[0]) setPhoto(r.assets[0].uri);
      }},
      { text: t.chooseGallery, onPress: async () => {
        const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, aspect: [1, 1], allowsEditing: true });
        if (!r.canceled && r.assets[0]) setPhoto(r.assets[0].uri);
      }},
      { text: t.cancel, style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert(t.error, 'Staff name is required.'); return; }
    if (!position) { Alert.alert(t.error, 'Please select a position.'); return; }
    setSaving(true);
    await addStaff({ name, phone, address, position, photo, notes });
    setSaving(false);
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={t.addStaff} showBack isDark={isDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickPhoto}>
              <Image
                source={photo ? { uri: photo } : { uri: LOGO_URL }}
                style={[styles.avatar, { borderColor: C.border }]}
                contentFit="cover"
                transition={200}
              />
              <View style={[styles.photoOverlay, { backgroundColor: C.primary }]}>
                <MaterialIcons name="camera-alt" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.photoHint, { color: C.textMuted }]}>{t.staffPhoto}</Text>
          </View>

          <Input label={t.staffName} value={name} onChangeText={setName} isDark={isDark} required />
          <Input label={t.staffPhone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" isDark={isDark} />

          {/* Position */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.staffPosition} *</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowPosition(true)}>
            <Text style={[styles.selectText, { color: position ? C.text : C.textMuted }]}>{position || 'Select Position'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={t.staffAddress} value={address} onChangeText={setAddress} multiline numberOfLines={2} isDark={isDark} />
          <Input label={t.staffNotes} value={notes} onChangeText={setNotes} multiline numberOfLines={3} isDark={isDark} />

          <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.lg }} />
          <Button title={t.cancel} onPress={() => router.back()} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <SelectModal visible={showPosition} title={t.staffPosition} options={POSITIONS} selected={position} onSelect={setPosition} onClose={() => setShowPosition(false)} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  photoSection: { alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3 },
  photoOverlay: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  photoHint: { marginTop: Spacing.sm, fontSize: FontSize.sm },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
});
