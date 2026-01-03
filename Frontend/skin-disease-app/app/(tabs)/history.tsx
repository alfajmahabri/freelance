// app/(tabs)/history.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Calendar, ChevronRight } from 'lucide-react-native';

type Severity = "Low" | "Moderate" | "High";

interface ScanHistory {
  id: number;
  date: string;
  diagnosis: string;
  severity: Severity;
}

const HISTORY: ScanHistory[] = [
  { id: 101, date: 'Today, 9:41 AM', diagnosis: 'Eczema', severity: 'Moderate' },
  { id: 102, date: 'Yesterday, 4:20 PM', diagnosis: 'Acne Vulgaris', severity: 'Low' },
  { id: 103, date: 'Oct 24, 2023', diagnosis: 'Healthy Skin', severity: 'Low' },
  { id: 104, date: 'Sep 12, 2023', diagnosis: 'Heat Rash', severity: 'High' },
];

const isWeb = Platform.OS === 'web';

export default function HistoryTab() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.historyTitle}>Scan History</Text>
      {HISTORY.map((item) => {
        const badgeStyle =
          item.severity === 'High'
            ? styles.severityHigh
            : item.severity === 'Moderate'
            ? styles.severityModerate
            : styles.severityLow;

        return (
          <View key={item.id} style={styles.historyCard}>
            <View style={[styles.historyIcon, badgeStyle]}>
              <Text style={styles.historyIconText}>
                {item.diagnosis.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyDiagnosis}>{item.diagnosis}</Text>
              <View style={styles.historyDateRow}>
                <Calendar size={12} color="#9ca3af" />
                <Text style={styles.historyDateText}>{item.date}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#cbd5f5" />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: isWeb ? 64 : 20,
        paddingVertical: 16,
        paddingBottom: 24,
      },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyIconText: { fontSize: 18, fontWeight: '700' },
  severityHigh: { backgroundColor: '#fee2e2' },
  severityModerate: { backgroundColor: '#ffedd5' },
  severityLow: { backgroundColor: '#dcfce7' },
  historyDiagnosis: { fontSize: 14, fontWeight: '700', color: '#111827' },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  historyDateText: { fontSize: 11, color: '#6b7280' },
});
