import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import ItemForm from "../../components/ItemForm";
import { ThemedView } from "../../components/ThemedView";

export default function CreateItemScreen() {

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
