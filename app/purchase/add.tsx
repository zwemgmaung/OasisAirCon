import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DatePickerModal from '../../components/ui/DatePickerModal';

export default function AddPurchaseScreen() {
  const { settings, addPurchase } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert(t.error, 'Item name is required.'); return; }
    if (!price) { Alert.alert(t.error, 'Cost is required.'); return; }
    setSaving(true);
    await addPurchase({ itemName, category, quantity, price, supplier, date, notes });
    setSaving(false);
    router.back();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={t.addPurchase} showBack isDark={isDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.hint, { color: C.textMuted, backgroundColor: C.surfaceVariant }]}>
            Enter any item type freely — gas, hand tools, spare parts, AC units, etc.
          </Text>

          <Input label={t.purchaseItem} value={itemName} onChangeText={setItemName} placeholder="e.g. R-32 Gas, Wrench set, Compressor..." isDark={isDark} required />
          <Input label={`${t.purchaseCategory} (optional)`} value={category} onChangeText={setCategory} placeholder="e.g. Gas, Tools, Spare Parts, AC..." isDark={isDark} />
          <Input label={t.purchaseQty} value={quantity} onChangeText={setQuantity} keyboardType="numeric" isDark={isDark} />
          <Input label={`${t.purchasePrice} (MMK)`} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" isDark={isDark} required />
          <Input label={t.supplier} value={supplier} onChangeText={setSupplier} placeholder="Supplier name..." isDark={isDark} />

          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.purchaseDate}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDate(true)}>
            <MaterialIcons name="calendar-today" size={16} color={C.primary} />
            <Text style={[styles.selectText, { color: C.text }]}>{formatDate(date)}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={t.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} isDark={isDark} />

          <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.lg }} />
          <Button title={t.cancel} onPress={() => router.back()} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <DatePickerModal visible={showDate} value={date} onClose={() => setShowDate(false)} onSelect={setDate} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  hint: { borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSize.sm, marginBottom: Spacing.md, lineHeight: 20 },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
});
