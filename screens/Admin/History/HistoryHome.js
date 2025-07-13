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
// import * as Location from "expo-location";
import { useContext } from 'react';
import { UserContext } from '../../../Konteks/UserContext';

import ScreenAdminWithBottomBar from "../../../TemplateComponent/ScreenAdminWithBottomBar";

// Locale & Constants
import i18n from "../../../Locale/i18n";
// Components
import SortSelector from "./components/SortSelector";
import RoomCard from "./components/RoomCard";

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

export default function HistoryHome() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKota, setSelectedKota] = useState(null);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // console.log('User dari Context:', user);
    fetchData(); // Initial fetch
    setSelectedKota(user?.rtl_id?.rtl_nama)
  }, []);


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
    // console.log("inilagifetch");
    console.log("user",user);
    fetch(`${apiUrl}/TrBooking/checkin-bookings/` + user?.usr_id)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text(); // use text() first
        })
        .then((text) => {
          if (!text) {
            console.warn("Empty response body");
            return null;
          }
          return JSON.parse(text);
        })
        .then((json) => {
          if (json) {
            console.log(json);
            let items = Array.isArray(json) ? json : json.data || [];
            setData(items);
            applySort(items, sortBy, sortOrder);
          }
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
    applyAllFilters(data, query, sortBy, sortOrder);
  };

  /** ----------- Apply Filter, Search, Sort ------------ */
  const applyAllFilters = (baseData, query, sortKey, sortOrder) => {
    let filtered = [...baseData];

    if (query) {
      filtered = filtered.filter((item) =>
        item.ruangan?.rng_nama_ruangan.toLowerCase().includes(query.toLowerCase())
      );
    }

    applySort(filtered, sortKey, sortOrder);
  };

  const applySort = (items, key, order) => {
    if (!key) return setFilteredData(items);

    const getValue = (obj, path) =>
        path.split('.').reduce((acc, part) => acc?.[part], obj);

    const sorted = [...items].sort((a, b) => {
      const aVal = getValue(a, key.replace(/\?/g, ''));
      const bVal = getValue(b, key.replace(/\?/g, ''));

      if (typeof aVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return order === "asc"
          ? `${aVal}`.localeCompare(`${bVal}`)
          : `${bVal}`.localeCompare(`${aVal}`);
    });

    setFilteredData(sorted);
  };


  /** ----------- Render UI ------------ */
  return (
    <ScreenAdminWithBottomBar>
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

              {/* ---------- Rental List ---------- */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="green" />
                  <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
                </View>
              ) : (
                  <View className="flex-1">
                    {/* Scrollable list */}
                    <FlatList
                        data={filteredData}
                        renderItem={({ item }) => <RoomCard item={item} />}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center mt-24">
                              <Ionicons name="business-outline" size={72} color="#9CA3AF" />
                              <Text className="text-gray-600 text-2xl font-bold mt-6 text-center">
                                {i18n.t("rentalNull")}
                              </Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}
                        className="px-4"
                    />
                  </View>


              )}

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
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenAdminWithBottomBar>
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
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    height: 35,
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
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    marginBottom: 12,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 4,
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
