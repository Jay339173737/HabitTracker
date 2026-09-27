import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitCard from "./components/HabitCard";
import { useStore } from "./store";
import { colors } from "./theme";

export default function HomeScreen() {
  const router = useRouter();
  const { habits, toggleHabit } = useStore();
  const today = new Date().toISOString().slice(0, 10);

  const completedCount = useMemo(
    () => habits.filter((h) => h.completedDates?.includes(today)).length,
    [habits, today],
  );
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>{greeting}</Text>
          <Text style={styles.title}>Today</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/routines")}
        >
          <Text style={styles.iconText}>⊞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Progress card */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>
          <Text style={styles.progressValue}>
            {completedCount}/{totalCount}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressHint}>
          {totalCount === 0
            ? "Add your first habit to get started"
            : completedCount === totalCount
              ? "All done! Great job 🎉"
              : `${totalCount - completedCount} habit${
                  totalCount - completedCount === 1 ? "" : "s"
                } left — keep the streak alive 🔥`}
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.pillActive}>
          <Text style={styles.pillTextActive}>Today ▾</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pill}
          onPress={() => router.push("/routines")}
        >
          <Text style={styles.pillText}>All Routines ▾</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>
              Tap the + button to create your first habit.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() => toggleHabit(item.id, today)}
          />
        )}
      />
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
    paddingBottom: 12,
    gap: 10,
  },
  eyebrow: {
    fontSize: 13,
    color: colors.textDim,
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 16, color: colors.text },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  progressHint: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textDim,
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  pillActive: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pillText: { color: colors.textDim, fontSize: 13, fontWeight: "500" },
  pillTextActive: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
