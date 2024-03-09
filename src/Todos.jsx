import { Fontisto } from "@expo/vector-icons";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { theme } from "../colors";

const STORAGE_KEY = "@todos";

export default function Todos() {
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
      [Date.now()]: { work: working, done: false, text },
    };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  // todo 삭제
  const deleteTodo = async (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this todo?");
      if (ok) {
        const newTodos = { ...todos };
        delete newTodos[key];
        setTodos(newTodos);
        await saveTodos(newTodos);
      }
    } else {
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
    }
  };

  // todo 완료
  const finishTodo = async (key) => {
    const newTodos = { ...todos };
    newTodos[key].done = !newTodos[key].done;

    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  // local stoarge 저장
  const saveTodos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
      Alert.alert("[Storage Error] Fail to save");
    }
  };

  // local storage 불러오기
  const loadTodos = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      setTodos(JSON.parse(data || ""));
    } catch (error) {
      Alert.alert("[Storage Error] Fail to load");
    }
  };

  return (
    <>
      {/* 탭 */}
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

      {/* 입력 */}
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a work" : "Where do you want to go?"}
        style={styles.input}
      />

      {/* 목록 */}
      <ScrollView>
        {Object.keys(todos)
          .filter((key) => todos[key].work === working)
          .map((key, i) => {
            return (
              <View key={i} style={styles.todo}>
                <Text
                  onPress={() => console.log("click")}
                  style={{
                    ...styles.todoText,
                    textDecorationLine: todos[key].done
                      ? "line-through"
                      : "none",
                    color: todos[key].done ? "grey" : "white",
                  }}
                >
                  {todos[key].text}
                </Text>

                <View style={styles.btnGrp}>
                  <TouchableOpacity
                    onPress={() => finishTodo(key)}
                    style={styles.btn}
                  >
                    <Fontisto name="checkbox-active" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteTodo(key)}
                    style={styles.btn}
                  >
                    <Fontisto name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
  todoText: { fontSize: 20, fontWeight: "600" },
  btnGrp: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    paddingHorizontal: 7,
  },
});
