import React, { useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useItems } from "../../store/hooks/useItems";
import { useOfflineData } from "../../hooks/useOfflineData";
import { formatDate } from "../../utils/formatters";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function HomeScreen() {
  const { items, status, error, fetchItems } = useItems();
  const { isSyncing, lastSynced, pendingChanges, syncData } = useOfflineData();
  const buttonColor = useThemeColor(
    { light: "#2196F3", dark: "#4287f5" },
    "tint"
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = () => {
    fetchItems();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={status === "loading"}
          onRefresh={onRefresh}
        />
      }
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.title}>React Native Challenge</ThemedText>
        <ThemedText style={styles.subtitle}>
          Browse, create, and manage your items with offline support
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.statsTitle}>Overview</ThemedText>

        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Total Items:</ThemedText>
          <ThemedText style={styles.statValue}>{items.length}</ThemedText>
        </View>

        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Last Synced:</ThemedText>
          <ThemedText style={styles.statValue}>
            {lastSynced ? formatDate(lastSynced) : "Never"}
          </ThemedText>
        </View>

        {pendingChanges > 0 && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Pending Changes:</ThemedText>
            <ThemedText style={styles.statValue}>{pendingChanges}</ThemedText>
          </View>
        )}
      </ThemedView>

      <View style={styles.actionsContainer}>
        <Link href="/explore" asChild>
          <Pressable style={[styles.button, { backgroundColor: buttonColor }]}>
            <ThemedText style={styles.buttonText}>Browse Items</ThemedText>
          </Pressable>
        </Link>

        <Link href="/item/create" asChild>
          <Pressable style={[styles.button, { backgroundColor: buttonColor }]}>
            <ThemedText style={styles.buttonText}>Create New Item</ThemedText>
          </Pressable>
        </Link>

        {pendingChanges > 0 && (
          <Pressable
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={syncData}
            disabled={isSyncing}
          >
            <ThemedText style={styles.buttonText}>
              {isSyncing ? "Syncing..." : "Sync Pending Changes"}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statsContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
  },
});
