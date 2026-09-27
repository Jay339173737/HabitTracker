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
import Icon from "../components/Icon";
import { useStore } from "../store";
import { colors } from "../theme";

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
        description: h.requirement,
        frequency: h.frequency,
        routineId: routine.id,
      }));
    if (toAdd.length === 0) return;
    addHabitsFromTemplates(toAdd as any);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="‹" size={22} color={colors.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>{routine.title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <View style={styles.hero}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: routine.color ?? colors.primary },
            ]}
          >
            <Icon name="✨" size={40} color="#0B0B0F" strokeWidth={2} />
          </View>
          <Text style={styles.heroTitle}>{routine.title}</Text>
          <Text style={styles.heroDesc}>{routine.description}</Text>
          <View style={styles.heroPillRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>
                {routine.habitCount} habits
              </Text>
            </View>
            {routine.premium && (
              <View style={[styles.heroPill, styles.heroPillPremium]}>
                <Text style={styles.heroPillTextPremium}>Premium</Text>
              </View>
            )}
          </View>
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
            key={h.name + i}
            style={styles.habitRow}
            onPress={() => toggleOne(i)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: h.color }]}>
              <Icon name={h.icon} size={22} color="#0B0B0F" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitName}>{h.name}</Text>
              <View style={styles.tagsRow}>
                <Text style={styles.tag}>{h.requirement}</Text>
                <Text style={styles.tag}>• {h.recurrence}</Text>
              </View>
            </View>
            <View style={[styles.checkbox, selected[i] && styles.checkboxOn]}>
              {selected[i] && (
                <Icon name="✓" size={14} color="#fff" strokeWidth={3} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addBtn, selectedCount === 0 && styles.addBtnDisabled]}
        onPress={handleAdd}
        disabled={selectedCount === 0}
        activeOpacity={0.85}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.text, fontSize: 18, fontWeight: "800" },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroDesc: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 14,
  },
  heroPillRow: { flexDirection: "row", gap: 8 },
  heroPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroPillPremium: { backgroundColor: "rgba(224, 163, 62, 0.18)" },
  heroPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  heroPillTextPremium: {
    color: colors.premium,
    fontSize: 12,
    fontWeight: "700",
  },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  selectLabel: { color: colors.text, fontSize: 15, fontWeight: "700" },
  link: { color: colors.primary, fontSize: 13, fontWeight: "700" },
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
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  habitName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  tagsRow: { flexDirection: "row", gap: 6 },
  tag: { color: colors.textDim, fontSize: 12 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addBtn: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnDisabled: { opacity: 0.5 },
  addText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  dim: { color: colors.textDim, textAlign: "center", marginTop: 40 },
});
