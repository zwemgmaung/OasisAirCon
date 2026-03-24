import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, staff, updateStaff, deleteStaff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const member = staff.find(s => s.id === id);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member?.name || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [address, setAddress] = useState(member?.address || '');
  const [position, setPosition] = useState(member?.position || '');
  const [photo, setPhoto] = useState(member?.photo || '');
  const [notes, setNotes] = useState(member?.notes || '');
  const [saving, setSaving] = useState(false);
  const [showPosition, setShowPosition] = useState(false);

  if (!member) {
    return (
      <View style={[styles.root, { backgroundColor: C.background }]}>
        <Header title="Staff Not Found" showBack isDark={isDark} />
        <View style={styles.notFound}>
          <Text style={[{ color: C.textMuted }]}>Staff member not found</Text>
        </View>
      </View>
    );
  }

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
    if (!name.trim()) { Alert.alert(t.error, 'Name required.'); return; }
    setSaving(true);
    await updateStaff(id!, { name, phone, address, position, photo, notes });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => { await deleteStaff(id!); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header
        title={editing ? t.editStaff : t.staffDetails}
        showBack
        isDark={isDark}
        rightAction={{ icon: editing ? 'close' : 'edit', onPress: () => setEditing(!editing) }}
        rightAction2={!editing ? { icon: 'delete', onPress: handleDelete } : undefined}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Profile Header */}
          <View style={[styles.profileCard, { backgroundColor: C.card, ...Shadow.sm }]}>
            <TouchableOpacity onPress={editing ? pickPhoto : undefined} style={styles.avatarWrap}>
              <Image
                source={photo ? { uri: photo } : { uri: LOGO_URL }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              {editing && (
                <View style={[styles.photoOverlay, { backgroundColor: C.primary }]}>
                  <MaterialIcons name="camera-alt" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            {!editing && (
              <>
                <Text style={[styles.memberName, { color: C.text }]}>{member.name}</Text>
                <View style={[styles.posBadge, { backgroundColor: C.surfaceVariant }]}>
                  <Text style={[styles.posText, { color: C.primary }]}>{member.position}</Text>
                </View>
                {member.phone ? (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="phone" size={16} color={C.textMuted} />
                    <Text style={[styles.infoText, { color: C.textSecondary }]}>{member.phone}</Text>
                  </View>
                ) : null}
                {member.address ? (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="location-on" size={16} color={C.textMuted} />
                    <Text style={[styles.infoText, { color: C.textSecondary }]}>{member.address}</Text>
                  </View>
                ) : null}
                {member.notes ? (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="notes" size={16} color={C.textMuted} />
                    <Text style={[styles.infoText, { color: C.textSecondary }]}>{member.notes}</Text>
                  </View>
                ) : null}
              </>
            )}
          </View>

          {editing && (
            <View>
              <Input label={t.staffName} value={name} onChangeText={setName} isDark={isDark} required />
              <Input label={t.staffPhone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" isDark={isDark} />
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.staffPosition}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowPosition(true)}>
                <Text style={[styles.selectText, { color: position ? C.text : C.textMuted }]}>{position || 'Select Position'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={t.staffAddress} value={address} onChangeText={setAddress} multiline numberOfLines={2} isDark={isDark} />
              <Input label={t.staffNotes} value={notes} onChangeText={setNotes} multiline numberOfLines={3} isDark={isDark} />
              <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.md }} />
              <Button title={t.cancel} onPress={() => setEditing(false)} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
            </View>
          )}

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
  profileCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  photoOverlay: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  memberName: { fontSize: FontSize.xxl, fontWeight: '700', marginBottom: 8 },
  posBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, marginBottom: Spacing.sm },
  posText: { fontSize: FontSize.sm, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 6 },
  infoText: { fontSize: FontSize.base },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
