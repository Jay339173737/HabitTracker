import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import HabitCard from '../../components/HabitCard';
import { useStore } from '../../store';
import { colors } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, toggleHabit } = useStore();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Habit</Text>
        <TouchableOpacity onPress={() => router.push('/routines')}>
          <Text style={styles.headerBtn}>⊞</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={styles.headerBtn}>☰</Text></TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterActive}>
          <Text style={styles.filterTextActive}>Today ▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filter} onPress={() => router.push('/routines')}>
          <Text style={styles.filterText}>All Routines ▾</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No habits yet. Tap the + button to create one.</Text>
        }
        renderItem={({ item }) => (
          <HabitCard habit={item} onToggle={() => toggleHabit(item.id, today)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', flex: 1 },
  headerBtn: { fontSize: 18, color: colors.text },
  filters: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  filter: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterActive: { backgroundColor: colors.primarySoft, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  filterText: { color: colors.textDim, fontSize: 13 },
  filterTextActive: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 60 },
});
