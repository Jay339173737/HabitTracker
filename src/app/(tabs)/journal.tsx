import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { useStore } from "../../store";
import { colors } from "../../theme";

export default function JournalScreen() {
  const { notes, addNote } = useStore();
  const [text, setText] = useState("");

  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    addNote(text.trim());
    setText("");
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{today}</Text>
          <Text style={styles.title}>Journal</Text>
        </View>

        {/* Composer */}
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="How was your day?"
            placeholderTextColor={colors.textDim}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={submit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Icon name="＋" size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Entries */}
        <FlatList
          data={notes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📓</Text>
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptyText}>
                Reflect on your day. Small notes build big insights.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.note}>
              <View style={styles.noteHeader}>
                <View style={styles.noteBullet} />
                <Text style={styles.noteDate}>
                  {new Date(item.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <Text style={styles.noteText}>{item.text}</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    color: colors.text,
    fontSize: 14,
    backgroundColor: colors.card,
    textAlignVertical: "top",
  },
  submitBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.4 },

  note: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  noteDate: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  noteText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
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
  },
});
