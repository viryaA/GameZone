import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import i18n from "../../../../Locale/i18n";

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function GameRoomCard ({ item }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = () => {
      setLoading(true);
      fetch(`${apiUrl}/MsGame/ByRuangan/` + item.rng_id)
      .then((res) => res.json())
      .then((json) => {
      let initialData = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];

      setData(initialData);
      setLoading(false);
      })
      .catch((err) => {
      console.error(err);
      Toast.show({
          type: "error",
          text1: i18n.t("failed"),
          text2: i18n.t("errorMessage"),
      });
      setLoading(false);
      });
    };

    useEffect(() => {
    fetchData();
    }, []);

    console.log("data", data);

  return (
    loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
      </View>
    ) : (
      <View className="bg-[#3F217A] rounded-2xl px-4 py-3 mb-3 border border-gray-400">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 gap-1">
            <Text className="text-white font-poppins-bold text-sm">
              {data[0]?.game_nama}
            </Text>
            <View className="flex-row flex-wrap">
              <Text className="text-sm text-white font-poppins">
                {data[0]?.game_serial_number}
              </Text>
              <Text className="text-sm text-white font-poppins">{"  - "}</Text>
              <Text className="text-sm text-white font-poppins underline">
                {data[0]?.game_platform}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[#FFB400] font-poppins text-sm">
              {data[0]?.game_max_pemain} Player
            </Text>
          </View>
        </View>
      </View>
    )
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#aaa",
  },
});

