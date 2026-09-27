import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { colors } from '../../theme';

export default function JournalScreen() {
  const { notes, addNote } = useStore();
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    addNote(text.trim());
    setText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Journal</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a note..."
          placeholderTextColor={colors.textDim}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No journal entries yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteText}>{item.text}</Text>
            <Text style={styles.noteDate}>{item.date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', padding: 16 },
  inputRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 10,
    color: colors.text,
  },
  btn: { backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: 16, justifyContent: 'center' },
  note: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  noteText: { color: colors.text },
  noteDate: { color: colors.textDim, fontSize: 11, marginTop: 4 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 60 },
});
