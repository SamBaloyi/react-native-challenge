import React, { useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Pressable,
  // Image,
} from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useItems } from "../../store/hooks/useItems";
import { useOfflineData } from "../../hooks/useOfflineData";
import { formatDate } from "../../utils/formatters";
import { useThemeColor } from "../../hooks/useThemeColor";
import { IconSymbol } from "../../components/ui/IconSymbol";

export default function HomeScreen() {
  const { items, status, error, fetchItems } = useItems();
  const { isSyncing, lastSynced, pendingChanges, syncData } = useOfflineData();
  const tintColor = useThemeColor(
    { light: "#0a7ea4", dark: "#4287f5" },
    "tint"
  );
  const cardBg = useThemeColor(
    { light: "#ffffff", dark: "#1e2022" },
    "background"
  );
  const subtleBg = useThemeColor(
    { light: "#f0f2f5", dark: "#252a2e" },
    "background"
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
          colors={[tintColor]}
          tintColor={tintColor}
        />
      }
    >
      <ThemedView style={[styles.headerContainer, { backgroundColor: cardBg }]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: tintColor }]}>
            <IconSymbol
              size={32}
              name="list.bullet.clipboard.fill"
              color="white"
            />
          </View>
        </View>
        <ThemedText style={styles.title}>React Native Challenge</ThemedText>
        <ThemedText style={styles.subtitle}>
          Browse, create, and manage your items with offline support
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.statsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.statsHeader}>
          <ThemedText style={styles.statsTitle}>Overview</ThemedText>
          <IconSymbol size={24} name="chart.bar.fill" color={tintColor} />
        </View>

        <View style={[styles.statRow, { backgroundColor: subtleBg }]}>
          <View style={styles.statLabelContainer}>
            <IconSymbol
              size={18}
              name="square.stack.3d.up.fill"
              color={tintColor}
            />
            <ThemedText style={styles.statLabel}>Total Items</ThemedText>
          </View>
          <ThemedText style={styles.statValue}>{items.length}</ThemedText>
        </View>

        <View style={[styles.statRow, { backgroundColor: subtleBg }]}>
          <View style={styles.statLabelContainer}>
            <IconSymbol size={18} name="clock.fill" color={tintColor} />
            <ThemedText style={styles.statLabel}>Last Synced</ThemedText>
          </View>
          <ThemedText style={styles.statValue}>
            {lastSynced ? formatDate(lastSynced) : "Never"}
          </ThemedText>
        </View>

        {pendingChanges > 0 && (
          <View style={[styles.statRow, { backgroundColor: subtleBg }]}>
            <View style={styles.statLabelContainer}>
              <IconSymbol size={18} name="arrow.clockwise" color="#f59e0b" />
              <ThemedText style={styles.statLabel}>Pending Changes</ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: "#f59e0b" }]}>
              <ThemedText style={styles.badgeText}>{pendingChanges}</ThemedText>
            </View>
          </View>
        )}
      </ThemedView>

      <View style={styles.actionsContainer}>
        <Link href="/explore" asChild>
          <Pressable style={[styles.button, { backgroundColor: tintColor }]}>
            <IconSymbol
              size={22}
              name="square.grid.2x2.fill"
              color={tintColor}
            />
            <ThemedText style={styles.buttonText}>Browse Items</ThemedText>
          </Pressable>
        </Link>

        <Link href="/item/create" asChild>
          <Pressable style={[styles.button, { backgroundColor: tintColor }]}>
            <IconSymbol size={22} name="plus.square.fill" color={tintColor} />
            <ThemedText style={styles.buttonText}>Create New Item</ThemedText>
          </Pressable>
        </Link>

        {pendingChanges > 0 && (
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: isSyncing ? "#94a3b8" : "#f59e0b",
                opacity: isSyncing ? 0.8 : 1,
              },
            ]}
            onPress={syncData}
            disabled={isSyncing}
          >
            <IconSymbol
              size={22}
              name="arrow.triangle.2.circlepath"
              color="white"
            />
            <ThemedText style={styles.buttonText}>
              {isSyncing ? "Syncing..." : "Sync Pending Changes"}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {error && (
        <ThemedView
          style={[styles.errorContainer, { backgroundColor: "#fee2e2" }]}
        >
          <IconSymbol
            size={24}
            name="exclamationmark.triangle.fill"
            color="#dc2626"
          />
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  headerContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  statsContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    color: "#dc2626",
    flex: 1,
  },
});
