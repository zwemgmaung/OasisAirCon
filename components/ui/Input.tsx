import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing } from '../../constants/theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
  style?: ViewStyle;
  isDark?: boolean;
  editable?: boolean;
  required?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export default function Input({
  label, value, onChangeText, placeholder, multiline, numberOfLines = 1,
  keyboardType = 'default', secureTextEntry, style, isDark = false, editable = true,
  required, rightIcon, onRightIconPress,
}: InputProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const [showPass, setShowPass] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: C.textSecondary }]}>
          {label}{required ? <Text style={{ color: C.error }}> *</Text> : null}
        </Text>
      ) : null}
      <View style={[styles.inputWrap, {
        backgroundColor: C.inputBg,
        borderColor: C.border,
      }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.textMuted}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPass}
          editable={editable}
          style={[styles.input, {
            color: C.text,
            height: multiline ? numberOfLines * 24 : 44,
            textAlignVertical: multiline ? 'top' : 'center',
          }]}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.icon}>
            <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} size={20} color={C.textMuted} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.icon}>
            <MaterialIcons name={rightIcon as any} size={20} color={C.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, marginBottom: 6, fontWeight: '500' },
  inputWrap: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  input: { flex: 1, fontSize: FontSize.base, paddingVertical: Spacing.sm },
  icon: { padding: 4 },
});
