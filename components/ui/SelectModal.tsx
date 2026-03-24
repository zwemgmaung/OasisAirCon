import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  isDark?: boolean;
}

export default function SelectModal({ visible, title, options, selected, onSelect, onClose, isDark = false }: SelectModalProps) {
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={[styles.overlay, { backgroundColor: C.overlay }]} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: C.surface }]} onPress={e => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: C.border }]}>
            <Text style={[styles.title, { color: C.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isSelected = item === selected;
              return (
                <TouchableOpacity
                  style={[styles.item, { borderBottomColor: C.border, backgroundColor: isSelected ? C.surfaceVariant : 'transparent' }]}
                  onPress={() => { onSelect(item); onClose(); }}
                >
                  <Text style={[styles.itemText, { color: isSelected ? C.primary : C.text }]}>{item}</Text>
                  {isSelected && <MaterialIcons name="check" size={18} color={C.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  container: { maxHeight: '70%', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, ...Shadow.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: FontSize.lg, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1 },
  itemText: { fontSize: FontSize.base },
});
