import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "./colors";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style={"black" === theme.bg ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.btnTxt}>Work</Text>
        </TouchableOpacity>
        <Text style={styles.btnTxt}>Travel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnTxt: {
    color: theme.grey,
    fontSize: 35,
    fontWeight: "600",
  },
});
