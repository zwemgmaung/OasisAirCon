import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import Header from '../../components/layout/Header';
import StaffCard from '../../components/feature/StaffCard';

export default function StaffScreen() {
  const { settings, staff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    staff.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.position.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name)),
    [staff, search]
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'light'} />
      <Header
        title={t.staff}
        showLogo
        isDark={settings.theme === 'dark'}
        rightAction={{ icon: 'person-add', onPress: () => router.push('/staff/add') }}
      />

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View style={[styles.searchBar, { backgroundColor: C.inputBg, borderColor: C.border }]}>
          <MaterialIcons name="search" size={18} color={C.textMuted} />
          <TextInput value={search} onChangeText={setSearch} placeholder={t.search} placeholderTextColor={C.textMuted} style={[styles.searchInput, { color: C.text }]} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><MaterialIcons name="close" size={16} color={C.textMuted} /></TouchableOpacity> : null}
        </View>
        <Text style={[styles.countText, { color: C.textMuted }]}>{filtered.length} staff members</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StaffCard member={item} onPress={() => router.push(`/staff/${item.id}`)} isDark={settings.theme === 'dark'} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="people" size={52} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textMuted }]}>{t.noStaff}</Text>
          </View>
        }
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: C.primary }]} onPress={() => router.push('/staff/add')}>
        <MaterialIcons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, paddingHorizontal: Spacing.md, height: 40 },
  searchInput: { flex: 1, fontSize: FontSize.base },
  countText: { fontSize: FontSize.xs, marginTop: 4 },
  list: { padding: Spacing.md, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 90, right: Spacing.lg, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
});
