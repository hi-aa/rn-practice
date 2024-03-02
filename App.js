import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { theme } from "./colors";
import Todos from "./src/Todos";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style={"black" === theme.bg ? "light" : "dark"} />
      <Todos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
});
