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
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { UserContext } from "../../Konteks/UserContext";
import { I18n } from "i18n-js";
// import { UserContext } from "../../../Konteks/UserContext";
const apiUrl = Constants.expoConfig.extra.API_URL;

const { width } = Dimensions.get("window");
const screenWidth = width;

export default function RequestToPay() {
  const { user } = useContext(UserContext);

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
  const { payload } = route.params;

  // DatePick
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // TIME PICK
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  //Payment Method
  const paymentMethods = [
    { id: 1, name: "PayPal", icon: "logo-paypal" },
    { id: 2, name: "OVO", icon: "wallet-outline" },
    { id: 3, name: "DANA", icon: "logo-buffer" },
    { id: 4, name: "Gopay", icon: "logo-google" },
  ];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [duration, setDuration] = useState(0); // durasi dalam jam atau menit

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      weekday: "short",
    });
  };

  const getAmPm = (timeStr) => {
    if (!timeStr) return "";
    const hour = parseInt(timeStr.split(":")[0]);
    return hour >= 12 ? "PM" : "AM";
  };

  const calculateEndTime = () => {
    if (!selectedTime || !duration) return null;
    const [hour, minute] = selectedTime.split(":").map(Number);
    const endHour = (hour + duration) % 24;
    return `${endHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (duration > 0) {
      const filtered = data.map((item) => ({
        ...item,
        disabled: item.maxDuration < duration,
      }));
      setAvailableTimes(filtered);

      // ❗ Reset selectedTime jika tidak lagi valid
      const stillValid = filtered.find(
        (item) => item.start === selectedTime && !item.disabled
      );
      if (!stillValid) {
        setSelectedTime(null); // reset karena jam terpilih tidak valid lagi
      }
    } else {
      // default jika belum input durasi
      const fallback = data.map((item) => ({
        ...item,
        disabled: false,
      }));
      console.log("fallback", fallback);
      setAvailableTimes(fallback);
    }
  }, [duration]);

  console.log("time", data);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const formatDateTime = (dateObj, timeStr) => {
    const dateOnly = new Date(dateObj).toISOString().split("T")[0]; // "2025-07-10"
    return `${dateOnly}T${timeStr}:00`; // "2025-07-10T09:00:00"
  };

  const handleSave = () => {
    const payloads = {
      user: { usr_id: user.usr_id },
      ruangan: { rng_id: payload.id_ruangan },
      bok_waktu_mulai: formatDateTime(payload.date, payload.start),
      bok_waktu_selesai: formatDateTime(payload.date, payload.endTime),
      bok_durasi_jam: payload.durasi,
      bok_total_biaya: parseInt(payload.harga_per_jam) * parseInt(payload.durasi),
      // payment: selectedPaymentMethod.name,
    };

    console.log("payload", payloads);
    const method = "POST";
    fetch(`${apiUrl}/TrBooking`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloads),
    })
        .then((res) => res.json())
        .then((resJson) => {
          Toast.show({
            type: resJson.result === 1 ? "success" : "error",
            text1: resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
            text2: resJson.message,
          });
          if (resJson.result === 1) {
            navigation.navigate("Pelanggan")
          }
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Save error", error);
          Toast.show({
            type: "error",
            text1: i18n.t("failed"),
            text2: i18n.t("errorMessage"),
          });
          setModalVisible(false);
        });
  };

  const handleReset = () => {
    setDuration(0); // reset durasi
    setSelectedTime(null); // reset waktu yang dipilih
    setDate(new Date());

    // aktifkan semua slot waktu kembali
    const fallback = data.map((item) => ({
      ...item,
      disabled: false,
    }));
    setAvailableTimes(fallback);
  };

  return (
    <ImageBackground
      source={require("../../assets/default-background.png")} // ← Ganti dengan path ke gambar lokal kamu
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40">
        <View className="pt-12 px-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-12 w-9 h-9 bg-white/20 rounded-full justify-center items-center"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-center font-semibold text-base">
            {i18n.t("pageReqToPay")}
          </Text>
        </View>

        <View className="px-4 mt-4">
          {/* Room Info */}
          <View className="flex-row items-center space-x-4 mb-4">
            <View className="w-20 h-20 rounded-xl overflow-hidden mr-4">
              <ImageBackground
                source={require("../../assets/VIPRoom.png")} // Ganti dengan gambar ruangan
                className="w-full h-full"
              />
            </View>
            <View>
              <Text className="text-white font-bold mb-1 text-lg">
                {payload.nama_ruangan}
              </Text>
              <Text className="text-green-400 text-xs mb-2 ">★ 200 Rental</Text>
              <Text className="text-white text-sm">
                Rp {payload.harga_per_jam} /h
              </Text>
            </View>
          </View>

          {/* Play Date & Time */}
          <LinearGradient
            colors={["rgba(99,102,241,0.2)", "rgba(139,92,246,0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24, // sama seperti rounded-3xl
              padding: 1.5,
              marginBottom: 16,
              overflow: "hidden", // 🔑 PENTING agar radius terlihat!
            }}
          >
            <View className="bg-white/10 p-4 rounded-3xl border border-white/20 shadow-lg shadow-violet-500/20">
              <Text className="text-white mb-2 text-base font-bold">
                {i18n.t("dateTime")}
              </Text>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold text-sm">
                    {formatDate(payload.date)}
                  </Text>
                  <Text className="text-white text-center text-xs">
                    {payload.start ? payload.start : "-"}{" "}
                    {getAmPm(payload.start)}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="white" />
                <View>
                  <Text className="text-white font-semibold text-sm">
                    {formatDate(payload.date)}
                  </Text>
                  <Text className="text-white text-center text-xs">
                    {payload.endTime ? payload.endTime : "-"}{" "}
                    {getAmPm(payload.endTime)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Payment Details */}
          <LinearGradient
            colors={["rgba(99,102,241,0.2)", "rgba(139,92,246,0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 1.5,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <View className="bg-white/10 p-4 rounded-3xl border border-white/20">
              <Text className="text-white mb-2 font-bold">
                {i18n.t("detailPay")}
              </Text>

              <View className="flex-row justify-between">
                <Text className="text-white text-sm">
                  Rp {payload.harga_per_jam} × {payload.durasi} {i18n.t("jam")}
                </Text>
                <Text className="text-white text-sm">
                  Rp{" "}
                  {(payload.durasi * payload.harga_per_jam).toLocaleString(
                    "id-ID"
                  )}
                </Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="text-white">{i18n.t("diskon")}</Text>
                <Text className="text-white">-</Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="text-white font-bold">
                  {i18n.t("totalPayment")}
                </Text>
                <Text className="text-white font-bold text-lg">
                  Rp{" "}
                  {(payload.durasi * payload.harga_per_jam).toLocaleString(
                    "id-ID"
                  )}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Method Of Payment */}
          <LinearGradient
            colors={["rgba(99,102,241,0.2)", "rgba(139,92,246,0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 1.5,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <View className="bg-white/10 p-4 rounded-3xl border border-white/20">
              <Text className="text-white mb-2 font-bold">
                {i18n.t("paymentMethod")}
              </Text>

              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedPaymentMethod(method)}
                  className={`flex-row items-center justify-between py-3 px-4 rounded-lg mb-2 ${
                    selectedPaymentMethod?.id === method.id
                      ? "bg-white/20"
                      : "bg-white/5"
                  }`}
                >
                  <View className="flex-row items-center space-x-2">
                    <Ionicons name={method.icon} size={20} color="white" />
                    <Text className="ml-3 text-white text-sm">
                      {method.name}
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      selectedPaymentMethod?.id === method.id
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View className="absolute bottom-1 left-0 right-0 bg-[#5829AB] py-4 px-6 rounded-t-2xl shadow-lg flex-row justify-between items-center">
          {/* Amount */}
          <View>
            <Text className="text-white text-xl font-bold">
              Rp {(payload.durasi * payload.harga_per_jam).toLocaleString("id-ID")}
            </Text>
            <Text className="text-white text-sm opacity-60">
              {i18n.t("totalPayment")}
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={() => handleSave()}
            className="bg-[#FF3366] py-3 px-5 rounded-2xl items-center shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Text className="text-white font-semibold text-base">
              {i18n.t("toPay")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
