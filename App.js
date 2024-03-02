import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "./colors";
import { useEffect, useState } from "react";

export default function App() {
  // 탭 선택
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  // 입력, todo
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const onChangeText = (payload) => setText(payload);
  const addTodo = () => {
    if (text === "") {
      return;
    }

    // save todo
    setTodos((prev) => {
      return {
        ...prev,
        [Date.now()]: { work: working, text },
      };
    });
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style={"black" === theme.bg ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnTxt, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnTxt, color: !working ? "white" : theme.grey }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a work" : "Where do you want to go?"}
        style={styles.input}
      />

      <ScrollView>
        {Object.keys(todos)
          .filter((key) => todos[key].work === working)
          .map((key, i) => {
            return (
              <View key={i} style={styles.todo}>
                <Text style={styles.todoText}>{todos[key].text}</Text>
              </View>
            );
          })}
      </ScrollView>
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
    fontSize: 35,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 16,
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  todoText: { color: "white", fontSize: 20, fontWeight: "600" },
});
