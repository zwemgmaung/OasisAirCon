import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDark?: boolean;
}

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  disabled, loading, style, textStyle, isDark = false,
}: ButtonProps) {
  const C = isDark ? Colors.dark : Colors.light;

  const bgMap = {
    primary: C.primary,
    secondary: C.surfaceVariant,
    outline: 'transparent',
    ghost: 'transparent',
    danger: '#D32F2F',
  };
  const textMap = {
    primary: '#FFFFFF',
    secondary: C.text,
    outline: C.primary,
    ghost: C.primary,
    danger: '#FFFFFF',
  };
  const sizeH = { sm: 36, md: 44, lg: 52 };
  const sizePad = { sm: Spacing.sm, md: Spacing.md, lg: Spacing.lg };
  const sizeFt = { sm: FontSize.sm, md: FontSize.base, lg: FontSize.lg };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgMap[variant],
          height: sizeH[size],
          paddingHorizontal: sizePad[size],
          opacity: pressed || disabled ? 0.7 : 1,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? C.primary : 'transparent',
        },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={textMap[variant]} size="small" />
        : <Text style={[styles.text, { color: textMap[variant], fontSize: sizeFt[size] }, textStyle]}>{title}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: FontWeight.semibold,
  },
});
