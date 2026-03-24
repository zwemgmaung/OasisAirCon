import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../constants/theme';
import { LOGO_URL, DEFAULT_USERNAME, DEFAULT_PASSWORD } from '../constants/config';
import { getT } from '../constants/i18n';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginScreen() {
  const { login, resetToDefault, settings } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(t.warning, t.enterCredentials);
      return;
    }
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(t.error, t.invalidCredentials);
    }
  };

  const handleForgot = () => {
    Alert.alert(
      t.forgotPassword,
      `${t.forgotPasswordDesc}\n\n${t.defaultUsername}\n${t.defaultPassword}`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: async () => {
            await resetToDefault();
            Alert.alert(t.success, t.resetSuccess);
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="cover" transition={300} />
          </View>

          {/* App Name */}
          <Text style={[styles.appName, { color: C.primary }]}>{t.appName}</Text>
          <Text style={[styles.tagline, { color: C.textSecondary }]}>{t.appTagline}</Text>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: C.card, ...Shadow.lg }]}>
            <Text style={[styles.loginTitle, { color: C.text }]}>{t.login}</Text>

            <Input
              label={t.username}
              value={username}
              onChangeText={setUsername}
              placeholder="oasis"
              isDark={settings.theme === 'dark'}
              required
            />
            <Input
              label={t.password}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              isDark={settings.theme === 'dark'}
              required
            />

            <Button
              title={t.login}
              onPress={handleLogin}
              loading={loading}
              isDark={settings.theme === 'dark'}
              style={{ marginTop: 8 }}
            />

            <TouchableOpacity onPress={handleForgot} style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: C.primary }]}>{t.forgotPassword}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { color: C.textMuted }]}>
            Ko Htay Aung (Oasis) Air-Con Co., Ltd. © Since 2000
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: Spacing.lg },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.md },
  logo: { width: 120, height: 120, borderRadius: 60 },
  appName: { fontSize: FontSize.xxxl, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  tagline: { fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 20 },
  card: { width: '100%', borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.xl },
  loginTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.lg },
  forgotBtn: { alignItems: 'center', marginTop: Spacing.md, paddingVertical: Spacing.sm },
  forgotText: { fontSize: FontSize.sm, fontWeight: '500' },
  footer: { fontSize: FontSize.xs, textAlign: 'center' },
});
