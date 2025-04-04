import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useItems } from "../store/hooks/useItems";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useThemeColor } from "../hooks/useThemeColor";
import { IconSymbol } from "../components/ui/IconSymbol";
import { Item } from "../types/item";
import { useNetwork } from "../store/hooks/useNetwork";

export default function ItemForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = !!id;
  const parsedId = id ? parseInt(id, 10) : null;

  const { items, createItem, updateItem } = useItems();
  const { isConnected } = useNetwork();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tintColor = useThemeColor(
    { light: "#0a7ea4", dark: "#4287f5" },
    "tint"
  );
  const inputBg = useThemeColor(
    { light: "#f0f2f5", dark: "#252a2e" },
    "background"
  );
  const placeholderColor = useThemeColor(
    { light: "#94a3b8", dark: "#64748b" },
    "text"
  );

  useEffect(() => {
    if (isEditMode && parsedId) {
      const item = items.find((item) => item.id === parsedId);
      if (item) {
        setTitle(item.title);
        setBody(item.body);
        setUserId(item.userId.toString());
      }
      setInitialLoading(false);
    }
  }, [isEditMode, parsedId, items]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!body.trim()) {
      newErrors.body = "Content is required";
    }

    if (!userId.trim() || isNaN(Number(userId))) {
      newErrors.userId = "Valid User ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const itemData: Item = {
        id: parsedId!,
        title,
        body,
        userId: parseInt(userId, 10),
      };

      if (isEditMode && parsedId) {
        await updateItem(itemData);
        router.replace(`/item/${parsedId}`);
      } else {
        const newItem = await createItem(itemData);
        router.replace(`/item/${newItem.id}`);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        isEditMode
          ? "Failed to update the item. Please try again."
          : "Failed to create the item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && parsedId) {
      router.replace(`/item/${parsedId}`);
    } else {
      router.back();
    }
  };

  if (initialLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <IconSymbol
              size={24}
              name={isEditMode ? "pencil.circle.fill" : "plus.circle.fill"}
              color={tintColor}
            />
            <ThemedText style={styles.headerText}>
              {isEditMode ? "Edit Item" : "Create New Item"}
            </ThemedText>
          </View>

          {!isConnected && (
            <View style={styles.offlineWarning}>
              <IconSymbol size={18} name="wifi.slash" color="#856404" />
              <ThemedText style={styles.offlineWarningText}>
                You're offline.{" "}
                {isEditMode
                  ? "Changes will be synced when you're back online."
                  : "The item will be created locally and synced later."}
              </ThemedText>
            </View>
          )}

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Title</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: placeholderColor },
                errors.title ? styles.inputError : {},
              ]}
              placeholder="Enter item title"
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
            />
            {errors.title ? (
              <ThemedText style={styles.errorText}>{errors.title}</ThemedText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Content</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: inputBg, color: placeholderColor },
                errors.body ? styles.inputError : {},
              ]}
              placeholder="Enter item content"
              placeholderTextColor={placeholderColor}
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
            />
            {errors.body ? (
              <ThemedText style={styles.errorText}>{errors.body}</ThemedText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>User ID</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: placeholderColor },
                errors.userId ? styles.inputError : {},
              ]}
              placeholder="Enter user ID"
              placeholderTextColor={placeholderColor}
              value={userId}
              onChangeText={setUserId}
              keyboardType="numeric"
            />
            {errors.userId ? (
              <ThemedText style={styles.errorText}>{errors.userId}</ThemedText>
            ) : null}
          </View>
        </ThemedView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <IconSymbol size={20} name="xmark" color={tintColor} />
          <ThemedText style={[styles.buttonText, { color: tintColor }]}>
            Cancel
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.submitButton,
            { backgroundColor: tintColor },
            loading ? styles.disabledButton : {},
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <IconSymbol
                size={20}
                name={isEditMode ? "checkmark" : "plus"}
                color="white"
              />
              <ThemedText style={styles.buttonText}>
                {isEditMode ? "Save Changes" : "Create Item"}
              </ThemedText>
            </>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  formContainer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  offlineWarning: {
    flexDirection: "row",
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
    gap: 10,
  },
  offlineWarningText: {
    color: "#856404",
    flex: 1,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  inputError: {
    borderColor: "#e11d48",
    borderWidth: 1,
  },
  errorText: {
    color: "#e11d48",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
