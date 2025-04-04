import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useItems } from "../../store/hooks/useItems";
import { useNetwork } from "../../store/hooks/useNetwork";
import { Item } from "../../types/item";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsedId = id ? parseInt(id, 10) : null;
  const { items, deleteItem } = useItems();
  const { isConnected } = useNetwork();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parsedId) {
      // Find the item in the local state
      const foundItem = items.find((item) => item.id === parsedId);
      setItem(foundItem || null);
      setLoading(false);
    }
  }, [parsedId, items]);

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (parsedId) {
            deleteItem(parsedId);
            router.back();
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    router.push(`/item/edit/${parsedId}`);
  };

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
        <ThemedText style={styles.text}>
          The item you're looking for doesn't exist or has been deleted.
        </ThemedText>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  // Check if this is a temporary item (offline created)
  const isTemporaryItem = item.id < 0; // Negative IDs are temporary

  return (
    <>
      <Stack.Screen
        options={{
          title: item.title,
          headerBackTitle: "Items",
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={styles.userId}>User ID: {item.userId}</ThemedText>
        </View>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.bodyLabel}>Content:</ThemedText>
          <ThemedText style={styles.body}>{item.body}</ThemedText>
        </ThemedView>

        <View style={styles.metaInfo}>
          <ThemedText style={styles.metaText}>ID: {item.id}</ThemedText>
          {isTemporaryItem && (
            <ThemedText style={styles.offlineIndicator}>
              Created offline (not synced)
            </ThemedText>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
          >
            <ThemedText style={styles.buttonText}>Edit Item</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.deleteButton,
              !isConnected && !isTemporaryItem
                ? styles.disabledButton
                : {},
            ]}
            onPress={handleDelete}
            disabled={!isConnected && !isTemporaryItem}
          >
            <ThemedText style={styles.buttonText}>
              {!isConnected && !isTemporaryItem
                ? "Cannot Delete While Offline"
                : "Delete Item"}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userId: {
    fontSize: 14,
    opacity: 0.7,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bodyLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  metaInfo: {
    padding: 8,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.7,
  },
  offlineIndicator: {
    fontSize: 14,
    color: "#856404",
    backgroundColor: "#fff3cd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: "auto",
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },
});
