// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  User,
  FileText,
  Settings,
  ChevronRight,
  Bell,
  LogOut,
} from 'lucide-react-native';
import LoginScreen from '../auth/login';
import RegisterScreen from '../auth/register';

const isWeb = Platform.OS === 'web';

export default function ProfileTab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleLogin = (email: string, password: string) => {
    // TODO: connect with Django API
    console.log('Login:', email, password);
    setIsLoggedIn(true);
  };

  const handleRegister = (data: {
    name: string;
    email: string;
    pwd: string;
    age: string;
    gender: string;
    skinType: string;
  }) => {
    // TODO: send data to Django API
    console.log('Register:', data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return !isLoggedIn ? (
    authView === 'login' ? (
      <LoginScreen
        onSwitch={() => setAuthView('register')}
        onLogin={handleLogin}
      />
    ) : (
      <RegisterScreen
        onRegister={handleRegister}
      />
    )
  ) : (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatarWrapper}>
          <Image
            source={{
              uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=John',
            }}
            style={styles.profileAvatar}
          />
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileSubtitle}>Premium Member</Text>
      </View>

      <View style={styles.profileStatsRow}>
        <View style={styles.profileStatPrimary}>
          <Text style={styles.profileStatNumber}>12</Text>
          <Text style={styles.profileStatLabel}>Total Scans</Text>
        </View>
        <View style={styles.profileStatSecondary}>
          <Text style={styles.profileStatNumberSecondary}>4.9</Text>
          <Text style={styles.profileStatLabelSecondary}>Skin Score</Text>
        </View>
      </View>

      <View style={styles.settingsCard}>
        {[
          { icon: <User size={18} color="#0f172a" />, label: 'Personal Information' },
          { icon: <FileText size={18} color="#0f172a" />, label: 'Medical Records' },
          { icon: <Bell size={18} color="#0f172a" />, label: 'Notifications' },
          { icon: <Settings size={18} color="#0f172a" />, label: 'App Settings' },
        ].map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.settingsRow,
              idx === 3 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.settingsLeft}>
              {item.icon}
              <Text style={styles.settingsLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={16} color="#cbd5f5" />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <LogOut size={18} color="#b91c1c" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: isWeb ? 64 : 20,
        paddingVertical: 16,
        paddingBottom: 24,
      },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  profileAvatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#ccfbf1',
    marginBottom: 8,
    elevation: 3,
  },
  profileAvatar: { width: '100%', height: '100%' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  profileSubtitle: { fontSize: 13, color: '#6b7280' },
  profileStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  profileStatPrimary: {
    flex: 1,
    backgroundColor: '#0f766e',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },
  profileStatNumber: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  profileStatLabel: { fontSize: 10, color: '#ccfbf1' },
  profileStatSecondary: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  profileStatNumberSecondary: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  profileStatLabelSecondary: { fontSize: 10, color: '#9ca3af' },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsLabel: { fontSize: 13, color: '#111827' },
  logoutButton: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b91c1c',
  },
});
