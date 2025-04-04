import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useItems } from "../../../store/hooks/useItems";
import { Item } from "../../../types/item";
import ItemForm from "../../../components/ItemForm";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useItems();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundItem = items.find((item) => item.id === id);
      setItem(foundItem || null);
      setLoading(false);
    }
  }, [id, items]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </ThemedView>
    );
  }

  if (!item) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.title}>Item Not Found</ThemedText>
        <ThemedText style={styles.message}>
          The item you're trying to edit doesn't exist or has been deleted.zzz
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Item",
          headerBackTitle: "Details",
        }}
      />
      <ThemedView style={styles.container}>
        <ItemForm />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
});
