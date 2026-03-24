import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { getT } from '../../constants/i18n';
import Header from '../../components/layout/Header';
import JobCard from '../../components/feature/JobCard';

export default function JobsScreen() {
  const { settings, jobs, staff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Done' | 'Pending'>('All');

  const getStaffNames = (ids: string[]) =>
    ids.map(id => staff.find(s => s.id === id)?.name || '').filter(Boolean).join(', ');

  const filtered = useMemo(() => {
    return jobs
      .filter(j => filter === 'All' || j.status === filter)
      .filter(j => {
        const q = search.toLowerCase();
        return !q || j.customerName.toLowerCase().includes(q) || j.customerPhone.includes(q) || j.address.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [jobs, filter, search]);

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'light'} />
      <Header
        title={t.jobs}
        showLogo
        isDark={settings.theme === 'dark'}
        rightAction={{ icon: 'add', onPress: () => router.push('/job/add') }}
      />

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View style={[styles.searchBar, { backgroundColor: C.inputBg, borderColor: C.border }]}>
          <MaterialIcons name="search" size={18} color={C.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t.search}
            placeholderTextColor={C.textMuted}
            style={[styles.searchInput, { color: C.text }]}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Chips */}
        <View style={styles.chips}>
          {(['All', 'Done', 'Pending'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, { backgroundColor: filter === f ? C.primary : C.surfaceVariant }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, { color: filter === f ? '#fff' : C.text }]}>{f}</Text>
            </TouchableOpacity>
          ))}
          <Text style={[styles.countText, { color: C.textMuted }]}>{filtered.length} jobs</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => router.push(`/job/${item.id}`)}
            isDark={settings.theme === 'dark'}
            staffNames={getStaffNames(item.assignedStaff)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="work-off" size={52} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textMuted }]}>{t.noJobs}</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: C.primary }]}
        onPress={() => router.push('/job/add')}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, paddingHorizontal: Spacing.md, height: 40 },
  searchInput: { flex: 1, fontSize: FontSize.base },
  chips: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full },
  chipText: { fontSize: FontSize.sm, fontWeight: '500' },
  countText: { marginLeft: 'auto', fontSize: FontSize.xs },
  list: { padding: Spacing.md, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 90, right: Spacing.lg, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
});
