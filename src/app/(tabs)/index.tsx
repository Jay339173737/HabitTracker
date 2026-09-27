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
import Icon from "../../components/Icon";
import { useStore } from "../../store";
import { colors } from "../../theme";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function HomeScreen() {
  const router = useRouter();
  const { habits, toggleHabit } = useStore() as any;
  const today = new Date().toISOString().slice(0, 10);

  const isDone = (h: any) => {
    if (typeof h?.completedToday === "boolean") return h.completedToday;
    if (Array.isArray(h?.completedDates))
      return h.completedDates.includes(today);
    return false;
  };

  const completedCount = useMemo(
    () => habits.filter((h: any) => isDone(h)).length,
    [habits],
  );
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const pct = Math.round(progress * 100);
  const allDone = totalCount > 0 && completedCount === totalCount;

  const last7 = useMemo(() => {
    const days: { iso: string; letter: string; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        iso: d.toISOString().slice(0, 10),
        letter: DAY_LETTERS[d.getDay()],
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  const streakFor = (h: any): number => {
    if (!Array.isArray(h?.completedDates)) return 0;
    let streak = 0;
    const d = new Date();
    if (!h.completedDates.includes(d.toISOString().slice(0, 10))) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const iso = d.toISOString().slice(0, 10);
      if (h.completedDates.includes(iso)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const bestStreak = useMemo(
    () =>
      habits.reduce((max: number, h: any) => Math.max(max, streakFor(h)), 0),
    [habits],
  );

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>{dateLabel}</Text>
          <Text style={styles.title}>{greeting}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/routines")}
        >
          <Icon name="⊞" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.pctBadge}>
          <Text style={styles.pctText}>{pct}%</Text>
          <Text style={styles.pctSub}>done</Text>
        </View>
        <View style={styles.heroRight}>
          <Text style={styles.heroLabel}>TODAY</Text>
          <Text style={styles.heroValue}>
            {completedCount}
            <Text style={styles.heroValueDim}> / {totalCount}</Text>
          </Text>
          <Text style={styles.heroHint}>
            {totalCount === 0
              ? "No habits yet"
              : allDone
                ? "Perfect day!"
                : `${totalCount - completedCount} left to go`}
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
        </View>
      </View>

      {/* Stat chips */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Icon name="🔥" size={20} color={colors.premium} />
          <View>
            <Text style={styles.statValue}>{bestStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
        <View style={styles.statChip}>
          <Icon name="📅" size={20} color={colors.primary} />
          <View>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
        </View>
        <View style={styles.statChip}>
          <Icon name="✓" size={20} color={colors.success} />
          <View>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Week strip */}
      <View style={styles.weekRow}>
        {last7.map((d, i) => {
          const allDoneThatDay =
            habits.length > 0 &&
            habits.every((h: any) =>
              Array.isArray(h.completedDates)
                ? h.completedDates.includes(d.iso)
                : false,
            );
          const anyDoneThatDay = habits.some((h: any) =>
            Array.isArray(h.completedDates)
              ? h.completedDates.includes(d.iso)
              : false,
          );
          const dotColor = allDoneThatDay
            ? colors.primary
            : anyDoneThatDay
              ? colors.primarySoft
              : colors.card;
          return (
            <View key={d.iso + i} style={styles.dayCol}>
              <Text
                style={[styles.dayLetter, d.isToday && styles.dayLetterToday]}
              >
                {d.letter}
              </Text>
              <View
                style={[
                  styles.dayDot,
                  { backgroundColor: dotColor },
                  d.isToday && styles.dayDotToday,
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your habits</Text>
        <TouchableOpacity onPress={() => router.push("/routines")}>
          <Text style={styles.sectionLink}>Browse routines</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h: any) => h.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Start your first habit</Text>
            <Text style={styles.emptyText}>
              Tap the + button, or browse routines to pick a template.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push("/routines")}
            >
              <Text style={styles.emptyBtnText}>Browse routines</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }: any) => {
          const done = isDone(item);
          const streak = streakFor(item);
          return (
            <TouchableOpacity
              style={[styles.card, done && styles.cardDone]}
              onPress={() => toggleHabit(item.id, today)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: item.color || colors.primary },
                ]}
              >
                <Icon
                  name={item.icon || "📝"}
                  size={26}
                  color="#0B0B0F"
                  strokeWidth={2.2}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {streak > 0 && (
                    <View style={styles.streakPill}>
                      <Text style={styles.streakPillText}>{streak} day</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {item.description ||
                    (item.frequency === "once" ? "One-time" : "Daily")}
                </Text>
                <View style={styles.miniWeek}>
                  {last7.map((d, i) => {
                    const histDone = Array.isArray(item.completedDates)
                      ? item.completedDates.includes(d.iso)
                      : d.iso === today && done;
                    return (
                      <View
                        key={d.iso + i}
                        style={[
                          styles.miniDot,
                          histDone && styles.miniDotOn,
                          d.isToday && styles.miniDotToday,
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
              <View style={[styles.check, done && styles.checkOn]}>
                {done ? (
                  <Icon name="✓" size={16} color="#fff" strokeWidth={3} />
                ) : (
                  <View style={styles.checkHollow} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
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
    paddingBottom: 16,
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
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

  hero: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  pctBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 8,
    borderColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  pctText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 24,
  },
  pctSub: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heroRight: { flex: 1 },
  heroLabel: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: "700",
    letterSpacing: 1,
  },
  heroValue: {
    fontSize: 30,
    color: colors.text,
    fontWeight: "800",
    marginTop: 2,
    marginBottom: 2,
  },
  heroValueDim: { color: colors.textDim, fontWeight: "700" },
  heroHint: { fontSize: 12, color: colors.textDim, marginBottom: 10 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 12,
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18,
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  dayCol: { alignItems: "center", gap: 6, flex: 1 },
  dayLetter: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dayLetterToday: { color: colors.primary },
  dayDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dayDotToday: { borderColor: colors.primary, borderWidth: 2 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sectionLink: { color: colors.primary, fontSize: 13, fontWeight: "700" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  cardDone: {
    borderColor: "rgba(124, 92, 255, 0.5)",
    backgroundColor: "#16141f",
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 2,
  },
  cardName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  streakPill: {
    backgroundColor: "rgba(224, 163, 62, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  streakPillText: { color: colors.premium, fontSize: 11, fontWeight: "800" },
  cardMeta: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  miniWeek: { flexDirection: "row", gap: 4 },
  miniDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  miniDotOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  miniDotToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkHollow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cardBorder,
  },

  empty: { alignItems: "center", paddingTop: 40, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 52, marginBottom: 12 },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
