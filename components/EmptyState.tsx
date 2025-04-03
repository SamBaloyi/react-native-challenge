import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "../hooks/useThemeColor";

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onPress?: () => void;
  linkTo?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  message = "There are no items to display right now.",
  buttonText = "Create New Item",
  onPress,
  linkTo = "/item/create",
}) => {
  const buttonColor = useThemeColor(
    { light: "#2196F3", dark: "#4287f5" },
    "tint"
  );

  const button = (
    <Pressable
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>

      {onPress ? (
        button
      ) : (
        <Link href={linkTo} asChild>
          {button}
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmptyState;
