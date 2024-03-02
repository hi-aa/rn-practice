import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@todos";

export default function App() {
  // 탭 정보
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  // init
  useEffect(() => {
    loadTodos();
  }, []);

  // 데이터
  const [text, setText] = useState(""); // 입력
  const [todos, setTodos] = useState({}); // 목록
  const onChangeText = (payload) => setText(payload);

  // todo 추가
  const addTodo = async () => {
    if (text === "") {
      return;
    }

    // save todo
    const newTodos = {
      ...todos,
      [Date.now()]: { work: working, text },
    };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  // todo 삭제
  const deleteTodo = async (key) => {
    Alert.alert("Delete todo", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        text: "Ok",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[key];

          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  // local stoarge 저장
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  // local storage 불러오기
  const loadTodos = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    setTodos(JSON.parse(data || ""));
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
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={24} color="white" />
                </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  todoText: { color: "white", fontSize: 20, fontWeight: "600" },
});
