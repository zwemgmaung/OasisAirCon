import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { LOGO_URL } from '../../constants/config';
import { getT } from '../../constants/i18n';
import SummaryChart from '../../components/feature/SummaryChart';
import JobCard from '../../components/feature/JobCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function DashboardScreen() {
  const { settings, jobs, staff, sales, purchases, isOnline, currentUser, logout } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const todayJobs = useMemo(() => jobs.filter(j => j.date === todayStr), [jobs, todayStr]);
  const monthJobs = useMemo(() => jobs.filter(j => {
    const d = new Date(j.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }), [jobs, thisMonth, thisYear]);

  const todayDone = todayJobs.filter(j => j.status === 'Done').length;
  const todayPending = todayJobs.filter(j => j.status === 'Pending').length;
  const monthDone = monthJobs.filter(j => j.status === 'Done').length;
  const monthPending = monthJobs.filter(j => j.status === 'Pending').length;

  const totalRevenue = useMemo(() => sales.reduce((s, i) => s + parseFloat(i.price || '0'), 0), [sales]);
  const totalExpense = useMemo(() => purchases.reduce((s, i) => s + parseFloat(i.price || '0'), 0), [purchases]);

  const recentJobs = useMemo(() => [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5), [jobs]);

  const getStaffNames = (ids: string[]) =>
    ids.map(id => staff.find(s => s.id === id)?.name || '').filter(Boolean).join(', ');

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'light'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.headerBg, paddingTop: insets.top + 8 }]}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="cover" />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t.appName}</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#69F0AE' : '#FF5252' }]} />
            <Text style={styles.onlineText}>{isOnline ? t.online : t.offline}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconBtn}>
            <MaterialIcons name="settings" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
            <MaterialIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Greeting */}
        <View style={styles.greetWrap}>
          <Text style={[styles.greet, { color: C.text }]}>Welcome, {currentUser} 👋</Text>
          <Text style={[styles.greetDate, { color: C.textSecondary }]}>
            {today.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: C.card, ...Shadow.sm }]} onPress={() => router.push('/(tabs)/sales')}>
            <MaterialIcons name="trending-up" size={22} color={C.done} />
            <Text style={[styles.statNum, { color: C.done }]}>{totalRevenue.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: C.textMuted }]}>Total Revenue</Text>
            <Text style={[styles.statMMK, { color: C.textMuted }]}>MMK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: C.card, ...Shadow.sm }]} onPress={() => router.push('/(tabs)/purchase')}>
            <MaterialIcons name="trending-down" size={22} color={C.pending} />
            <Text style={[styles.statNum, { color: C.pending }]}>{totalExpense.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: C.textMuted }]}>Total Expense</Text>
            <Text style={[styles.statMMK, { color: C.textMuted }]}>MMK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: C.card, ...Shadow.sm }]} onPress={() => router.push('/(tabs)/staff')}>
            <MaterialIcons name="people" size={22} color={C.primary} />
            <Text style={[styles.statNum, { color: C.primary }]}>{staff.length}</Text>
            <Text style={[styles.statLabel, { color: C.textMuted }]}>Staff</Text>
          </TouchableOpacity>
        </View>

        {/* Today Chart */}
        <SummaryChart title={t.todayJobs} done={todayDone} pending={todayPending} isDark={settings.theme === 'dark'} />

        {/* This Month Chart */}
        <SummaryChart title={t.thisMonthJobs} done={monthDone} pending={monthPending} isDark={settings.theme === 'dark'} />

        {/* Quick Actions */}
        <View style={[styles.actionsCard, { backgroundColor: C.card, ...Shadow.sm }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.surfaceVariant }]} onPress={() => router.push('/job/add')}>
              <MaterialIcons name="add-circle" size={26} color={C.primary} />
              <Text style={[styles.actionLabel, { color: C.text }]}>New Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.surfaceVariant }]} onPress={() => router.push('/sale/add')}>
              <MaterialIcons name="sell" size={26} color={C.done} />
              <Text style={[styles.actionLabel, { color: C.text }]}>New Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.surfaceVariant }]} onPress={() => router.push('/purchase/add')}>
              <MaterialIcons name="shopping-bag" size={26} color={C.pending} />
              <Text style={[styles.actionLabel, { color: C.text }]}>Purchase</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.surfaceVariant }]} onPress={() => router.push('/about')}>
              <MaterialIcons name="info" size={26} color={C.info} />
              <Text style={[styles.actionLabel, { color: C.text }]}>About</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>{t.recentJobs}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={[styles.seeAll, { color: C.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentJobs.length === 0
          ? <View style={[styles.emptyCard, { backgroundColor: C.card }]}>
              <MaterialIcons name="work-off" size={40} color={C.textMuted} />
              <Text style={[styles.emptyText, { color: C.textMuted }]}>{t.noJobs}</Text>
            </View>
          : recentJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => router.push(`/job/${job.id}`)}
                isDark={settings.theme === 'dark'}
                staffNames={getStaffNames(job.assignedStaff)}
              />
            ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  logo: { width: 40, height: 40, borderRadius: 20 },
  headerCenter: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.md },
  greetWrap: { marginBottom: Spacing.md },
  greet: { fontSize: FontSize.xl, fontWeight: '700' },
  greetDate: { fontSize: FontSize.sm, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: { flex: 1, borderRadius: BorderRadius.lg, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  statNum: { fontSize: FontSize.base, fontWeight: '700' },
  statLabel: { fontSize: 9, textAlign: 'center' },
  statMMK: { fontSize: 8 },
  actionsCard: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flex: 1, borderRadius: BorderRadius.md, alignItems: 'center', paddingVertical: Spacing.sm, gap: 4 },
  actionLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700' },
  seeAll: { fontSize: FontSize.sm, fontWeight: '500' },
  emptyCard: { borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, textAlign: 'center' },
});
