import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useItems } from "../../store/hooks/useItems";
import { useNetwork } from "../../store/hooks/useNetwork";
import { Item } from "../../types/item";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useThemeColor } from "../../hooks/useThemeColor";
import { IconSymbol } from "../../components/ui/IconSymbol";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsedId = id ? parseInt(id, 10) : null;
  const { items, deleteItem } = useItems();
  const { isConnected } = useNetwork();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  
  const tintColor = useThemeColor({ light: "#0a7ea4", dark: "#4287f5" }, "tint");
  const backgroundColor = useThemeColor({ light: "#f7f7f9", dark: "#1e2022" }, "background");
  const subtleBackground = useThemeColor({ light: "#f0f2f5", dark: "#252a2e" }, "background");

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
    router.push(`/item/edit/${id}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (!item) {
    return (
      <ThemedView style={styles.centered}>
        <View style={styles.notFoundContainer}>
          <IconSymbol size={64} name="exclamationmark.triangle.fill" color="#f59e0b" />
          <ThemedText style={styles.title}>Item Not Found</ThemedText>
          <ThemedText style={styles.text}>
            The item you're looking for doesn't exist or has been deleted.
          </ThemedText>
          <Pressable 
            style={[styles.backButton, { backgroundColor: tintColor }]} 
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </Pressable>
        </View>
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
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <View style={[styles.userBadge, { backgroundColor: subtleBackground }]}>
              <IconSymbol size={16} name="person.fill" color={tintColor} />
              <ThemedText style={styles.userId}>User ID: {item.userId}</ThemedText>
            </View>
          </View>

          <ThemedView style={[styles.card, { backgroundColor }]}>
            <ThemedText style={styles.bodyLabel}>Content</ThemedText>
            <ThemedText style={styles.body}>{item.body}</ThemedText>
          </ThemedView>

          <View style={styles.metaInfo}>
            <View style={[styles.idBadge, { backgroundColor: subtleBackground }]}>
              <IconSymbol size={16} name="number" color={tintColor} />
              <ThemedText style={styles.metaText}>ID: {item.id}</ThemedText>
            </View>
            
            {isTemporaryItem && (
              <View style={styles.offlineIndicator}>
                <IconSymbol size={16} name="wifi.slash" color="#856404" />
                <ThemedText style={styles.offlineText}>
                  Created offline (not synced)
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.divider} />
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.editButton, { backgroundColor: tintColor }]}
            onPress={handleEdit}
          >
            <IconSymbol size={20} name="pencil" color="white" />
            <ThemedText style={styles.buttonText}>Edit Item</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.deleteButton,
              !isConnected && !isTemporaryItem ? styles.disabledButton : {},
            ]}
            onPress={handleDelete}
            disabled={!isConnected && !isTemporaryItem}
          >
            <IconSymbol size={20} name="trash.fill" color="white" />
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
  notFoundContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    gap: 16,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  userId: {
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  bodyLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  metaInfo: {
    paddingHorizontal: 8,
    marginBottom: 20,
    gap: 10,
  },
  idBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
  },
  offlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  offlineText: {
    fontSize: 14,
    color: "#856404",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
    marginVertical: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
    paddingTop: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#0a7ea4",
  },
  deleteButton: {
    backgroundColor: "#e11d48",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.7,
  },
});