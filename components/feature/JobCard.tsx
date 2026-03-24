import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';
import { Job } from '../../services/storage';
import StatusBadge from '../ui/StatusBadge';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  isDark?: boolean;
  staffNames?: string;
}

export default function JobCard({ job, onPress, isDark = false, staffNames }: JobCardProps) {
  const C = isDark ? Colors.dark : Colors.light;

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB');
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={[styles.customerName, { color: C.text }]} numberOfLines={1}>{job.customerName}</Text>
          <Text style={[styles.phone, { color: C.textSecondary }]}>{job.customerPhone}</Text>
        </View>
        <StatusBadge status={job.status} isDark={isDark} size="sm" />
      </View>

      <View style={[styles.divider, { backgroundColor: C.border }]} />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialIcons name="devices" size={14} color={C.textMuted} />
          <Text style={[styles.infoText, { color: C.textSecondary }]} numberOfLines={1}>{job.deviceType}</Text>
        </View>
        {job.acBrand ? (
          <View style={styles.infoItem}>
            <MaterialIcons name="label" size={14} color={C.textMuted} />
            <Text style={[styles.infoText, { color: C.textSecondary }]}>{job.acBrand}{job.acHP ? ` ${job.acHP}HP` : ''}</Text>
          </View>
        ) : null}
        <View style={styles.infoItem}>
          <MaterialIcons name="calendar-today" size={14} color={C.textMuted} />
          <Text style={[styles.infoText, { color: C.textSecondary }]}>{formatDate(job.date)}</Text>
        </View>
      </View>

      {job.problemDescription ? (
        <Text style={[styles.problem, { color: C.textMuted }]} numberOfLines={2}>{job.problemDescription}</Text>
      ) : null}

      <View style={styles.footer}>
        {staffNames ? (
          <View style={styles.infoItem}>
            <MaterialIcons name="people" size={13} color={C.textMuted} />
            <Text style={[styles.staffText, { color: C.textMuted }]} numberOfLines={1}>{staffNames}</Text>
          </View>
        ) : null}
        {job.cost ? (
          <Text style={[styles.cost, { color: C.primary }]}>{parseFloat(job.cost).toLocaleString()} MMK</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.sm },
  left: { flex: 1, marginRight: Spacing.sm },
  customerName: { fontSize: FontSize.lg, fontWeight: '600' },
  phone: { fontSize: FontSize.sm, marginTop: 2 },
  divider: { height: 1, marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.sm },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: FontSize.sm },
  problem: { fontSize: FontSize.sm, marginBottom: Spacing.sm, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  staffText: { fontSize: FontSize.xs, flex: 1 },
  cost: { fontSize: FontSize.sm, fontWeight: '700' },
});
