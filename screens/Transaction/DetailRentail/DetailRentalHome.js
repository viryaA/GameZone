import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import i18n from "../../../Locale/i18n";
import "../../../global.css";
import SortSelector from "./components/SortSelector";
import FilterSelector from "./components/FilterSelector";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import RoomCard from "./components/RoomCard";

const apiUrl = Constants.expoConfig.extra.API_URL;

const { width } = Dimensions.get("window");

export default function DetailRentalHome() {
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
  const { item } = route.params;

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

          // Filter hanya data ruangan yang memiliki rental dan cocok dengan ID rental yang sedang aktif (misal item.rtl_id)
          const filteredData = json.filter(
              (x) => x.rental.rtl_id === item.rtl_id
          );

          // Jika bukan sorting berdasarkan status, hanya ambil yang Aktif
          const visibleData =
              sortBy !== "rng_status"
                  ? filteredData.filter((item) => item.rng_status === "Aktif")
                  : filteredData;

          console.log(
              "visiblde",
              json.filter((x) => x.rental.rtl_id === 3)
          );
          console.log("rtl_id", item.rtl_id);

          setData(visibleData);
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
    fetchData();
  }, []);

  const handleDetailLoc = (item) => {
    setSelectedItem(item);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleSave = (item) => {
    const method = isEdit ? "PUT" : "POST";
    fetch(`${apiUrl}/MsPlaystation`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
        .then((res) => res.json())
        .then((resJson) => {
          Toast.show({
            type: resJson.result === 1 ? "success" : "error",
            text1: resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
            text2: resJson.message,
          });
          setModalVisible(false);
          fetchData();
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

  const confirmDelete = () => {
    if (!deleteItem) return;
    fetch(`${apiUrl}/MsPlaystation/${deleteItem.pst_id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          Toast.show({
            type: "success",
            text1: i18n.t("success"),
            text2: i18n.t("deleteSuccess"),
          });
          fetchData();
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: i18n.t("failed"),
            text2: i18n.t("errorMessage"),
          });
        })
        .finally(() => setDeleteItem(null));
  };

  const applyAll = (
      baseData,
      searchQuery,
      status,
      Price,
      sortKey,
      sortOrder
  ) => {
    let filtered = [...baseData];

    // Apply filter
    if (status !== "All") {
      filtered = filtered.filter((item) => item.rtl_status === status);
    }

    // Apply search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
          item.rtl_nama.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply sort
    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
      });
    }

    setFilteredData(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAll(data, query, selectedStatus, selectedPrice, sortBy, sortOrder);
  };

  const applySort = (items, key, order) => {
    if (!key) {
      setFilteredData(items);
      return;
    }

    const sorted = [...items].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
    });

    setFilteredData(sorted);
  };

  const applyFilterAndSearch = (items, status, Price, jenis) => {
    let filtered = [...items];

    if (status !== "All") {
      filtered = filtered.filter((item) => item.pst_status === status);
    }

    if (Price !== "All") {
      filtered = filtered.filter(
          (item) => item.pst_harga_per_jam.toString() === Price
      );
    }

    if (jenis !== "All") {
      filtered = filtered.filter(
          (item) => item.jenisPlaystation.jps_nama.toString() === jenis
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
          item.pst_deskripsi.toLowerCase().includes(lowerQuery)
      );
    }

    applySort(filtered, sortBy, sortOrder);

    setselectedJenisPlay(jenis);
    setSelectedPrice(Price);
    setSelectedStatus(status);
  };

  return (
      <ImageBackground
          source={require("../../../assets/background-hal.png")} // ← Ganti dengan path ke gambar lokal kamu
          style={{ flex: 1 }}
          resizeMode="cover"
      >
        <View className="flex-1 bg-black/40">
          {/* Optional: overlay agar isi tetap kontras */}
          {/* App Bar */}
          <View className="pt-12 pb-4 mb-2 px-4">
            <View className="relative items-center justify-center">
              {/* Tombol Back */}
              <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="absolute left-0 w-9 h-9 rounded-full bg-white/20 justify-center items-center"
              >
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>

              {/* Title di Tengah */}
              <Text className="text-white font-semibold text-base">
                {item.rtl_nama}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center px-4 mb-4">
            <View className="flex-1 h-12">
              <ImageBackground
                  source={require("../../../assets/Search-Box.png")}
                  resizeMode="cover"
                  className="w-full h-full flex-row items-center pl-4 pr-4"
                  imageStyle={{ borderRadius: 16 }}
                  style={{ overflow: "hidden" }}
              >
                <Ionicons name="search-outline" size={18} color="#B0A6D9" />
                <TextInput
                    placeholder="Search.."
                    placeholderTextColor="#B0A6D9"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="ml-2 text-white flex-1"
                />
              </ImageBackground>
            </View>

            <TouchableOpacity onPress={() => setSortModalVisible(true)}>
              <ImageBackground
                  source={require("../../../assets/Bg.png")}
                  resizeMode="cover"
                  className="w-16 h-12 justify-center items-center"
                  imageStyle={{ borderRadius: 12 }}
                  style={{ overflow: "hidden" }}
              >
                <Ionicons name="options-outline" size={20} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-4 mt-4 rounded-2xl overflow-hidden">
            {/* Peta */}
            <MapView
                style={{ width: "100%", height: 200 }}
                initialRegion={{
                  latitude: item.rtl_latitude,
                  longitude: item.rtl_longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
            >
              <Marker
                  coordinate={{
                    latitude: item.rtl_latitude,
                    longitude: item.rtl_longitude,
                  }}
                  title={item.rtl_nama}
                  description={item.rtl_alamat}
              />
            </MapView>

            {/* Alamat */}
            <View className="bg-[#3A217C] px-4 py-3 flex-row items-start space-x-2">
              <Ionicons
                  name="location-outline"
                  size={18}
                  color="#fff"
                  className="mt-1"
              />
              <Text className="text-white ml-4 text-xs leading-5 flex-1">
                {item.rtl_alamat}
              </Text>
            </View>
          </View>

          {/* List Lokasi Rental */}
          {/* List Lokasi Rental */}
          <FlatList
              data={data}
              keyExtractor={(item) => item.rng_id.toString()}
              renderItem={({ item }) => (
                  <RoomCard
                      item={item}
                      menuItem={menuItem}
                      setMenuItem={setMenuItem}
                      setDeleteItem={setDeleteItem}
                      handleDetailLoc={handleDetailLoc}
                  />
              )}
              ListEmptyComponent={() => (
                  <View className="items-center justify-center mt-24 px-6">
                    <Ionicons name="game-controller-outline" size={72} color="#9CA3AF" />
                    {/* abu-abu medium */}
                    <Text className="text-gray-600 text-2xl font-bold mt-6 text-center">
                      {i18n.t("ruanganNull")}
                    </Text>
                  </View>
              )}
              contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
              className="px-4"
          />

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

          <SortSelector
              visible={sortModalVisible}
              onClose={() => setSortModalVisible(false)}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(key, order) => {
                setSortBy(key);
                setSortOrder(order);
                if (key === "pst_status") {
                  applySort(data, key, order);
                } else {
                  const aktifOnly = data.filter(
                      (item) => item.pst_status === "Aktif"
                  );
                  applySort(aktifOnly, key, order);
                }
              }}
          />
          <FilterSelector
              visible={filterModalVisible}
              selectedStatus={selectedStatus}
              selectedHargaperjam={selectedPrice}
              selectedJenisPlay={selectedJenisPlay}
              onApply={(status, Price, Jenis) => {
                applyFilterAndSearch(data, status, Price, Jenis);
              }}
              onClose={() => setFilterModalVisible(false)}
          />
        </View>
      </ImageBackground>
  );
}