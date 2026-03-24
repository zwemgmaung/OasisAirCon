import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize } from '../../constants/theme';

interface StatusBadgeProps {
  status: 'Done' | 'Pending' | string;
  isDark?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, isDark = false, size = 'md' }: StatusBadgeProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const isDone = status === 'Done';
  const bg = isDone ? (isDark ? '#1B3A1B' : '#E8F5E9') : (isDark ? '#3A2A00' : '#FFF8E1');
  const color = isDone ? C.done : C.pending;

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color, fontSize: size === 'sm' ? FontSize.xs : FontSize.sm }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontWeight: '600' },
});
