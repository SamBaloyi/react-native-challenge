import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  View,
  Pressable,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import EmptyState from "../../components/EmptyState";
import { useItems } from "../../store/hooks/useItems";
import { Item } from "../../types/item";
import { useThemeColor } from "../../hooks/useThemeColor";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { Swipeable } from "react-native-gesture-handler";

export default function ExploreScreen() {
  const { items, status, error, fetchItems, deleteItem } = useItems();
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor(
    { light: "#0a7ea4", dark: "#4287f5" },
    "tint"
  );
  const subtleBg = useThemeColor(
    { light: "#f0f2f5", dark: "#252a2e" },
    "background"
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
    (id: number) => {
      deleteItem(id);
    },
    [deleteItem]
  );

  const renderRightActions = useCallback(
    // eslint-disable-next-line react/display-name
    (item: Item) => (progress: Animated.AnimatedInterpolation<number>) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
      });

      return (
        <Animated.View
          style={[styles.rightAction, { transform: [{ translateX: trans }] }]}
        >
          <Pressable
            style={styles.deleteAction}
            onPress={() => handleDelete(item.id)}
          >
            <IconSymbol size={24} name="trash.fill" color="white" />
          </Pressable>
        </Animated.View>
      );
    },
    [handleDelete]
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      return (
        <Swipeable renderRightActions={renderRightActions(item)}>
          <Link href={`/item/${item.id}`} asChild>
            <Pressable style={styles.itemCard}>
              <View style={styles.itemContent}>
                <ThemedText style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.itemBody} numberOfLines={2}>
                  {item.body}
                </ThemedText>

                <View style={styles.itemFooter}>
                  <View style={[styles.badge, { backgroundColor: subtleBg }]}>
                    <IconSymbol
                      size={14}
                      name="person.fill"
                      color={tintColor}
                    />
                    <ThemedText style={styles.badgeText}>
                      User {item.userId}
                    </ThemedText>
                  </View>

                  {item.id < 0 && (
                    <View
                      style={[styles.badge, { backgroundColor: "#fff3cd" }]}
                    >
                      <IconSymbol size={14} name="wifi.slash" color="#856404" />
                      <ThemedText
                        style={[styles.badgeText, { color: "#856404" }]}
                      >
                        Offline
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
              <IconSymbol size={20} name="chevron.right" color="#94a3b8" />
            </Pressable>
          </Link>
        </Swipeable>
      );
    },
    [renderRightActions, subtleBg, tintColor]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Items</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {items.length} {items.length === 1 ? "item" : "items"} available
          </ThemedText>
        </View>
        <Link href="/item/create" asChild>
          <Pressable
            style={[styles.createButton, { backgroundColor: tintColor }]}
          >
            <IconSymbol size={20} name="plus" color="white" />
          </Pressable>
        </Link>
      </View>
    );
  }, [tintColor, items.length]);

  if (status === "loading" && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centered}>
        <IconSymbol
          size={48}
          name="exclamationmark.triangle.fill"
          color="#dc2626"
        />
        <ThemedText style={styles.errorTitle}>Something went wrong</ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <Pressable
          style={[styles.retryButton, { backgroundColor: tintColor }]}
          onPress={() => fetchItems()}
        >
          <IconSymbol size={20} name="arrow.clockwise" color="white" />
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
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[tintColor]}
            tintColor={tintColor}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 15,
    opacity: 0.6,
    marginTop: 4,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  itemBody: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  rightAction: {
    marginBottom: 12,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteAction: {
    flex: 1,
    backgroundColor: "#e11d48",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
  },
});
