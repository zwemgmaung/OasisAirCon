import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';

interface SummaryChartProps {
  title: string;
  done: number;
  pending: number;
  isDark?: boolean;
}

const W = Dimensions.get('window').width;

export default function SummaryChart({ title, done, pending, isDark = false }: SummaryChartProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const total = done + pending;
  const doneRatio = total === 0 ? 0 : done / total;
  const pendingRatio = total === 0 ? 0 : pending / total;
  const barWidth = W - 32 - 32 - 32; // screen - padding - card padding

  return (
    <View style={[styles.card, { backgroundColor: C.card, ...Shadow.md }]}>
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: C.done }]}>{done}</Text>
          <Text style={[styles.statLabel, { color: C.textMuted }]}>Done</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: C.pending }]}>{pending}</Text>
          <Text style={[styles.statLabel, { color: C.textMuted }]}>Pending</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: C.text }]}>{total}</Text>
          <Text style={[styles.statLabel, { color: C.textMuted }]}>Total</Text>
        </View>
      </View>

      {total > 0 ? (
        <View style={styles.barContainer}>
          <View style={[styles.barTrack, { backgroundColor: C.border }]}>
            <View style={[styles.barFill, { backgroundColor: C.done, width: `${doneRatio * 100}%` }]} />
            <View style={[styles.barFill, { backgroundColor: C.pending, width: `${pendingRatio * 100}%` }]} />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: C.done }]} />
              <Text style={[styles.legendText, { color: C.textSecondary }]}>Done {Math.round(doneRatio * 100)}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: C.pending }]} />
              <Text style={[styles.legendText, { color: C.textSecondary }]}>Pending {Math.round(pendingRatio * 100)}%</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={[styles.empty, { color: C.textMuted }]}>No jobs yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  title: { fontSize: FontSize.base, fontWeight: '600', marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  stat: { alignItems: 'center' },
  statNum: { fontSize: FontSize.xxl, fontWeight: '700' },
  statLabel: { fontSize: FontSize.xs, marginTop: 2 },
  barContainer: {},
  barTrack: { height: 12, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%' },
  legend: { flexDirection: 'row', gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs },
  empty: { textAlign: 'center', fontSize: FontSize.sm, paddingVertical: Spacing.sm },
});
