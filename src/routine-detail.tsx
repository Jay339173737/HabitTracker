import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "./store";
import { colors } from "./theme";

export default function RoutineDetailScreen() {
  const router = useRouter();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const routine = useStore((s) => s.routines.find((r) => r.id === routineId));
  const addHabitsFromTemplates = useStore((s) => s.addHabitsFromTemplates);

  const [selected, setSelected] = useState<boolean[]>(
    routine ? routine.habits.map(() => true) : [],
  );

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.dim}>Routine not found.</Text>
      </SafeAreaView>
    );
  }

  const allSelected = selected.every(Boolean);
  const selectedCount = selected.filter(Boolean).length;

  const toggleAll = () => setSelected(selected.map(() => !allSelected));
  const toggleOne = (i: number) =>
    setSelected(selected.map((v, idx) => (idx === i ? !v : v)));

  const handleAdd = () => {
    const toAdd = routine.habits
      .filter((_, i) => selected[i])
      .map((h) => ({
        name: h.name,
        icon: h.icon,
        color: h.color,
        frequency: h.frequency,
        routineId: routine.id,
      }));
    if (toAdd.length === 0) return;
    addHabitsFromTemplates(toAdd);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{routine.title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.card}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: routine.color ?? colors.primary },
            ]}
          />
          <Text style={styles.cardTitle}>{routine.title}</Text>
          <Text style={styles.cardDesc}>{routine.description}</Text>
        </View>

        <View style={styles.selectRow}>
          <Text style={styles.selectLabel}>Select Habits</Text>
          <TouchableOpacity onPress={toggleAll}>
            <Text style={styles.link}>
              {allSelected ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        {routine.habits.map((h, i) => (
          <TouchableOpacity
            key={h.name}
            style={styles.habitRow}
            onPress={() => toggleOne(i)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: h.color }]}>
              <Text style={{ fontSize: 20 }}>{h.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitName}>{h.name}</Text>
              <View style={styles.tagsRow}>
                <Text style={styles.tag}>↻ {h.requirement}</Text>
                <Text style={styles.tag}>📅 {h.recurrence}</Text>
              </View>
            </View>
            <View style={[styles.checkbox, selected[i] && styles.checkboxOn]}>
              {selected[i] && <Text style={styles.check}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addBtn, selectedCount === 0 && styles.addBtnDisabled]}
        onPress={handleAdd}
        disabled={selectedCount === 0}
      >
        <Text style={styles.addText}>
          Add {selectedCount} Habit{selectedCount === 1 ? "" : "s"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", padding: 16, gap: 16 },
  back: { color: colors.text, fontSize: 22 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700" },
  card: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 16 },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDesc: { color: colors.textDim, fontSize: 14, textAlign: "center" },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectLabel: { color: colors.text, fontSize: 15, fontWeight: "600" },
  link: { color: colors.primary, fontSize: 14, fontWeight: "600" },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  habitName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  tagsRow: { flexDirection: "row", gap: 10 },
  tag: { color: colors.textDim, fontSize: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  check: { color: "#fff", fontSize: 14, fontWeight: "700" },
  addBtn: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  addBtnDisabled: { opacity: 0.5 },
  addText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dim: { color: colors.textDim, textAlign: "center", marginTop: 40 },
});
