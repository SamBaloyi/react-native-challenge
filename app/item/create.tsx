import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useItems } from "../../store/hooks/useItems";
// import { useNetwork } from "../../store/hooks/useNetwork";
import { ItemFormValues } from "../../types/item";
import ItemForm from "../../components/ItemForm";
import { ThemedView } from "../../components/ThemedView";

export default function CreateItemScreen() {
  const { createItem } = useItems();
//   const { isConnected } = useNetwork();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      await createItem(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create New Item",
          headerBackTitle: "Items",
        }}
      />
      <ThemedView style={styles.container}>
        <ItemForm
          initialValues={{ title: "", body: "", userId: 1 }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
