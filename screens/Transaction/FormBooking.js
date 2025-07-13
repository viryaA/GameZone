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
import PaymentModal from "./DetailRentail/components/PaymentModal";
import { useContext } from "react";
import { UserContext } from "../../Konteks/UserContext";
import {formatDate} from "../../Locale/constant";

const apiUrl = Constants.expoConfig.extra.API_URL;

const { width } = Dimensions.get("window");
const screenWidth = width;

export default function FormBooking() {
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
  const { itemsParam } = route.params;

  console.log("route", itemsParam);
  // DatePick
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log("datesss", date);
  // TIME PICK
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [duration, setDuration] = useState(0); // durasi dalam jam atau menit

  const fetchData = () => {
    setLoading(true);
    console.log("formattedDate", date);
    const formattedDate = date.toISOString().split("T")[0];
    fetch(
      `${apiUrl}/TrBooking/available-times?roomId=${itemsParam.rng_id}&date=${formattedDate}`
    )
      .then((res) => res.json())
      .then((json) => {
        let initialData = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];
        console.log('jsont: ' + formattedDate,json);

        setData(json);
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
    if (date != null) {
      fetchData();
    }
  }, [date]);

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

  const calculateEndTime = (startTime, durasi) => {
    if (!startTime || !durasi) return null;

    const [startHour, startMinute] = startTime
      .split(":")
      .map((v) => parseInt(v));
    if (isNaN(startHour) || isNaN(startMinute)) return null;

    const endHour = (startHour + durasi) % 24; // agar tetap dalam format 0–23
    return `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
  };

  const getAmPm = (timeStr) => {
    if (!timeStr) return "";
    const [hour] = timeStr.split(":").map(Number);
    return hour >= 12 ? "PM" : "AM";
  };
  const currentTime = new Date();

  useEffect(() => {
    // Fetch available times or update based on other logic here
  }, [duration]);

  const isBeforeCurrentTime = (timeStr) => {
    const currentDate = new Date();

    // Menggunakan tanggal yang dipilih, atau tanggal saat ini jika belum ada yang dipilih
    const selectedDateTime = new Date(date || currentDate);

    const [hour, minute] = timeStr.split(":").map(Number);

    // Set jam dan menit berdasarkan waktu yang dipilih
    selectedDateTime.setHours(hour);
    selectedDateTime.setMinutes(minute);

    // Bandingkan tanggal dan waktu yang dipilih dengan waktu saat ini
    return selectedDateTime < currentDate;
  };

  const formatDateTime = (dateObj, timeStr) => {
    const dateOnly = new Date(dateObj).toISOString().split("T")[0]; // "2025-07-10"
    return `${dateOnly}T${timeStr}:00`; // "2025-07-10T09:00:00"
  };

  const handlePay = (item) => {
    const params = {
      date: date,
      endTime: calculateEndTime(selectedTime, duration),
      durasi: duration,
      start: selectedTime,
      id_ruangan: item.rng_id,
      nama_ruangan: item.rng_nama_ruangan,
      harga_per_jam: item.rng_harga_per_jam,
      gambar: item.rng_image,
      totalBooking: item.totalBooking,
      book_id: 0
    };
    console.log("items.images", params.gambar);

    const payloads = {
      user: { usr_id: user.usr_id },
      ruangan: { rng_id: item.rng_id },
      bok_waktu_mulai: formatDateTime(date, params.start),
      bok_waktu_selesai: formatDateTime(date, params.endTime),
      bok_durasi_jam: duration,
      bok_total_biaya: parseInt(item.rng_harga_per_jam) * parseInt(duration),
    };

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
        params.book_id = resJson.data.bok_id;
        console.log("saveeeee", params);
        if (resJson.result === 1) {
          navigation.navigate("RequestToPay", { params });
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

  console.log("available", user);

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
              onPress={handleReset} // ganti sesuai fungsi reset kamu
              className="absolute right-0 justify-center items-center"
            >
              <Text className={duration === 0 ? "text-gray-600" : "text-white"}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Tanggal Booking */}
        <View className="px-4 mt-4">
          <Text className="text-white mb-2">{i18n.t("date")}</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className={`py-3 px-4 rounded-md ${user.usr_role !== "Pelanggan" ? "bg-white/10" : "bg-white/20"}`}
            disabled={user.usr_role !== "Pelanggan"}
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
              minimumDate={new Date()} // Membatasi tanggal minimum agar tidak bisa memilih tanggal yang lebih kecil dari hari ini
            />
          )}
        </View>

        {/* Input Durasi */}
        <View className="px-4 mt-4">
          <Text className="text-white mb-2">{i18n.t("durationBook")}</Text>
          <TextInput
            value={duration === 0 ? "" : duration.toString()}
            onChangeText={(text) => setDuration(parseInt(text) || 0)}
            placeholder="Masukkan durasi (jam)"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            className="bg-white/20 text-white py-3 px-4 rounded-md"
          />
        </View>

        {/* Static Time Slots */}
        <View className="px-4 mt-6">
          <Text className="text-white mb-2">Pilih Jam</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {duration === 0
              ? [
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                  "22:00",
                ].map((jam, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={isBeforeCurrentTime(jam)} // Disable times before current time
                    style={{
                      width: "48%",
                      paddingVertical: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#666",
                      marginBottom: 12,
                      alignItems: "center",
                      backgroundColor: "transparent",
                    }}
                    onPress={() => console.log("Selected:", jam)} // or setSelectedTime(jam)
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {jam}
                    </Text>
                  </TouchableOpacity>
                ))
              : availableTimes.map((item, index) => {
                  const isSelected = selectedTime === item.start;
                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={
                        item.disabled || isBeforeCurrentTime(item.start)
                      } // Disable times before current time
                      style={{
                        width: "48%",
                        paddingVertical: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor:
                          item.disabled || isBeforeCurrentTime(item.start)
                            ? "#666"
                            : isSelected
                              ? "#00B7FF"
                              : "white",
                        backgroundColor: isSelected
                          ? "#00B7FF55"
                          : "transparent",
                        marginBottom: 12,
                        alignItems: "center",
                        opacity:
                          item.disabled || isBeforeCurrentTime(item.start)
                            ? 0.4
                            : 1,
                      }}
                      onPress={() =>
                        !item.disabled && setSelectedTime(item.start)
                      }
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        {item.start}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
          </View>
        </View>
      </View>

      {/* Tombol Confirm To Book */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#5829AB] py-4 px-6 rounded-t-2xl shadow-lg">
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Ganti dengan buka modal kamu
          className="bg-[#FF3366] py-4 rounded-xl items-center shadow-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <Text className="text-white font-semibold text-base">Simpan</Text>
        </TouchableOpacity>
      </View>

      <PaymentModal
        visible={modalVisible}
        dates={date}
        startTime={selectedTime}
        durasi={duration}
        item={itemsParam}
        totalPrice={duration * 35000}
        onClose={() => setModalVisible(false)}
        onPay={() => {
          handlePay(itemsParam);
        }}
      />
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
