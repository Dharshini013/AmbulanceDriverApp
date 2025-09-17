import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      <Button title="Go Online (Open Map)" onPress={() => navigation.navigate("Map")} />
      {/* Later: list incoming SOS requests will be shown here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, marginBottom: 20 },
});
