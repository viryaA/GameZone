// RentalHome.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useContext } from 'react';
import { UserContext } from '../../../Konteks/UserContext';

import ScreenPelangganWithBottomBar from "../../../TemplateComponent/ScreenPelangganWithBottomBar";

// Locale & Constants
import i18n from "../../../Locale/i18n";
import { DAFTAR_KOTA } from "../../../Locale/constant";

// Components
import SortSelector from "./components/SortSelector";
import FilterSelector from "./components/FilterSelector";
import FilterKota from "./components/FilterKota";
import RentalCard from "./components/RentalCard";

// Assets
import "../../../global.css";

const { width } = Dimensions.get("window");
const screenWidth = width;
const apiUrl = Constants.expoConfig.extra.API_URL;

const bannerImages = [
  require("../../../assets/VIPRoom.png"),
  require("../../../assets/PrivateRoom.png"),
  require("../../../assets/RegularRoom.png"),
];

export default function RentalHome() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // State
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKota, setSelectedKota] = useState(null);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedJenisPlay, setSelectedJenisPlay] = useState("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
        console.log('User dari Context:', user);
  }, []);

  /** ----------- Lifecycle: Get User Location ------------ */
  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const location = await Location.getCurrentPositionAsync({});
        const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
        if (reverseGeocode.length > 0) {
          const userCity = reverseGeocode[0].subregion;
          const found = DAFTAR_KOTA.find((kota) =>
            userCity.toLowerCase().includes(kota.nama.toLowerCase())
          );
          if (found) setSelectedKota(found);
        }
      } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserLocation();
    fetchData(); // Initial fetch
  }, []);

  /** ----------- Fetch on Kota Change ------------ */
  useEffect(() => {
    if (selectedKota) fetchData();
  }, [selectedKota]);

  /** ----------- Banner Auto Scroll ------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % bannerImages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  /** ----------- API Fetch ------------ */
  const fetchData = () => {
    fetch(`${apiUrl}/MsRental`)
      .then((res) => res.json())
      .then((json) => {
        let items = Array.isArray(json) ? json : json.data || [];

        if (sortBy !== "rtl_status") {
          items = items.filter((item) => item.rtl_status === "Aktif");
        }

        if (selectedKota?.nama) {
          items = items.filter((item) =>
            item.rtl_kota?.toLowerCase().includes(selectedKota.nama.toLowerCase())
          );
        }

        setData(items);
        applySort(items, sortBy, sortOrder);
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

  /** ----------- Search ------------ */
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAllFilters(data, query, selectedStatus, selectedPrice, selectedJenisPlay, sortBy, sortOrder);
  };

  /** ----------- Apply Filter, Search, Sort ------------ */
  const applyAllFilters = (baseData, query, status, price, jenis, sortKey, sortOrder) => {
    let filtered = [...baseData];

    if (status !== "All") {
      filtered = filtered.filter((item) => item.rtl_status === status);
    }

    if (query) {
      filtered = filtered.filter((item) =>
        item.rtl_nama.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (price !== "All") {
      filtered = filtered.filter((item) =>
        item.pst_harga_per_jam?.toString() === price
      );
    }

    if (jenis !== "All") {
      filtered = filtered.filter((item) =>
        item.jenisPlaystation?.jps_nama?.toString() === jenis
      );
    }

    applySort(filtered, sortKey, sortOrder);
  };

  const applySort = (items, key, order) => {
    if (!key) return setFilteredData(items);

    const sorted = [...items].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "number") return order === "asc" ? aVal - bVal : bVal - aVal;
      return order === "asc"
        ? aVal?.localeCompare(bVal)
        : bVal?.localeCompare(aVal);
    });

    setFilteredData(sorted);
  };

  /** ----------- Render UI ------------ */
  return (
    <ScreenPelangganWithBottomBar>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require("../../../assets/default-background.png")}
            style={styles.background}
            resizeMode="cover"
          >
            <View style={{ flex: 1 }}>
              {/* ---------- Header ---------- */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.locationButton}>
                  <Ionicons name="location-outline" size={18} color="#fff" />
                  <Text style={styles.locationText}>{selectedKota?.nama || "Location"}</Text>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.greetingText}>
                    Hai <Text style={{ textDecorationLine: 'underline' }}>{user?.usr_username}!</Text>
                  </Text>
                  <TouchableOpacity>
                    <Image
                      source={
                        user?.usr_foto_profile
                          ? { uri: `${apiUrl}/Images/User/${user.usr_foto_profile}` }
                          : require('../../../assets/user-icon.png')
                      }
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                </View>
              </View>


              {/* ---------- Search + Filter ---------- */}
              <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                  <ImageBackground
                    source={require("../../../assets/Search-Box.png")}
                    style={styles.searchBackground}
                    imageStyle={styles.searchImage}
                    resizeMode="cover"
                  >
                    <Ionicons name="search-outline" size={18} color="#B0A6D9" />
                    <TextInput
                      placeholder="Search.."
                      placeholderTextColor="#B0A6D9"
                      value={searchQuery}
                      onChangeText={handleSearch}
                      style={styles.searchInput}
                    />
                  </ImageBackground>
                </View>

                <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                  <ImageBackground
                    source={require("../../../assets/Bg.png")}
                    style={styles.optionButton}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <Ionicons name="options-outline" size={20} color="#fff" />
                  </ImageBackground>
                </TouchableOpacity>
              </View>

              {/* ---------- Banners ---------- */}
              <View style={styles.bannerContainer}>
                <Animated.FlatList
                  ref={flatListRef}
                  data={bannerImages}
                  horizontal
                  pagingEnabled
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                  )}
                  renderItem={({ item }) => (
                    <View style={styles.bannerSlide}>
                      <Image source={item} style={styles.bannerImage} resizeMode="contain" />
                    </View>
                  )}
                />
                <View style={styles.dotsContainer}>
                  {bannerImages.map((_, index) => {
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
                        style={[styles.dot, { width: dotWidth, opacity }]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* ---------- Rental List ---------- */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="green" />
                  <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredData.length > 0 ? filteredData : data}
                  keyExtractor={(item) => item.rtl_id.toString()}
                  renderItem={({ item }) => (
                    <RentalCard
                      item={item}
                      handleDetailLoc={() => navigation.navigate("DetailRental", { item })}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 120 }}
                />
              )}

              {/* ---------- Modals ---------- */}
              <FilterKota
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectKota={(kota) => {
                  setSelectedKota(kota);
                  fetchData();
                  setModalVisible(false);
                }}
              />

              <SortSelector
                visible={sortModalVisible}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onClose={() => setSortModalVisible(false)}
                onSortChange={(key, order) => {
                  setSortBy(key);
                  setSortOrder(order);
                  applySort(data, key, order);
                }}
              />

              <FilterSelector
                visible={filterModalVisible}
                selectedStatus={selectedStatus}
                selectedHargaperjam={selectedPrice}
                selectedJenisPlay={selectedJenisPlay}
                onApply={(status, price, jenis) =>
                  applyAllFilters(data, searchQuery, status, price, jenis, sortBy, sortOrder)
                }
                onClose={() => setFilterModalVisible(false)}
              />
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenPelangganWithBottomBar>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
    fontFamily: 'Poppins',
    textDecorationLine: 'underline',
  },

});
