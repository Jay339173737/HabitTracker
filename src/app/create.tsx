import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import { useStore } from "../store";
import { colors } from "../theme";

const ICONS = [
  "📝",
  "⏰",
  "📱",
  "💼",
  "🚶",
  "🧘",
  "📓",
  "💧",
  "🎯",
  "💪",
  "🍎",
  "☕",
];

const COLORS = [
  "#7C5CFF",
  "#3DDC97",
  "#E0A33E",
  "#F87171",
  "#38BDF8",
  "#A78BFA",
  "#FB923C",
  "#4ADE80",
];

export default function CreateHabitScreen() {
  const router = useRouter();
  const { routineId: initialRoutineId } = useLocalSearchParams<{
    routineId?: string;
  }>();
  const { routines, addHabit } = useStore();

  const [name, setName] = useState("");
  const [showDesc, setShowDesc] = useState(false);
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [routineId, setRoutineId] = useState<string | undefined>(
    initialRoutineId,
  );
  const [showRoutines, setShowRoutines] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frequency, setFrequency] = useState<"once" | "daily">("daily");

  const selectedRoutine = routines.find((r) => r.id === routineId);
  const canCreate = name.trim().length > 0;

  const create = () => {
    if (!canCreate) return;
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="‹" size={22} color={colors.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>New habit</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Live preview */}
        <View style={styles.previewCard}>
          <View style={[styles.previewIcon, { backgroundColor: color }]}>
            <Icon name={icon} size={26} color="#0B0B0F" strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewName} numberOfLines={1}>
              {name.trim() || "Your habit name"}
            </Text>
            <Text style={styles.previewMeta} numberOfLines={1}>
              {description.trim() ||
                (frequency === "once" ? "One-time" : "Daily")}
            </Text>
          </View>
          <View style={styles.previewCheck}>
            <View style={styles.previewDot} />
          </View>
        </View>

        {/* Name */}
        <Text style={styles.label}>Habit name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Drink water"
          placeholderTextColor={colors.textDim}
          value={name}
          onChangeText={setName}
        />

        {/* Description */}
        {!showDesc ? (
          <TouchableOpacity onPress={() => setShowDesc(true)}>
            <Text style={styles.link}>+ Add description (optional)</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Why does this habit matter?"
              placeholderTextColor={colors.textDim}
              value={description}
              onChangeText={setDescription}
            />
          </>
        )}

        {/* Icon picker */}
        <Text style={styles.label}>Icon</Text>
        <View style={styles.grid}>
          {ICONS.map((i) => {
            const active = icon === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                style={[styles.iconPick, active && styles.iconPickActive]}
                activeOpacity={0.7}
              >
                <Icon
                  name={i}
                  size={22}
                  color={active ? colors.primary : colors.text}
                  strokeWidth={2.2}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Color picker */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => {
            const active = color === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[styles.colorWrap, active && { borderColor: c }]}
                activeOpacity={0.8}
              >
                <View style={[styles.colorDot, { backgroundColor: c }]}>
                  {active && (
                    <Icon name="✓" size={14} color="#fff" strokeWidth={3} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Routine picker */}
        <Text style={styles.label}>Routine</Text>
        <TouchableOpacity
          style={styles.routineRow}
          onPress={() => setShowRoutines(true)}
          activeOpacity={0.8}
        >
          <View style={styles.routineLeft}>
            <Icon
              name="✨"
              size={18}
              color={selectedRoutine ? colors.primary : colors.textDim}
            />
            <Text
              style={[
                styles.routineLabel,
                !selectedRoutine && { color: colors.textDim },
              ]}
            >
              {selectedRoutine ? selectedRoutine.title : "No routine"}
            </Text>
          </View>
          <Icon name="›" size={20} color={colors.textDim} />
        </TouchableOpacity>

        {/* Advanced */}
        <TouchableOpacity
          onPress={() => setShowAdvanced(!showAdvanced)}
          style={styles.advancedHeader}
          activeOpacity={0.8}
        >
          <Text style={styles.label}>Advanced</Text>
          <Text style={styles.advancedChevron}>{showAdvanced ? "−" : "+"}</Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.segmentRow}>
            {(["once", "daily"] as const).map((f) => {
              const active = frequency === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={[styles.segment, active && styles.segmentActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {f === "once" ? "One-time" : "Daily"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create button */}
      <TouchableOpacity
        style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
        onPress={create}
        disabled={!canCreate}
        activeOpacity={0.85}
      >
        <Text style={styles.createText}>Create habit</Text>
      </TouchableOpacity>

      {/* Routine picker modal */}
      <Modal visible={showRoutines} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowRoutines(false)}
          />
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose routine</Text>
            <ScrollView>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setRoutineId(undefined);
                  setShowRoutines(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalItemText}>No routine</Text>
                {!routineId && (
                  <Icon name="✓" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
              {routines.map((r) => {
                const active = routineId === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setRoutineId(r.id);
                      setShowRoutines(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.modalIcon,
                        { backgroundColor: r.color || colors.primary },
                      ]}
                    >
                      <Icon
                        name="✨"
                        size={16}
                        color="#0B0B0F"
                        strokeWidth={2.2}
                      />
                    </View>
                    <Text style={styles.modalItemText}>{r.title}</Text>
                    {active && (
                      <Icon name="✓" size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  title: { color: colors.text, fontSize: 20, fontWeight: "800" },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  previewIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  previewName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  previewMeta: { color: colors.textDim, fontSize: 12 },
  previewCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cardBorder,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.card,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconPick: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPickActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  routineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
  },
  routineLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  routineLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  advancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  advancedChevron: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  segmentActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  segmentText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },

  createBtn: {
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
  createBtnDisabled: { opacity: 0.5 },
  createText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "70%",
    borderTopWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  modalItemText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  modalIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
