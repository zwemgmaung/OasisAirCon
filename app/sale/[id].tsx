import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import { SALE_CATEGORIES } from '../../constants/config';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DatePickerModal from '../../components/ui/DatePickerModal';
import SelectModal from '../../components/ui/SelectModal';

export default function SaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, sales, updateSale, deleteSale } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const sale = sales.find(s => s.id === id);
  const [editing, setEditing] = useState(false);
  const [itemName, setItemName] = useState(sale?.itemName || '');
  const [category, setCategory] = useState(sale?.category || 'Air Conditioner');
  const [brand, setBrand] = useState(sale?.brand || '');
  const [hp, setHp] = useState(sale?.hp || '');
  const [type, setType] = useState(sale?.type || '');
  const [quantity, setQuantity] = useState(sale?.quantity || '1');
  const [price, setPrice] = useState(sale?.price || '');
  const [date, setDate] = useState(sale?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(sale?.notes || '');
  const [saving, setSaving] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showCat, setShowCat] = useState(false);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  if (!sale) return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title="Sale Not Found" showBack isDark={isDark} />
      <View style={styles.center}><Text style={{ color: C.textMuted }}>Record not found</Text></View>
    </View>
  );

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert(t.error, 'Item name required.'); return; }
    setSaving(true);
    await updateSale(id!, { itemName, category, brand, hp, type, quantity, price, date, notes });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => { await deleteSale(id!); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={editing ? t.editSale : t.saleDetails} showBack isDark={isDark}
        rightAction={{ icon: editing ? 'close' : 'edit', onPress: () => setEditing(!editing) }}
        rightAction2={!editing ? { icon: 'delete', onPress: handleDelete } : undefined}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {!editing ? (
            <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
              <Text style={[styles.itemName, { color: C.text }]}>{sale.itemName}</Text>
              <Text style={[styles.price, { color: C.primary }]}>{parseFloat(sale.price || '0').toLocaleString()} MMK</Text>
              <View style={[styles.divider, { backgroundColor: C.border }]} />
              <Row label="Category" value={sale.category} C={C} />
              {sale.brand ? <Row label="Brand" value={sale.brand} C={C} /> : null}
              {sale.hp ? <Row label="HP" value={`${sale.hp} HP`} C={C} /> : null}
              {sale.type ? <Row label="Type" value={sale.type} C={C} /> : null}
              <Row label="Quantity" value={sale.quantity} C={C} />
              <Row label="Date" value={formatDate(sale.date)} C={C} />
              {sale.notes ? <Row label="Notes" value={sale.notes} C={C} /> : null}
            </View>
          ) : (
            <View>
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.saleCategory}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowCat(true)}>
                <Text style={[styles.selectText, { color: C.text }]}>{category}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={t.saleItem} value={itemName} onChangeText={setItemName} isDark={isDark} required />
              <Input label={t.saleBrand} value={brand} onChangeText={setBrand} isDark={isDark} />
              <Input label={t.saleHP} value={hp} onChangeText={setHp} keyboardType="numeric" isDark={isDark} />
              <Input label={t.saleType} value={type} onChangeText={setType} isDark={isDark} />
              <Input label={t.saleQty} value={quantity} onChangeText={setQuantity} keyboardType="numeric" isDark={isDark} />
              <Input label={`${t.salePrice} (MMK)`} value={price} onChangeText={setPrice} keyboardType="numeric" isDark={isDark} />
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.saleDate}</Text>
              <TouchableOpacity style={[styles.select, { backgroundColor: C.inputBg, borderColor: C.border }]} onPress={() => setShowDate(true)}>
                <MaterialIcons name="calendar-today" size={16} color={C.primary} />
                <Text style={[styles.selectText, { color: C.text }]}>{formatDate(date)}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={C.textMuted} />
              </TouchableOpacity>
              <Input label={t.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} isDark={isDark} />
              <Button title={t.save} onPress={handleSave} loading={saving} isDark={isDark} style={{ marginTop: Spacing.md }} />
              <Button title={t.cancel} onPress={() => setEditing(false)} variant="outline" isDark={isDark} style={{ marginTop: Spacing.sm }} />
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <DatePickerModal visible={showDate} value={date} onClose={() => setShowDate(false)} onSelect={setDate} isDark={isDark} />
      <SelectModal visible={showCat} title={t.saleCategory} options={SALE_CATEGORIES} selected={category} onSelect={setCategory} onClose={() => setShowCat(false)} isDark={isDark} />
    </View>
  );
}

function Row({ label, value, C }: any) {
  return (
    <View style={rowStyles.row}>
      <Text style={[rowStyles.label, { color: C.textMuted }]}>{label}</Text>
      <Text style={[rowStyles.value, { color: C.text }]}>{value}</Text>
    </View>
  );
}
const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, alignItems: 'flex-start' },
  label: { fontSize: FontSize.sm, flex: 1 },
  value: { fontSize: FontSize.base, fontWeight: '500', flex: 2, textAlign: 'right' },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md },
  itemName: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: FontSize.xxl, fontWeight: '700', marginBottom: Spacing.md },
  divider: { height: 1, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, height: 46, marginBottom: Spacing.md },
  selectText: { flex: 1, fontSize: FontSize.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
