import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface DatePickerModalProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSelect: (date: string) => void;
  isDark?: boolean;
  label?: string;
}

export default function DatePickerModal({ visible, value, onClose, onSelect, isDark = false, label }: DatePickerModalProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(value || today);

  const handleSelect = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={[styles.overlay, { backgroundColor: C.overlay }]} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: C.surface, ...Shadow.lg }]} onPress={e => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: C.border }]}>
            <Text style={[styles.title, { color: C.text }]}>{label || 'Select Date'}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
          <Calendar
            current={selected || today}
            markedDates={{ [selected]: { selected: true, selectedColor: C.primary } }}
            onDayPress={day => setSelected(day.dateString)}
            theme={{
              backgroundColor: C.surface,
              calendarBackground: C.surface,
              textSectionTitleColor: C.textSecondary,
              selectedDayBackgroundColor: C.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: C.primary,
              dayTextColor: C.text,
              textDisabledColor: C.textMuted,
              dotColor: C.primary,
              arrowColor: C.primary,
              monthTextColor: C.text,
              indicatorColor: C.primary,
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: C.primary }]}
              onPress={handleSelect}
            >
              <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.md },
  container: { width: '100%', maxWidth: 380, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: FontSize.lg, fontWeight: '600' },
  footer: { padding: Spacing.md },
  btn: { borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: FontSize.base },
});
