import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import type { Habit } from '../store';

export default function HabitCard({ habit, onToggle }: { habit: Habit; onToggle: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const done = habit.completedDates.includes(today);

  return (
    <View style={styles.card}>
      <Text style={{ fontSize: 22 }}>{habit.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.dim}>{habit.frequency === 'once' ? 'Once' : 'Daily'}</Text>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.check, done && { backgroundColor: colors.green, borderColor: colors.green }]}
      >
        <Text>{done ? '✓' : ''}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  dim: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
