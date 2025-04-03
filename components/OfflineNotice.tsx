import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useNetwork } from "../store/hooks/useNetwork";
import { ThemedView } from "./ThemedView";

const OfflineNotice: React.FC = () => {
  const { isConnected } = useNetwork();

  if (isConnected) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>No Internet Connection</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ff4444",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OfflineNotice;
