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
import Icon from "../components/Icon";
import { Routine, useStore } from "../store";
import { colors } from "../theme";

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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="‹" size={22} color={colors.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>My Routines</Text>
      </View>

      <View style={styles.tabs}>
        {(["forYou", "all"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "forYou" ? "For You" : "All Routines"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
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
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: item.color || colors.primary },
              ]}
            >
              <Icon name="✨" size={22} color="#0B0B0F" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.dim}>
                {item.habitCount} habit{item.habitCount === 1 ? "" : "s"}
              </Text>
              <Text style={styles.dim} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            {item.premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
            <Icon name="›" size={20} color={colors.textDim} />
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
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  tabText: { color: colors.textDim, fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  dim: { color: colors.textDim, fontSize: 12, marginTop: 1, lineHeight: 17 },
  premiumBadge: {
    backgroundColor: colors.premium,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
