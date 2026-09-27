import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";

type Props = {
  habit: any;
  onToggle: () => void;
};

export default function HabitCard({ habit, onToggle }: Props) {
  const done = habit.completedToday;

  return (
    <TouchableOpacity
      style={[styles.card, done && styles.cardDone]}
      onPress={onToggle}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: habit.color || colors.primary },
        ]}
      >
        <Text style={styles.iconText}>{habit.icon || "📌"}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.meta}>
          ↻ {habit.requirement || "Daily"}
          {habit.recurrence ? ` · ${habit.recurrence}` : ""}
        </Text>
      </View>

      <View style={[styles.check, done && styles.checkOn]}>
        {done && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  cardDone: {
    borderColor: "rgba(124, 92, 255, 0.45)",
    backgroundColor: "#16141f",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20 },
  info: { flex: 1 },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  meta: { color: colors.textDim, fontSize: 12 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
