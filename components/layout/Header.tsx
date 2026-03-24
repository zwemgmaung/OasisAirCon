import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';
import { LOGO_URL } from '../../constants/config';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: { icon: string; onPress: () => void };
  rightAction2?: { icon: string; onPress: () => void };
  isDark?: boolean;
  subtitle?: string;
}

export default function Header({ title, showBack, showLogo, rightAction, rightAction2, isDark = false, subtitle }: HeaderProps) {
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + 8;

  return (
    <View style={[styles.container, { backgroundColor: C.headerBg, paddingTop: topPad }]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="arrow-back" size={24} color={C.headerText} />
          </TouchableOpacity>
        ) : showLogo ? (
          <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="cover" transition={200} />
        ) : <View style={{ width: 40 }} />}

        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: C.headerText }]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.75)' }]} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        <View style={styles.rightActions}>
          {rightAction2 ? (
            <TouchableOpacity onPress={rightAction2.onPress} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name={rightAction2.icon as any} size={24} color={C.headerText} />
            </TouchableOpacity>
          ) : null}
          {rightAction ? (
            <TouchableOpacity onPress={rightAction.onPress} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name={rightAction.icon as any} size={24} color={C.headerText} />
            </TouchableOpacity>
          ) : <View style={{ width: 40 }} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...Shadow.md },
  content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  logo: { width: 36, height: 36, borderRadius: 18 },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  subtitle: { fontSize: FontSize.xs, marginTop: 1 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  rightActions: { flexDirection: 'row', gap: 4 },
});
