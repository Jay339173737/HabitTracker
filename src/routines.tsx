import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routine, useStore } from "./store";
import { colors } from "./theme";

export default function RoutinesScreen() {
  const router = useRouter();
  const routines = useStore((s) => s.routines);
  const [tab, setTab] = useState<"forYou" | "all">("forYou");

  const sections = (
    tab === "forYou" ? routines.filter((r) => !r.premium) : routines
  ).reduce((acc: { title: string; data: Routine[] }[], r) => {
    const existing = acc.find((s) => s.title === r.category);
    if (existing) existing.data.push(r);
    else acc.push({ title: r.category, data: [r] });
    return acc;
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Routines</Text>
      </View>

      <View style={styles.tabs}>
        {(["forYou", "all"] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "forYou" ? "For You" : "All Routines"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/routine-detail",
                params: { routineId: item.id },
              })
            }
            activeOpacity={0.75}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.dim}>{item.habitCount} habits</Text>
              <Text style={styles.dim} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            {item.premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
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
    padding: 16,
    gap: 16,
  },
  back: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  title: { color: colors.text, fontSize: 20, fontWeight: "700" },
  tabs: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabText: { color: colors.textDim, fontSize: 15, fontWeight: "500" },
  tabTextActive: {
    color: colors.text,
    fontWeight: "700",
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dim: { color: colors.textDim, fontSize: 12, marginTop: 2, lineHeight: 18 },
  premiumBadge: {
    backgroundColor: colors.premium,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  chevron: { color: colors.textDim, fontSize: 22, marginLeft: 4 },
});
