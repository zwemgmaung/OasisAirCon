import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';
import { StaffMember } from '../../services/storage';
import { LOGO_URL } from '../../constants/config';

interface StaffPickerModalProps {
  visible: boolean;
  staffList: StaffMember[];
  selected: string[];
  onConfirm: (ids: string[]) => void;
  onClose: () => void;
  isDark?: boolean;
}

export default function StaffPickerModal({ visible, staffList, selected, onConfirm, onClose, isDark = false }: StaffPickerModalProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  const toggle = (id: string) => {
    setLocalSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    onConfirm(localSelected);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={[styles.overlay, { backgroundColor: C.overlay }]} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: C.surface }]} onPress={e => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: C.border }]}>
            <Text style={[styles.title, { color: C.text }]}>Assign Staff (min. 2)</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.sub, { color: C.textMuted }]}>Selected: {localSelected.length}</Text>
          <FlatList
            data={staffList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = localSelected.includes(item.id);
              return (
                <TouchableOpacity
                  style={[styles.item, { borderBottomColor: C.border, backgroundColor: isSelected ? C.surfaceVariant : 'transparent' }]}
                  onPress={() => toggle(item.id)}
                >
                  <Image
                    source={item.photo ? { uri: item.photo } : { uri: LOGO_URL }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: C.text }]}>{item.name}</Text>
                    <Text style={[styles.pos, { color: C.textMuted }]}>{item.position}</Text>
                  </View>
                  <MaterialIcons
                    name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={isSelected ? C.primary : C.textMuted}
                  />
                </TouchableOpacity>
              );
            }}
          />
          <View style={[styles.footer, { borderTopColor: C.border }]}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: C.primary, opacity: localSelected.length < 2 ? 0.5 : 1 }]}
              onPress={handleConfirm}
              disabled={localSelected.length < 2}
            >
              <Text style={styles.btnText}>Confirm ({localSelected.length} selected)</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  container: { maxHeight: '80%', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: FontSize.lg, fontWeight: '600' },
  sub: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderBottomWidth: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  name: { fontSize: FontSize.base, fontWeight: '500' },
  pos: { fontSize: FontSize.sm },
  footer: { padding: Spacing.md, borderTopWidth: 1 },
  btn: { borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: FontSize.base },
});
