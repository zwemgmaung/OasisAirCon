import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DatePickerModal from '../../components/ui/DatePickerModal';

export default function PurchaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, purchases, updatePurchase, deletePurchase } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  const purchase = purchases.find(p => p.id === id);
  const [editing, setEditing] = useState(false);
  const [itemName, setItemName] = useState(purchase?.itemName || '');
  const [category, setCategory] = useState(purchase?.category || '');
  const [quantity, setQuantity] = useState(purchase?.quantity || '1');
  const [price, setPrice] = useState(purchase?.price || '');
  const [supplier, setSupplier] = useState(purchase?.supplier || '');
  const [date, setDate] = useState(purchase?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(purchase?.notes || '');
  const [saving, setSaving] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  if (!purchase) return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title="Not Found" showBack isDark={isDark} />
      <View style={styles.center}><Text style={{ color: C.textMuted }}>Record not found</Text></View>
    </View>
  );

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert(t.error, 'Item name required.'); return; }
    setSaving(true);
    await updatePurchase(id!, { itemName, category, quantity, price, supplier, date, notes });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => { await deletePurchase(id!); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={editing ? t.editPurchase : t.purchaseDetails} showBack isDark={isDark}
        rightAction={{ icon: editing ? 'close' : 'edit', onPress: () => setEditing(!editing) }}
        rightAction2={!editing ? { icon: 'delete', onPress: handleDelete } : undefined}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {!editing ? (
            <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
              <Text style={[styles.itemName, { color: C.text }]}>{purchase.itemName}</Text>
              <Text style={[styles.price, { color: '#D32F2F' }]}>{parseFloat(purchase.price || '0').toLocaleString()} MMK</Text>
              <View style={[styles.divider, { backgroundColor: C.border }]} />
              {purchase.category ? <Row label="Category" value={purchase.category} C={C} /> : null}
              <Row label="Quantity" value={purchase.quantity} C={C} />
              {purchase.supplier ? <Row label="Supplier" value={purchase.supplier} C={C} /> : null}
              <Row label="Date" value={formatDate(purchase.date)} C={C} />
              {purchase.notes ? <Row label="Notes" value={purchase.notes} C={C} /> : null}
            </View>
          ) : (
            <View>
              <Input label={t.purchaseItem} value={itemName} onChangeText={setItemName} isDark={isDark} required />
              <Input label={`${t.purchaseCategory} (optional)`} value={category} onChangeText={setCategory} isDark={isDark} />
              <Input label={t.purchaseQty} value={quantity} onChangeText={setQuantity} keyboardType="numeric" isDark={isDark} />
              <Input label={`${t.purchasePrice} (MMK)`} value={price} onChangeText={setPrice} keyboardType="numeric" isDark={isDark} />
              <Input label={t.supplier} value={supplier} onChangeText={setSupplier} isDark={isDark} />
              <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{t.purchaseDate}</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
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
