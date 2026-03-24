import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import Header from '../../components/layout/Header';
import SaleCard from '../../components/feature/SaleCard';

export default function PurchaseScreen() {
  const { settings, purchases } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    purchases.filter(p => !search || p.itemName.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [purchases, search]
  );

  const totalExpense = useMemo(() => purchases.reduce((sum, p) => sum + parseFloat(p.price || '0'), 0), [purchases]);

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'light'} />
      <Header
        title={t.purchase}
        showLogo
        isDark={settings.theme === 'dark'}
        rightAction={{ icon: 'add', onPress: () => router.push('/purchase/add') }}
      />

      {/* Expense Summary */}
      <View style={[styles.summary, { backgroundColor: '#B71C1C' }]}>
        <Text style={styles.summaryLabel}>{t.totalExpense}</Text>
        <Text style={styles.summaryAmount}>{totalExpense.toLocaleString()} MMK</Text>
        <Text style={styles.summaryCount}>{purchases.length} purchase records</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View style={[styles.searchBar, { backgroundColor: C.inputBg, borderColor: C.border }]}>
          <MaterialIcons name="search" size={18} color={C.textMuted} />
          <TextInput value={search} onChangeText={setSearch} placeholder={t.search} placeholderTextColor={C.textMuted} style={[styles.searchInput, { color: C.text }]} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><MaterialIcons name="close" size={16} color={C.textMuted} /></TouchableOpacity> : null}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SaleCard item={{ ...item, brand: item.supplier }} onPress={() => router.push(`/purchase/${item.id}`)} isDark={settings.theme === 'dark'} type="purchase" />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="shopping-cart" size={52} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textMuted }]}>{t.noPurchases}</Text>
          </View>
        }
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: C.primary }]} onPress={() => router.push('/purchase/add')}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summary: { padding: Spacing.lg, alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm },
  summaryAmount: { color: '#fff', fontSize: FontSize.xxxl, fontWeight: '700', marginVertical: 4 },
  summaryCount: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm },
  searchWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, paddingHorizontal: Spacing.md, height: 40 },
  searchInput: { flex: 1, fontSize: FontSize.base },
  list: { padding: Spacing.md, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 90, right: Spacing.lg, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
});
