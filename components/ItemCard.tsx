import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Item } from "../types/item";
import { useThemeColor } from "../hooks/useThemeColor";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#1A1A1A" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#eee", dark: "#333" }, "tint");

  const renderRightActions = () => {
    if (!onDelete) return null;

    return (
      <Pressable
        style={[styles.deleteAction, { backgroundColor: "#ff4444" }]}
        onPress={() => onDelete(item.id)}
      >
        <ThemedText style={styles.actionText}>Delete</ThemedText>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Link href={`/item/${item.id}`} asChild>
        <Pressable style={[styles.card, { backgroundColor, borderColor }]}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={styles.body} numberOfLines={2}>
            {item.body}
          </ThemedText>
          <View style={styles.footer}>
            <ThemedText style={styles.userId}>User: {item.userId}</ThemedText>
            <ThemedText style={styles.viewMore}>View details →</ThemedText>
          </View>
        </Pressable>
      </Link>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userId: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewMore: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  actionText: {
    fontWeight: "600",
    color: "white",
  },
});

export default ItemCard;
