import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { ItemFormValues } from "../types/item";
import { useThemeColor } from "../hooks/useThemeColor";

interface ItemFormProps {
  initialValues?: ItemFormValues;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  isLoading?: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues = { title: "", body: "", userId: 1 },
  onSubmit,
  isLoading = false,
}) => {
  const [values, setValues] = useState<ItemFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ItemFormValues, string>>
  >({});

  const inputBackground = useThemeColor(
    { light: "#f9f9f9", dark: "#333" },
    "background"
  );
  const buttonBackground = useThemeColor(
    { light: "#2196F3", dark: "#4287f5" },
    "background"
  );
  const cancelColor = useThemeColor(
    { light: "#888", dark: "#aaa" },
    "tabIconSelected"
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ItemFormValues, string>> = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!values.body.trim()) {
      newErrors.body = "Body is required";
    }

    if (!values.userId || values.userId <= 0) {
      newErrors.userId = "Valid User ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (validate()) {
      try {
        await onSubmit(values);
        router.back();
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Title</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            value={values.title}
            onChangeText={(text) => setValues({ ...values, title: text })}
            placeholder="Enter title"
            placeholderTextColor="#999"
          />
          {errors.title ? (
            <ThemedText style={styles.errorText}>{errors.title}</ThemedText>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Body</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: inputBackground }]}
            value={values.body}
            onChangeText={(text) => setValues({ ...values, body: text })}
            placeholder="Enter body content"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.body ? (
            <ThemedText style={styles.errorText}>{errors.body}</ThemedText>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>User ID</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            value={values.userId.toString()}
            onChangeText={(text) => {
              const userId = parseInt(text, 10) || 0;
              setValues({ ...values, userId });
            }}
            placeholder="Enter user ID"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.userId ? (
            <ThemedText style={styles.errorText}>{errors.userId}</ThemedText>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: "transparent", borderColor: cancelColor },
            ]}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <ThemedText style={[styles.buttonText, { color: cancelColor }]}>
              Cancel
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: buttonBackground }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
                Save
              </ThemedText>
            )}
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    borderRadius: 10,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#ff4444",
    marginTop: 4,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cancelButton: {
    marginLeft: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ItemForm;
