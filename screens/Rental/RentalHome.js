import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import i18n from "../../Locale/i18n";
import "../../global.css";
import SortSelector from "./components/SortSelector";
import FilterSelector from "./components/FilterSelector";
import { COLOR_PRIMARY } from "../../Locale/constant";
import SearchSortFilterBar from "../../TemplateComponent/SearchSortFilterBar";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import RentalCard from "./components/RentalCard";
import jenisPlaystationModal from "../JenisPlayStation/components/JenisPlaystationModal";
import { useNavigation } from "@react-navigation/native";
import JenisPlaystationModal from "../JenisPlayStation/components/JenisPlaystationModal";
import FilterKota from "./components/FilterKota";
import * as Location from "expo-location";
import { DAFTAR_KOTA } from "../../Locale/constant";

const apiUrl = Constants.expoConfig.extra.API_URL;

const { width } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;

export default function RentalHome() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [sortBy, setSortBy] = useState(null); // e.g. 'jps_nama'
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedJenisPlay, setselectedJenisPlay] = useState("All");
  const [menuItem, setMenuItem] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);

  // TAB Promotion
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  //Navigation
  const navigation = useNavigation();

  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Izin lokasi ditolak.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log("Koordinat lokasi:", location.coords);

        const reverseGeocode = await Location.reverseGeocodeAsync(
          location.coords
        );
        console.log("Hasil reverse geocode:", reverseGeocode);

        if (reverseGeocode.length > 0) {
          const data = reverseGeocode[0];

          // Ambil kota dari city, subregion, atau region
          const userCity = data.subregion;

          console.log("Kota hasil deteksi:", userCity);

          const kotaDitemukan = DAFTAR_KOTA.find((kota) =>
            userCity.toLowerCase().includes(kota.nama.toLowerCase())
          );

          if (kotaDitemukan) {
            setSelectedKota(kotaDitemukan);
            setLoading(false);
          } else {
            console.warn("Kota tidak ditemukan di daftar.");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
        setLoading(false);
      }
    };

    getUserLocation();
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${apiUrl}/MsRental`)
      .then((res) => res.json())
      .then((json) => {
        let initialData = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];

        // If not sorting by status, filter to only 'Aktif'
        if (sortBy !== "rtl_status") {
          initialData = initialData.filter(
            (item) => item.rtl_status === "Aktif"
          );
        }

        // Filter kota berdasarkan selectedKota.nama
        if (selectedKota && selectedKota.nama) {
          initialData = json.filter((item) =>
            item.rtl_kota
              ?.toLowerCase()
              .includes(selectedKota.nama.toLowerCase())
          );
        }

        setData(initialData);
        applySort(initialData, sortBy, sortOrder);
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: "error",
          text1: i18n.t("failed"),
          text2: i18n.t("errorMessage"),
        });
      });
  };
  useEffect(() => {
    if (selectedKota) {
      fetchData();
    }
  }, [selectedKota]);

  const handleDetailLoc = (item) => {
    navigation.navigate("DetailRental", { item });
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const applyAll = (baseData, searchQuery, status, sortKey, sortOrder) => {
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

  const banners = [
    require("../../assets/VIPRoom.png"),
    require("../../assets/PrivateRoom.png"),
    require("../../assets/RegularRoom.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Untuk update current index saat user swipe manual
  const onScroll = (e) => {
    const scrollX = e.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (width - 64)); // 64 = mx-4 left & right
    setCurrentIndex(index);
  };

  return (
    <ImageBackground
      source={require("../../assets/background-hal.png")} // ← Ganti dengan path ke gambar lokal kamu
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40">
        {/* Optional: overlay agar isi tetap kontras */}
        {/* App Bar */}
        <View className="flex-row mb-2 justify-between items-center px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={handleAdd}
            className="flex-row items-center bg-[#3A217C] px-3 py-2 rounded-full"
          >
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text className="text-white ml-2">
              {selectedKota !== null ? selectedKota?.nama : "Location"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#fff"
              className="ml-1"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <View className="flex-row items-center px-4 mb-4">
          <View className="flex-1 h-12">
            <ImageBackground
              source={require("../../assets/Search-Box.png")}
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
              source={require("../../assets/Bg.png")}
              resizeMode="cover"
              className="w-16 h-12 justify-center items-center"
              imageStyle={{ borderRadius: 12 }}
              style={{ overflow: "hidden" }}
            >
              <Ionicons name="options-outline" size={20} color="#fff" />
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {/* Banner Promo */}
        <View className="mx-4 mb-4 mt-4">
          <Animated.FlatList
            ref={flatListRef}
            data={banners}
            horizontal
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            snapToInterval={screenWidth * 0.8 + 16}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 0 }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: screenWidth * 0.8,
                  height: 200,
                  marginRight: 0,
                  marginBottom: 12,
                  borderRadius: 16,
                  overflow: "hidden",
                  // backgroundColor: "#f2f2f2", // fallback warna kalau image error
                }}
              >
                <Image
                  source={item}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <View className="flex-row justify-center space-x-2 mt-2">
            {banners.map((_, index) => {
              const inputRange = [
                (index - 1) * screenWidth,
                index * screenWidth,
                (index + 1) * screenWidth,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [30, 50, 30],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.5, 1, 0.5],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={{
                    width: dotWidth,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: "#3A217C",
                    marginHorizontal: 4,
                    opacity,
                  }}
                />
              );
            })}
          </View>
        </View>
        {/* List Lokasi Rental */}
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="green" />
            <Text className="mt-4 text-gray-500">{i18n.t("loading")}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.rtl_id.toString()}
            renderItem={({ item }) => (
              <RentalCard item={item} handleDetailLoc={handleDetailLoc} />
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center mt-24 px-6">
                <Ionicons
                  name="business-outline"
                  size={72}
                  color="#9CA3AF"
                />
                {/* abu-abu medium */}
                <Text className="text-gray-600 text-2xl font-bold mt-6 text-center">
                  {i18n.t("rentalNull")}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            className="px-4"
          />
        )}

        <FilterKota
          visible={modalVisible}
          item={selectedItem}
          onClose={() => setModalVisible(false)}
          onSelectKota={(kota) => {
            setSelectedKota(kota); // set kota manual
            fetchData(); // panggil ulang fetch
            setModalVisible(false);
          }}
        />

        <SortSelector
          visible={sortModalVisible}
          onClose={() => setSortModalVisible(false)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
            if (key === "rtl_status") {
              applySort(data, key, order);
            } else {
              const aktifOnly = data.filter(
                (item) => item.rtl_status === "Aktif"
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
