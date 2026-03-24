import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../constants/theme';
import { getT } from '../constants/i18n';
import { LOGO_URL } from '../constants/config';
import Header from '../components/layout/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { exportWeeklyJobsPDF } from '../services/pdfExport';

export default function SettingsScreen() {
  const { settings, updateSettings, accounts, addAccount, deleteAccount, updateAccount, logout, jobs, staff } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const router = useRouter();
  const isDark = settings.theme === 'dark';

  // PDF Export
  const [exportLoading, setExportLoading] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d;
  });
  const [toDate, setToDate] = useState(new Date());

  // Account Management
  const [showAddAcc, setShowAddAcc] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editAccId, setEditAccId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await exportWeeklyJobsPDF(jobs, staff, fromDate, toDate);
      Alert.alert(t.success, t.exportSuccess);
    } catch (e) {
      Alert.alert(t.error, t.exportError);
    }
    setExportLoading(false);
  };

  const handleAddAccount = async () => {
    if (!newUsername.trim() || !newPassword.trim()) { Alert.alert(t.error, 'Both fields required.'); return; }
    const ok = await addAccount(newUsername.trim(), newPassword);
    if (!ok) Alert.alert(t.error, 'Username already exists.');
    else { setNewUsername(''); setNewPassword(''); setShowAddAcc(false); Alert.alert(t.success, t.updateSuccess); }
  };

  const handleUpdateAccount = async () => {
    if (!editUsername.trim() || !editPassword.trim()) { Alert.alert(t.error, 'Both fields required.'); return; }
    const ok = await updateAccount(editAccId!, editUsername.trim(), editPassword);
    if (!ok) Alert.alert(t.error, 'Username already taken.');
    else { setEditAccId(null); Alert.alert(t.success, t.updateSuccess); }
  };

  const handleDeleteAccount = (id: string, username: string) => {
    if (accounts.length <= 1) { Alert.alert(t.warning, 'Cannot delete the last account.'); return; }
    Alert.alert(t.deleteAccount, `Delete account "${username}"?`, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => deleteAccount(id) },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(t.logout, 'Are you sure you want to logout?', [
      { text: t.cancel, style: 'cancel' },
      { text: t.logout, style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
    ]);
  };

  const SectionCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
      <Text style={[styles.cardTitle, { color: C.text, borderBottomColor: C.border }]}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) => (
    <View style={[styles.settingRow, { borderBottomColor: C.border }]}>
      <View style={styles.settingLeft}>
        <MaterialIcons name={icon as any} size={20} color={C.primary} />
        <Text style={[styles.settingLabel, { color: C.text }]}>{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <Header title={t.settings} showBack isDark={isDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Appearance */}
          <SectionCard title="Appearance">
            <SettingRow icon="language" label={t.language}>
              <View style={styles.langToggle}>
                <TouchableOpacity
                  style={[styles.langBtn, { backgroundColor: settings.language === 'en' ? C.primary : C.surfaceVariant }]}
                  onPress={() => updateSettings({ language: 'en' })}
                >
                  <Text style={[styles.langBtnText, { color: settings.language === 'en' ? '#fff' : C.text }]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.langBtn, { backgroundColor: settings.language === 'my' ? C.primary : C.surfaceVariant }]}
                  onPress={() => updateSettings({ language: 'my' })}
                >
                  <Text style={[styles.langBtnText, { color: settings.language === 'my' ? '#fff' : C.text }]}>မြန်မာ</Text>
                </TouchableOpacity>
              </View>
            </SettingRow>
            <SettingRow icon="dark-mode" label={t.darkMode}>
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={v => updateSettings({ theme: v ? 'dark' : 'light' })}
                trackColor={{ true: C.primary, false: C.border }}
                thumbColor="#fff"
              />
            </SettingRow>
          </SectionCard>

          {/* PDF Export */}
          <SectionCard title={t.weeklyReport}>
            <View style={{ padding: Spacing.sm }}>
              <Text style={[styles.exportNote, { color: C.textMuted }]}>Export jobs from the past week as PDF</Text>
              <View style={styles.dateRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dateLabel, { color: C.textSecondary }]}>From</Text>
                  <Text style={[styles.dateVal, { color: C.text }]}>{fromDate.toLocaleDateString('en-GB')}</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={18} color={C.textMuted} />
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={[styles.dateLabel, { color: C.textSecondary }]}>To</Text>
                  <Text style={[styles.dateVal, { color: C.text }]}>{toDate.toLocaleDateString('en-GB')}</Text>
                </View>
              </View>
              <Button
                title={exportLoading ? 'Generating...' : `${t.exportPDF} (${t.weeklyReport})`}
                onPress={handleExport}
                loading={exportLoading}
                isDark={isDark}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </SectionCard>

          {/* Account Management */}
          <SectionCard title={t.manageAccounts}>
            {accounts.map(acc => (
              <View key={acc.id}>
                {editAccId === acc.id ? (
                  <View style={[styles.editAccWrap, { borderBottomColor: C.border }]}>
                    <Input label="Username" value={editUsername} onChangeText={setEditUsername} isDark={isDark} />
                    <Input label="New Password" value={editPassword} onChangeText={setEditPassword} secureTextEntry isDark={isDark} />
                    <View style={styles.editBtnRow}>
                      <Button title={t.save} onPress={handleUpdateAccount} isDark={isDark} style={{ flex: 1 }} size="sm" />
                      <Button title={t.cancel} onPress={() => setEditAccId(null)} variant="outline" isDark={isDark} style={{ flex: 1 }} size="sm" />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.accRow, { borderBottomColor: C.border }]}>
                    <MaterialIcons name="account-circle" size={24} color={C.primary} />
                    <Text style={[styles.accUsername, { color: C.text }]}>{acc.username}</Text>
                    <TouchableOpacity onPress={() => { setEditAccId(acc.id); setEditUsername(acc.username); setEditPassword(''); }} style={styles.accAction}>
                      <MaterialIcons name="edit" size={18} color={C.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAccount(acc.id, acc.username)} style={styles.accAction}>
                      <MaterialIcons name="delete" size={18} color={C.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {showAddAcc ? (
              <View style={styles.addAccWrap}>
                <Input label="New Username" value={newUsername} onChangeText={setNewUsername} isDark={isDark} />
                <Input label="Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry isDark={isDark} />
                <View style={styles.editBtnRow}>
                  <Button title={t.add} onPress={handleAddAccount} isDark={isDark} style={{ flex: 1 }} size="sm" />
                  <Button title={t.cancel} onPress={() => setShowAddAcc(false)} variant="outline" isDark={isDark} style={{ flex: 1 }} size="sm" />
                </View>
              </View>
            ) : (
              <TouchableOpacity style={[styles.addAccBtn, { borderColor: C.border }]} onPress={() => setShowAddAcc(true)}>
                <MaterialIcons name="person-add" size={18} color={C.primary} />
                <Text style={[styles.addAccText, { color: C.primary }]}>{t.addAccount}</Text>
              </TouchableOpacity>
            )}
          </SectionCard>

          {/* Logout */}
          <Button title={t.logout} onPress={handleLogout} variant="danger" isDark={isDark} style={{ marginBottom: Spacing.md }} />

          {/* About link */}
          <TouchableOpacity style={[styles.aboutLink, { borderColor: C.border }]} onPress={() => router.push('/about')}>
            <Image source={{ uri: LOGO_URL }} style={styles.aboutLogo} contentFit="cover" />
            <Text style={[styles.aboutText, { color: C.textSecondary }]}>About Oasis Air-Con App</Text>
            <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: Spacing.md },
  card: { borderRadius: BorderRadius.lg, marginBottom: Spacing.md, overflow: 'hidden' },
  cardTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, padding: Spacing.md, borderBottomWidth: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 14, borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  settingLabel: { fontSize: FontSize.base },
  langToggle: { flexDirection: 'row', gap: 6 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  langBtnText: { fontSize: FontSize.sm, fontWeight: '600' },
  exportNote: { fontSize: FontSize.sm, marginBottom: Spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  dateLabel: { fontSize: FontSize.xs },
  dateVal: { fontSize: FontSize.base, fontWeight: '600' },
  accRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, gap: Spacing.sm },
  accUsername: { flex: 1, fontSize: FontSize.base },
  accAction: { padding: 6 },
  editAccWrap: { padding: Spacing.md, borderBottomWidth: 1 },
  editBtnRow: { flexDirection: 'row', gap: Spacing.sm },
  addAccWrap: { padding: Spacing.md },
  addAccBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderStyle: 'dashed' },
  addAccText: { fontSize: FontSize.base, fontWeight: '500' },
  aboutLink: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  aboutLogo: { width: 32, height: 32, borderRadius: 16 },
  aboutText: { flex: 1, fontSize: FontSize.base },
});
