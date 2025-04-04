import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Item } from "../types/item";
import { useThemeColor } from "../hooks/useThemeColor";
import { Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

interface ItemCardProps {
  item: Item;
  onDelete?: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#1A1A1A" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#eee", dark: "#333" }, "tint");
  const subtleTextColor = useThemeColor(
    { light: "#777", dark: "#aaa" },
    "text"
  );
  const accentColor = useThemeColor(
    { light: "#3498db", dark: "#2980b9" },
    "tint"
  );

  // Simple right action without animation
  const renderRightActions = () => {
    if (!onDelete) return null;

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDelete(item.id)}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={22} color="white" />
        <ThemedText style={styles.actionText}>Delete</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={1.5}
      rightThreshold={40}
      containerStyle={{ marginBottom: 16 }}
    >
      <Link href={`/item/${item.id}`} asChild>
        <Pressable
          style={[styles.card, { backgroundColor, borderColor }]}
          android_ripple={{ color: borderColor }}
        >
          <View style={styles.contentWrapper}>
            <ThemedText
              style={styles.title}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </ThemedText>
            <ThemedText
              style={[styles.body, { color: subtleTextColor }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.body}
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.footer}>
            <View style={styles.userBadge}>
              <ThemedText style={styles.userId}>User: {item.userId}</ThemedText>
            </View>
            <View style={styles.viewMoreContainer}>
              <ThemedText style={[styles.viewMore, { color: accentColor }]}>
                View details
              </ThemedText>
              <Feather
                name="chevron-right"
                size={16}
                color={accentColor}
                style={styles.icon}
              />
            </View>
          </View>
        </Pressable>
      </Link>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  contentWrapper: {
    minHeight: 100,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 0.25,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
    opacity: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  userBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  userId: {
    fontSize: 13,
    opacity: 0.8,
  },
  viewMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewMore: {
    fontSize: 15,
    fontWeight: "600",
  },
  icon: {
    marginLeft: 4,
  },
  deleteAction: {
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    // marginVertical: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ItemCard;
