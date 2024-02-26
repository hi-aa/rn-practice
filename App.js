import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

import { Fontisto } from "@expo/vector-icons";

import { WEATHER_API_SAMPLE } from "./assets/test-data/weather";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [ok, setOk] = useState(false); // 유저 승인여부
  const [dispLoc, setDispLoc] = useState(null); // 표시 위치
  const [days, setDays] = useState([]); // 날짜별 목록

  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Rain: "rain",
    // 기타등등..
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // permission
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }
    setOk(true);

    // get location
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const loc = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setDispLoc(loc?.[0].city || loc?.[0].region || loc?.[0].district);

    // call weather api
    const testJson = WEATHER_API_SAMPLE;
    setDays(testJson);
  };

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        {ok ? (
          <Text style={styles.cityName}>{dispLoc || "Loading..."}</Text>
        ) : (
          <Text style={styles.cityName}>Not Allowed</Text>
        )}
      </View>

      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {ok ? (
          // 데이터 출력
          days.length > 0 ? (
            days.map((v, i) => (
              <View style={styles.day} key={i}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.temperature}>
                    {parseFloat(v.main?.temp).toFixed(1)}
                  </Text>
                  <Fontisto
                    name={icons?.[v.weather?.[0].main]}
                    // size={80}
                    color="black"
                    style={styles.icon}
                  />
                </View>

                <Text style={styles.description}>{v.weather?.[0].main}</Text>
                <Text style={styles.subDescription}>
                  {v.weather?.[0].description}
                </Text>
              </View>
            ))
          ) : (
            // 로딩바
            <View style={styles.day}>
              <ActivityIndicator color={"white"} size={"large"} />
            </View>
          )
        ) : (
          // 조회정보 없음
          <View style={styles.day}>
            <Text>No Data</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1.3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: { fontSize: 40, fontWeight: "600" },
  weather: {},
  day: {
    width: WINDOW_WIDTH,
    // alignItems: "center",
    // margin: 3,
    padding: 10,
  },
  icon: { fontSize: 70 },
  temperature: { fontSize: 80 },
  description: { fontSize: 30, marginTop: -20 },
  subDescription: { fontSize: 20, marginTop: -10 },
});
