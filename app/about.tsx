import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../contexts/AppContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../constants/theme';
import { LOGO_URL, APP_VERSION } from '../constants/config';
import { getT } from '../constants/i18n';
import Header from '../components/layout/Header';

export default function AboutScreen() {
  const { settings } = useApp();
  const C = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const t = getT(settings.language);
  const isDark = settings.theme === 'dark';

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={[styles.infoRow, { borderBottomColor: C.border }]}>
      <MaterialIcons name={icon as any} size={18} color={C.primary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: C.textMuted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: C.text }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={isDark ? 'light' : 'light'} />
      <Header title={t.appInfo} showBack isDark={isDark} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: C.primaryDark }]}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="cover" transition={300} />
          <Text style={styles.heroTitle}>{t.appName}</Text>
          <Text style={styles.heroTagline}>{t.companyName}</Text>
          <View style={styles.sinceBadge}>
            <Text style={styles.sinceText}>{t.since}</Text>
          </View>
        </View>

        {/* App Info Card */}
        <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
          <Text style={[styles.cardTitle, { color: C.text, borderBottomColor: C.border }]}>{t.appInfo}</Text>
          <InfoRow icon="info" label={t.version} value={APP_VERSION} />
          <InfoRow icon="business" label="Company" value={t.companyName} />
          <InfoRow icon="event" label="Established" value={t.since} />
          <InfoRow icon="code" label={t.developer} value={t.developerName} />
        </View>

        {/* Features Card */}
        <View style={[styles.card, { backgroundColor: C.card, ...Shadow.sm }]}>
          <Text style={[styles.cardTitle, { color: C.text, borderBottomColor: C.border }]}>Features</Text>
          {[
            { icon: 'build', text: 'Job Record Management (Done/Pending)' },
            { icon: 'people', text: 'Staff Management with Photos' },
            { icon: 'point-of-sale', text: 'Sales Records (AC, Fridge, Washer)' },
            { icon: 'shopping-cart', text: 'Purchase Records (Tools, Gas, Parts)' },
            { icon: 'dashboard', text: 'Dashboard with Summary Charts' },
            { icon: 'picture-as-pdf', text: 'Weekly PDF Report Export' },
            { icon: 'photo-camera', text: 'Photo Attachments for Jobs' },
            { icon: 'dark-mode', text: 'Light / Dark Mode' },
            { icon: 'language', text: 'English / Myanmar Language' },
            { icon: 'lock', text: 'Username & Password Authentication' },
            { icon: 'wifi-off', text: 'Offline Storage (Local)' },
          ].map((f, i) => (
            <View key={i} style={[styles.featureRow, { borderBottomColor: C.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: C.surfaceVariant }]}>
                <MaterialIcons name={f.icon as any} size={16} color={C.primary} />
              </View>
              <Text style={[styles.featureText, { color: C.text }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Developer Card */}
        <View style={[styles.devCard, { backgroundColor: C.primaryDark }]}>
          <MaterialIcons name="developer-mode" size={32} color="rgba(255,255,255,0.9)" />
          <Text style={styles.devTitle}>{t.developer}</Text>
          <Text style={styles.devName}>{t.developerName}</Text>
          <Text style={styles.devSub}>Ko Htay Aung (Oasis) Air-Con Co., Ltd.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: Spacing.xl },
  hero: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg },
  logo: { width: 110, height: 110, borderRadius: 55, marginBottom: Spacing.md },
  heroTitle: { color: '#fff', fontSize: FontSize.xxxl, fontWeight: '800', textAlign: 'center' },
  heroTagline: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  sinceBadge: { marginTop: Spacing.md, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: BorderRadius.full },
  sinceText: { color: '#fff', fontWeight: '600', fontSize: FontSize.sm },
  card: { margin: Spacing.md, marginBottom: 0, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  cardTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, padding: Spacing.md, borderBottomWidth: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderBottomWidth: 1 },
  infoLabel: { fontSize: FontSize.xs, marginBottom: 2 },
  infoValue: { fontSize: FontSize.base, fontWeight: '500' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 10, borderBottomWidth: 1 },
  featureIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: FontSize.base, flex: 1 },
  devCard: { margin: Spacing.md, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  devTitle: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm },
  devName: { color: '#fff', fontSize: FontSize.xxl, fontWeight: '700' },
  devSub: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm, textAlign: 'center' },
});
