import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import { SALE_CATEGORIES } from '../../constants/config';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DatePickerModal from '../../components/ui/DatePickerModal';
import SelectModal from '../../components/ui/SelectModal';

export default function AddSaleScreen() {
  const { settings, addSale } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Air Conditioner');
  const [brand, setBrand] = useState('');
  const [hp, setHp] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showCat, setShowCat] = useState(false);

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert(t.error, 'Item name is required.'); return; }
    if (!price) { Alert.alert(t.error, 'Price is required.'); return; }
    setSaving(true);
    await addSale({ itemName, category, brand, hp, type, quantity, price, date, notes });
    setSaving(false);
    router.back();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={t.addSale} showBack isDark={isDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <Text style={[styles.section, { color: C.textSecondary }]}>Item Details</Text>

          {/* Category */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.saleCategory}</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowCat(true)}>
            <Text style={[styles.selectText, { color: C.text }]}>{category}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <Input label={t.saleItem} value={itemName} onChangeText={setItemName} placeholder="Item name..." isDark={isDark} required />
          <Input label={t.saleBrand} value={brand} onChangeText={setBrand} placeholder="e.g. Daikin, Samsung..." isDark={isDark} />
          <Input label={t.saleHP} value={hp} onChangeText={setHp} keyboardType="numeric" placeholder="e.g. 1, 1.5" isDark={isDark} />
          <Input label={t.saleType} value={type} onChangeText={setType} placeholder="e.g. Split, Inverter..." isDark={isDark} />
          <Input label={t.saleQty} value={quantity} onChangeText={setQuantity} keyboardType="numeric" isDark={isDark} />
          <Input label={`${t.salePrice} (MMK)`} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" isDark={isDark} required />

          {/* Date */}
          <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.saleDate}</Text>
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
      <SelectModal visible={showCat} title={t.saleCategory} options={SALE_CATEGORIES} selected={category} onSelect={setCategory} onClose={() => setShowCat(false)} isDark={isDark} />
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
});
