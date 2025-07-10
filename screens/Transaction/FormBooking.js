import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import i18n from "../../Locale/i18n";
import "../../global.css";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

const apiUrl = Constants.expoConfig.extra.API_URL;

const { width } = Dimensions.get("window");
const screenWidth = width;

export default function FormBooking() {
  // Navigation
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const [sortBy, setSortBy] = useState(null); // e.g. 'jps_nama'
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedJenisPlay, setselectedJenisPlay] = useState("All");
  const [menuItem, setMenuItem] = useState(null);

  // TAB Promotion
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // PARAMS
  const route = useRoute();
  // const { item } = route.params;

  // DatePick
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [duration, setDuration] = useState(0); // durasi dalam jam atau menit

  const fetchData = () => {
    setLoading(true);
    fetch(`${apiUrl}/MsRuangan`)
      .then((res) => res.json())
      .then((json) => {
        let initialData = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];

        setData(json);
        applySort(initialData, sortBy, sortOrder);
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
    // fetchData();
  }, []);

  // const handleDetailLoc = (item) => {
  //   setSelectedItem(item);
  // };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleSave = (item) => {
    // const method = isEdit ? "PUT" : "POST";
    // fetch(`${apiUrl}/MsPlaystation`, {
    //   method,
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(item),
    // })
    //     .then((res) => res.json())
    //     .then((resJson) => {
    //       Toast.show({
    //         type: resJson.result === 1 ? "success" : "error",
    //         text1: resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
    //         text2: resJson.message,
    //       });
    //       setModalVisible(false);
    //       fetchData();
    //     })
    //     .catch((error) => {
    //       console.error("Save error", error);
    //       Toast.show({
    //         type: "error",
    //         text1: i18n.t("failed"),
    //         text2: i18n.t("errorMessage"),
    //       });
    //       setModalVisible(false);
    //     });
  };

  return (
    <ImageBackground
      source={require("../../assets/default-background.png")} // ← Ganti dengan path ke gambar lokal kamu
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40">
        {/* App Bar */}
        <View className="pt-12 mt-2 pb-4 mb-2 px-4">
          <View className="relative items-center justify-center">
            {/* Tombol Back - Kiri */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 w-9 h-9 rounded-full bg-white/20 justify-center items-center"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>

            {/* Title di Tengah */}
            <Text className="text-white font-semibold text-base">
              {i18n.t("strLabelFormBook")}
            </Text>

            {/* Tombol Reset - Kanan */}
            <TouchableOpacity
              // onPress={handleReset} // ganti sesuai fungsi reset kamu
              className="absolute right-0 justify-center items-center"
            >
              <Text className="text-gray-600">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Tanggal Booking */}
        <View className="px-4 mt-4">
          <Text className="text-white mb-2">{i18n.t("date")}</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white/20 py-3 px-4 rounded-md"
          >
            <Text className="text-white">
              {date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Input Durasi */}
        <View className="px-4 mt-4">
          <Text className="text-white mb-2">{i18n.t("durationBook")}</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Masukkan durasi (jam)"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            className="bg-white/20 text-white py-3 px-4 rounded-md"
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      {/* <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-[#3A217C] py-3 rounded-t-xl">
          <TouchableOpacity className="items-center">
            <Ionicons name="home" size={24} color="white" />
            <Text className="text-white text-xs">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="game-controller-outline" size={24} color="white" />
            <Text className="text-white text-xs">Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="person-outline" size={24} color="white" />
            <Text className="text-white text-xs">Profile</Text>
          </TouchableOpacity>
        </View> */}
      {/* </View> */}
    </ImageBackground>
  );
}

/** ----------- Stylesheet ------------ */
const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  locationButton: {
    flexDirection: "row",
    backgroundColor: "#5829AB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    marginHorizontal: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#fff",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    height: 55,
    marginRight: 8,
  },
  searchBackground: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  searchImage: {
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
  },
  optionButton: {
    width: 64,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  bannerSlide: {
    width: screenWidth * 0.8,
    height: 200,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgb(0, 183, 255)",
    marginHorizontal: 4,
  },
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
  rentalList: {
    paddingHorizontal: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
    fontFamily: "Poppins",
    textDecorationLine: "none",
  },
});
