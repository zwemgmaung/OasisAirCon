import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import { DEVICE_TYPES, AC_TYPES, GAS_TYPES } from '../../constants/config';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import DatePickerModal from '../../components/ui/DatePickerModal';
import SelectModal from '../../components/ui/SelectModal';
import StaffPickerModal from '../../components/ui/StaffPickerModal';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, jobs, updateJob, deleteJob, staff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const job = jobs.find(j => j.id === id);

  const [editing, setEditing] = useState(false);
  const [customerName, setCustomerName] = useState(job?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(job?.customerPhone || '');
  const [address, setAddress] = useState(job?.address || '');
  const [problemDescription, setProblemDescription] = useState(job?.problemDescription || '');
  const [deviceType, setDeviceType] = useState(job?.deviceType || 'Air Conditioner');
  const [acBrand, setAcBrand] = useState(job?.acBrand || '');
  const [acHP, setAcHP] = useState(job?.acHP || '');
  const [acType, setAcType] = useState(job?.acType || '');
  const [gasType, setGasType] = useState(job?.gasType || '');
  const [assignedStaff, setAssignedStaff] = useState<string[]>(job?.assignedStaff || []);
  const [status, setStatus] = useState<'Done' | 'Pending'>(job?.status || 'Pending');
  const [date, setDate] = useState(job?.date || new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState(job?.cost || '');
  const [photos, setPhotos] = useState<string[]>(job?.photos || []);
  const [notes, setNotes] = useState(job?.notes || '');
  const [saving, setSaving] = useState(false);

  const [showDate, setShowDate] = useState(false);
  const [showDevice, setShowDevice] = useState(false);
  const [showACType, setShowACType] = useState(false);
  const [showGas, setShowGas] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showStaff, setShowStaff] = useState(false);

  if (!job) {
    return (
      <View style={[styles.root, { backgroundColor: C.background }]}>
        <Header title="Job Not Found" showBack isDark={isDark} />
        <View style={styles.notFound}>
          <MaterialIcons name="error-outline" size={52} color={C.textMuted} />
          <Text style={[styles.notFoundText, { color: C.textMuted }]}>Job not found</Text>
          <Button title="Go Back" onPress={() => router.back()} isDark={isDark} style={{ marginTop: Spacing.md }} />
        </View>
      </View>
    );
  }

  const getStaffNames = (ids: string[]) =>
    ids.map(id => staff.find(s => s.id === id)?.name || '').filter(Boolean).join(', ');

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

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

  const handleSave = async () => {
    if (!customerName.trim()) { Alert.alert(t.error, 'Customer name required.'); return; }
    if (assignedStaff.length < 2) { Alert.alert(t.error, 'Assign at least 2 staff.'); return; }
    setSaving(true);
    await updateJob(id!, { customerName, customerPhone, address, problemDescription, deviceType, acBrand, acHP, acType, gasType, assignedStaff, status, date, cost, photos, notes });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => { await deleteJob(id!); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header
        title={editing ? t.editJob : t.jobDetails}
        showBack
        isDark={isDark}
        rightAction={{ icon: editing ? 'close' : 'edit', onPress: () => { if (editing) setEditing(false); else setEditing(true); } }}
        rightAction2={!editing ? { icon: 'delete', onPress: handleDelete } : undefined}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {!editing ? (
            // View Mode
            <View>
              <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.customerName, { color: C.text }]}>{job.customerName}</Text>
                    <Text style={[styles.phone, { color: C.textSecondary }]}>{job.customerPhone}</Text>
                  </View>
                  <StatusBadge status={job.status} isDark={isDark} />
                </View>
                <View style={[styles.divider, { backgroundColor: C.border }]} />
                <DetailRow icon="location-on" label="Address" value={job.address} C={C} />
                <DetailRow icon="calendar-today" label="Date" value={formatDate(job.date)} C={C} />
                <DetailRow icon="devices" label="Device" value={`${job.deviceType}${job.acBrand ? ` · ${job.acBrand}` : ''}${job.acHP ? ` · ${job.acHP}HP` : ''}`} C={C} />
                {job.acType ? <DetailRow icon="ac-unit" label="AC Type" value={job.acType} C={C} /> : null}
                {job.gasType ? <DetailRow icon="local-gas-station" label="Gas Type" value={job.gasType} C={C} /> : null}
                <DetailRow icon="report-problem" label="Problem" value={job.problemDescription} C={C} />
                <DetailRow icon="people" label="Staff" value={getStaffNames(job.assignedStaff)} C={C} />
                {job.cost ? <DetailRow icon="payments" label="Cost" value={`${parseFloat(job.cost).toLocaleString()} MMK`} C={C} valueColor={C.primary} /> : null}
                {job.notes ? <DetailRow icon="notes" label="Notes" value={job.notes} C={C} /> : null}
              </View>

              {job.photos.length > 0 && (
                <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
                  <Text style={[styles.sectionTitle, { color: C.text }]}>{t.photos}</Text>
                  <View style={styles.photosGrid}>
                    {job.photos.map((uri, i) => (
                      <Image key={i} source={{ uri }} style={styles.photo} contentFit="cover" transition={200} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          ) : (
            // Edit Mode
            <View>
              <Text style={[styles.section, { color: C.textSecondary }]}>Customer Info</Text>
              <Input label={t.customerName} value={customerName} onChangeText={setCustomerName} isDark={isDark} required />
              <Input label={t.customerPhone} value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" isDark={isDark} />
              <Input label={t.address} value={address} onChangeText={setAddress} multiline numberOfLines={2} isDark={isDark} />

              <Text style={[styles.section, { color: C.textSecondary }]}>Device Info</Text>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.deviceType}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDevice(true)}>
                <Text style={[styles.selectText, { color: C.text }]}>{deviceType}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={t.acBrand} value={acBrand} onChangeText={setAcBrand} isDark={isDark} />
              <Input label={t.acHP} value={acHP} onChangeText={setAcHP} keyboardType="numeric" isDark={isDark} />
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.acType}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowACType(true)}>
                <Text style={[styles.selectText, { color: acType ? C.text : C.textMuted }]}>{acType || t.selectACType}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.gasType}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowGas(true)}>
                <Text style={[styles.selectText, { color: gasType ? C.text : C.textMuted }]}>{gasType || t.selectGasType}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={t.problemDescription} value={problemDescription} onChangeText={setProblemDescription} multiline numberOfLines={3} isDark={isDark} />

              <Text style={[styles.section, { color: C.textSecondary }]}>Job Details</Text>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.date}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDate(true)}>
                <MaterialIcons name="calendar-today" size={16} color={C.primary} />
                <Text style={[styles.selectText, { color: C.text }]}>{formatDate(date)}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.status}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowStatus(true)}>
                <View style={[styles.dot, { backgroundColor: status === 'Done' ? C.done : C.pending }]} />
                <Text style={[styles.selectText, { color: C.text }]}>{status}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.assignedStaff}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowStaff(true)}>
                <MaterialIcons name="people" size={16} color={C.primary} />
                <Text style={[styles.selectText, { color: assignedStaff.length > 0 ? C.text : C.textMuted }]} numberOfLines={1}>
                  {assignedStaff.length > 0 ? getStaffNames(assignedStaff) : t.selectStaff}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={`${t.cost} (MMK)`} value={cost} onChangeText={setCost} keyboardType="numeric" isDark={isDark} />
              <Input label={t.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} isDark={isDark} />

              <Text style={[styles.section, { color: C.textSecondary }]}>{t.photos}</Text>
              <View style={styles.photosGrid}>
                {photos.map((uri, i) => (
                  <View key={i} style={styles.photoWrap}>
                    <Image source={{ uri }} style={styles.photoThumb} contentFit="cover" />
                    <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotos(prev => prev.filter((_, j) => j !== i))}>
                      <MaterialIcons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={[styles.addPhoto, { backgroundColor: C.surfaceVariant, borderColor: C.border }]} onPress={pickPhoto}>
                  <MaterialIcons name="add-a-photo" size={24} color={C.primary} />
                </TouchableOpacity>
              </View>

              <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.md }} />
              <Button title={t.cancel} onPress={() => setEditing(false)} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePickerModal visible={showDate} value={date} onClose={() => setShowDate(false)} onSelect={setDate} isDark={isDark} />
      <SelectModal visible={showDevice} title={t.selectDeviceType} options={DEVICE_TYPES} selected={deviceType} onSelect={setDeviceType} onClose={() => setShowDevice(false)} isDark={isDark} />
      <SelectModal visible={showACType} title={t.selectACType} options={AC_TYPES} selected={acType} onSelect={setAcType} onClose={() => setShowACType(false)} isDark={isDark} />
      <SelectModal visible={showGas} title={t.selectGasType} options={GAS_TYPES} selected={gasType} onSelect={setGasType} onClose={() => setShowGas(false)} isDark={isDark} />
      <SelectModal visible={showStatus} title={t.selectStatus} options={['Done', 'Pending']} selected={status} onSelect={(v) => setStatus(v as any)} onClose={() => setShowStatus(false)} isDark={isDark} />
      <StaffPickerModal visible={showStaff} staffList={staff} selected={assignedStaff} onConfirm={setAssignedStaff} onClose={() => setShowStaff(false)} isDark={isDark} />
    </View>
  );
}

function DetailRow({ icon, label, value, C, valueColor }: any) {
  if (!value) return null;
  return (
    <View style={detailStyles.row}>
      <MaterialIcons name={icon} size={16} color={C.textMuted} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={[detailStyles.label, { color: C.textMuted }]}>{label}</Text>
        <Text style={[detailStyles.value, { color: valueColor || C.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  label: { fontSize: FontSize.xs, marginBottom: 1 },
  value: { fontSize: FontSize.base },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  customerName: { fontSize: FontSize.xl, fontWeight: '700' },
  phone: { fontSize: FontSize.sm, marginTop: 2 },
  divider: { height: 1, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '600', marginBottom: Spacing.sm },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  photo: { width: 100, height: 100, borderRadius: BorderRadius.md },
  photoWrap: { position: 'relative' },
  photoThumb: { width: 80, height: 80, borderRadius: BorderRadius.md },
  removePhoto: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  addPhoto: { width: 80, height: 80, borderRadius: BorderRadius.md, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  section: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
  dot: { width: 10, height: 10, borderRadius: 5 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  notFoundText: { fontSize: FontSize.base },
});
