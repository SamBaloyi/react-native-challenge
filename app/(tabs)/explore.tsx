import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  View,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import ItemCard from "../../components/ItemCard";
import EmptyState from "../../components/EmptyState";
import { useItems } from "../../store/hooks/useItems";
import { Item } from "../../types/item";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function ExploreScreen() {
  const { items, status, error, fetchItems, deleteItem } = useItems();
  const [refreshing, setRefreshing] = useState(false);
  const buttonColor = useThemeColor(
    { light: "#2196F3", dark: "#4287f5" },
    "tint"
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteItem(id);
    },
    [deleteItem]
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      return <ItemCard item={item} onDelete={handleDelete} />;
    },
    [handleDelete]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Items</ThemedText>
        <Link href="/item/create" asChild>
          <Pressable
            style={[styles.createButton, { backgroundColor: buttonColor }]}
          >
            <ThemedText style={styles.createButtonText}>+ New</ThemedText>
          </Pressable>
        </Link>
      </View>
    );
  }, [buttonColor]);

  if (status === "loading" && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <Pressable
          style={[styles.retryButton, { backgroundColor: buttonColor }]}
          onPress={() => fetchItems()}
        >
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </Pressable>
      </View>
    );
  }

  if (status === "succeeded" && items.length === 0) {
    return <EmptyState />;
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ThemedView>
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
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#ff4444",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
