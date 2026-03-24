import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';
import { StaffMember } from '../../services/storage';
import { LOGO_URL } from '../../constants/config';

interface StaffCardProps {
  member: StaffMember;
  onPress: () => void;
  isDark?: boolean;
}

export default function StaffCard({ member, onPress, isDark = false }: StaffCardProps) {
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={member.photo ? { uri: member.photo } : { uri: LOGO_URL }}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: C.text }]}>{member.name}</Text>
        <View style={[styles.posBadge, { backgroundColor: C.surfaceVariant }]}>
          <Text style={[styles.pos, { color: C.primary }]}>{member.position}</Text>
        </View>
        {member.phone ? (
          <View style={styles.row}>
            <MaterialIcons name="phone" size={13} color={C.textMuted} />
            <Text style={[styles.detail, { color: C.textSecondary }]}>{member.phone}</Text>
          </View>
        ) : null}
        {member.address ? (
          <View style={styles.row}>
            <MaterialIcons name="location-on" size={13} color={C.textMuted} />
            <Text style={[styles.detail, { color: C.textSecondary }]} numberOfLines={1}>{member.address}</Text>
          </View>
        ) : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={C.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  info: { flex: 1, gap: 4 },
  name: { fontSize: FontSize.base, fontWeight: '600' },
  posBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  pos: { fontSize: FontSize.xs, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detail: { fontSize: FontSize.sm, flex: 1 },
});
