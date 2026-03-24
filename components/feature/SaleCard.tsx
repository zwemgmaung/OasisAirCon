import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';

interface SaleCardProps {
  item: {
    id: string;
    itemName: string;
    category: string;
    brand?: string;
    quantity: string;
    price: string;
    date: string;
    notes?: string;
  };
  onPress: () => void;
  isDark?: boolean;
  type: 'sale' | 'purchase';
}

export default function SaleCard({ item, onPress, isDark = false, type }: SaleCardProps) {
  const C = isDark ? Colors.dark : Colors.light;

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB');
  };

  const iconName = type === 'sale' ? 'point-of-sale' : 'shopping-cart';
  const amountColor = type === 'sale' ? C.done : C.pending;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: C.surfaceVariant }]}>
        <MaterialIcons name={iconName as any} size={22} color={C.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: C.text }]} numberOfLines={1}>{item.itemName}</Text>
        <Text style={[styles.cat, { color: C.textSecondary }]}>{item.category}{item.brand ? ` · ${item.brand}` : ''}</Text>
        <View style={styles.row}>
          <MaterialIcons name="calendar-today" size={12} color={C.textMuted} />
          <Text style={[styles.date, { color: C.textMuted }]}>{formatDate(item.date)}</Text>
          <Text style={[styles.qty, { color: C.textMuted }]}>· Qty: {item.quantity}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.price, { color: amountColor }]}>{parseFloat(item.price || '0').toLocaleString()}</Text>
        <Text style={[styles.mmk, { color: C.textMuted }]}>MMK</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: FontSize.base, fontWeight: '600' },
  cat: { fontSize: FontSize.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: FontSize.xs },
  qty: { fontSize: FontSize.xs },
  right: { alignItems: 'flex-end' },
  price: { fontSize: FontSize.lg, fontWeight: '700' },
  mmk: { fontSize: FontSize.xs, marginTop: 1 },
});
