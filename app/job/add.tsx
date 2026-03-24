import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image as RNImage,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import { DEVICE_TYPES, AC_TYPES, GAS_TYPES } from '../../constants/config';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DatePickerModal from '../../components/ui/DatePickerModal';
import SelectModal from '../../components/ui/SelectModal';
import StaffPickerModal from '../../components/ui/StaffPickerModal';

export default function AddJobScreen() {
  const { settings, addJob, staff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [deviceType, setDeviceType] = useState('Air Conditioner');
  const [acBrand, setAcBrand] = useState('');
  const [acHP, setAcHP] = useState('');
  const [acType, setAcType] = useState('');
  const [gasType, setGasType] = useState('');
  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const [status, setStatus] = useState<'Done' | 'Pending'>('Pending');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showDate, setShowDate] = useState(false);
  const [showDevice, setShowDevice] = useState(false);
  const [showACType, setShowACType] = useState(false);
  const [showGas, setShowGas] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showStaff, setShowStaff] = useState(false);

  const pickPhoto = async () => {
    Alert.alert(t.addPhoto, '', [
      { text: t.takePhoto, onPress: async () => {
        const r = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!r.canceled && r.assets[0]) setPhotos(prev => [...prev, r.assets[0].uri]);
      }},
      { text: t.chooseGallery, onPress: async () => {
        const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsMultipleSelection: true });
        if (!r.canceled) setPhotos(prev => [...prev, ...r.assets.map(a => a.uri)]);
      }},
      { text: t.cancel, style: 'cancel' },
    ]);
  };

  const getStaffNames = (ids: string[]) =>
    ids.map(id => staff.find(s => s.id === id)?.name || '').filter(Boolean).join(', ');

  const handleSave = async () => {
    if (!customerName.trim()) { Alert.alert(t.error, 'Customer name is required.'); return; }
    if (assignedStaff.length < 2) { Alert.alert(t.error, 'Please assign at least 2 staff members.'); return; }
    setSaving(true);
    await addJob({ customerName, customerPhone, address, problemDescription, deviceType, acBrand, acHP, acType, gasType, assignedStaff, status, date, cost, photos, notes });
    setSaving(false);
    router.back();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={t.addJob} showBack isDark={isDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <Text style={[styles.section, { color: C.textSecondary }]}>Customer Info</Text>
          <Input label={t.customerName} value={customerName} onChangeText={setCustomerName} isDark={isDark} required />
          <Input label={t.customerPhone} value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" isDark={isDark} />
          <Input label={t.address} value={address} onChangeText={setAddress} multiline numberOfLines={2} isDark={isDark} />

          <Text style={[styles.section, { color: C.textSecondary }]}>Device Info</Text>

          {/* Device Type */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.deviceType}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDevice(true)}>
            <Text style={[styles.selectText, { color: C.text }]}>{deviceType}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={t.acBrand} value={acBrand} onChangeText={setAcBrand} placeholder="e.g. Daikin, Panasonic..." isDark={isDark} />
          <Input label={t.acHP} value={acHP} onChangeText={setAcHP} keyboardType="numeric" placeholder="e.g. 1, 1.5, 2" isDark={isDark} />

          {/* AC Type */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.acType}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowACType(true)}>
            <Text style={[styles.selectText, { color: acType ? C.text : C.textMuted }]}>{acType || t.selectACType}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          {/* Gas Type */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.gasType}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowGas(true)}>
            <Text style={[styles.selectText, { color: gasType ? C.text : C.textMuted }]}>{gasType || t.selectGasType}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={t.problemDescription} value={problemDescription} onChangeText={setProblemDescription} multiline numberOfLines={3} isDark={isDark} />

          <Text style={[styles.section, { color: C.textSecondary }]}>Job Details</Text>

          {/* Date */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.date} *</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDate(true)}>
            <MaterialIcons name="calendar-today" size={16} color={C.primary} />
            <Text style={[styles.selectText, { color: C.text }]}>{formatDate(date)}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          {/* Status */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.status}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowStatus(true)}>
            <View style={[styles.dot, { backgroundColor: status === 'Done' ? C.done : C.pending }]} />
            <Text style={[styles.selectText, { color: C.text }]}>{status}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          {/* Assigned Staff */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.assignedStaff} *</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowStaff(true)}>
            <MaterialIcons name="people" size={16} color={C.primary} />
            <Text style={[styles.selectText, { color: assignedStaff.length > 0 ? C.text : C.textMuted }]} numberOfLines={1}>
              {assignedStaff.length > 0 ? getStaffNames(assignedStaff) : t.selectStaff}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={`${t.cost} (MMK)`} value={cost} onChangeText={setCost} keyboardType="numeric" placeholder="0" isDark={isDark} />
          <Input label={t.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} isDark={isDark} />

          {/* Photos */}
          <Text style={[styles.section, { color: C.textSecondary }]}>{t.photos}</Text>
          <View style={styles.photosGrid}>
            {photos.map((uri, i) => (
              <View key={i} style={styles.photoWrap}>
                <Image source={{ uri }} style={styles.photo} contentFit="cover" />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotos(prev => prev.filter((_, j) => j !== i))}>
                  <MaterialIcons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.addPhoto, { backgroundColor: C.surfaceVariant, borderColor: C.border }]} onPress={pickPhoto}>
              <MaterialIcons name="add-a-photo" size={24} color={C.primary} />
              <Text style={[styles.addPhotoText, { color: C.textMuted }]}>{t.addPhoto}</Text>
            </TouchableOpacity>
          </View>

          <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.lg }} />
          <Button title={t.cancel} onPress={() => router.back()} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePickerModal visible={showDate} value={date} onClose={() => setShowDate(false)} onSelect={setDate} isDark={isDark} label={t.selectDate} />
      <SelectModal visible={showDevice} title={t.selectDeviceType} options={DEVICE_TYPES} selected={deviceType} onSelect={setDeviceType} onClose={() => setShowDevice(false)} isDark={isDark} />
      <SelectModal visible={showACType} title={t.selectACType} options={AC_TYPES} selected={acType} onSelect={setAcType} onClose={() => setShowACType(false)} isDark={isDark} />
      <SelectModal visible={showGas} title={t.selectGasType} options={GAS_TYPES} selected={gasType} onSelect={setGasType} onClose={() => setShowGas(false)} isDark={isDark} />
      <SelectModal visible={showStatus} title={t.selectStatus} options={['Done', 'Pending']} selected={status} onSelect={(v) => setStatus(v as any)} onClose={() => setShowStatus(false)} isDark={isDark} />
      <StaffPickerModal visible={showStaff} staffList={staff} selected={assignedStaff} onConfirm={setAssignedStaff} onClose={() => setShowStaff(false)} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  section: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
  dot: { width: 10, height: 10, borderRadius: 5 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  photoWrap: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: BorderRadius.md },
  removePhoto: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  addPhoto: { width: 80, height: 80, borderRadius: BorderRadius.md, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addPhotoText: { fontSize: 9, textAlign: 'center' },
});
