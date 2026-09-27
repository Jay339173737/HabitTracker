import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../store';
import { colors } from '../theme';

const ICONS = ['🎮', '🏃', '📚', '💧', '😴', '🧘', '✍️', '🥗'];
const COLORS = ['#0066CC', '#00AA00', '#CC8800', '#AA00AA', '#CC0000', '#008888'];

export default function CreateHabitScreen() {
  const router = useRouter();
  const { routineId: initialRoutineId } = useLocalSearchParams<{ routineId?: string }>();
  const { routines, addHabit } = useStore();

  const [name, setName] = useState('');
  const [showDesc, setShowDesc] = useState(false);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [routineId, setRoutineId] = useState<string | undefined>(initialRoutineId);
  const [showRoutines, setShowRoutines] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frequency, setFrequency] = useState<'once' | 'daily'>('once');

  const selectedRoutine = routines.find((r) => r.id === routineId);

  const create = () => {
    if (!name.trim()) return;
    addHabit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      routineId,
      frequency,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create habit</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Habit Name"
          placeholderTextColor={colors.textDim}
          value={name}
          onChangeText={setName}
        />

        {!showDesc ? (
          <TouchableOpacity onPress={() => setShowDesc(true)}>
            <Text style={styles.link}>+ Add description (Optional)</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Description"
            placeholderTextColor={colors.textDim}
            value={description}
            onChangeText={setDescription}
          />
        )}

        {/* Icon picker */}
        <Text style={styles.label}>Icon</Text>
        <View style={styles.row}>
          {ICONS.map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setIcon(i)}
              style={[styles.pick, icon === i && styles.pickActive]}
            >
              <Text style={{ fontSize: 20 }}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color picker */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.row}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
            />
          ))}
        </View>

        {/* Choose routine */}
        <TouchableOpacity style={styles.routineRow} onPress={() => setShowRoutines(true)}>
          <Text style={styles.routineLabel}>Choose routine</Text>
          <Text style={styles.link}>{selectedRoutine ? selectedRoutine.title : 'Select ›'}</Text>
        </TouchableOpacity>

        {/* Advanced options */}
        <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)} style={{ marginTop: 20 }}>
          <Text style={styles.label}>Advanced options {showAdvanced ? '▴' : '▾'}</Text>
        </TouchableOpacity>
        {showAdvanced && (
          <View style={styles.row}>
            {(['once', 'daily'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[styles.pick, frequency === f && styles.pickActive]}
              >
                <Text style={{ color: colors.text }}>{f === 'once' ? 'Once' : 'Daily'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.createBtn} onPress={create}>
        <Text style={styles.createText}>Create</Text>
      </TouchableOpacity>

      {/* Routine picker modal */}
      <Modal visible={showRoutines} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Choose routine</Text>
            {routines.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.modalItem}
                onPress={() => {
                  setRoutineId(r.id);
                  setShowRoutines(false);
                }}
              >
                <Text style={{ color: colors.text }}>{r.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalItem} onPress={() => setShowRoutines(false)}>
              <Text style={{ color: colors.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  back: { color: colors.primary, fontSize: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 12,
    color: colors.text,
    fontSize: 15,
  },
  link: { color: colors.primary, fontSize: 14, marginTop: 12 },
  label: { color: colors.text, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pick: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  pickActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotActive: { borderWidth: 3, borderColor: colors.text },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    marginTop: 20,
  },
  routineLabel: { color: colors.text, fontSize: 15 },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 14,
    margin: 16,
    alignItems: 'center',
  },
  createText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.bg, borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 16 },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modalItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
});
