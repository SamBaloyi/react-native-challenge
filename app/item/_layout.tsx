import { Stack } from "expo-router";

export default function ItemLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Item Details",
          headerShown: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create New Item",
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
