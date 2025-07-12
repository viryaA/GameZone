import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import i18n from "../../../Locale/i18n";
import ScreenPelangganWithBottomBar from '../../../TemplateComponent/ScreenPelangganWithBottomBar';
import MyTransactionCard from './components/MyTransactionCard';
import { UserContext } from '../../../Konteks/UserContext';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function MyListTransactionHome() {
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const jendela = require("../../../assets/jendela.png");
    const tabs = ["To Pay", "Confirmed", "Completed", "Cancelled"];

    const tabToStatus = {
        "To Pay": "Menunggu Pembayaran",
        "Confirmed": "Sesi Dimulai",
        "Completed": "Sesi Selesai",
        "Cancelled": "Dibatalkan"
    };

    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/TrBooking/BookingByUser/4`)
        .then((res) => res.json())
        .then((json) => {
        let initialData = Array.isArray(json)
            ? json
            : Array.isArray(json.data)
            ? json.data
            : [];

        const visibleData =
            activeTab === "All"
            ? initialData
            : initialData.filter(
                (item) => item.bok_status === tabToStatus[activeTab]
                );

        setData(visibleData);
        setLoading(false);
        })
        .catch((err) => {
        console.error(err);
        setLoading(false);
        });
    };

    useEffect(() => {
    fetchData();
    }, [activeTab]);

    console.log("user", data);
    return (
        <ScreenPelangganWithBottomBar>
            <ImageBackground
            source={require("../../../assets/default-background.png")}
            style={styles.background}
            resizeMode="cover"
            >
                <View>
                    <View style={{ paddingTop: 70, paddingHorizontal: 16 }}>
                        
                        <Text className="text-white text-center text-xl font-poppins mb-4">
                        Your Booking Transaction
                        </Text>
                        {/* Booking Cards */}
                    </View>
                    <View className="flex-row justify-between px-5 mb-4">
                        {tabs.map((tab) => (
                            <TouchableOpacity
                            key={tab}
                            onPress={() =>
                                setActiveTab(activeTab === tab ? "All" : tab)
                            }
                            className={`px-2 py-1 rounded-full border 
                                ${activeTab === tab 
                                ? 'bg-white border-white' 
                                : 'border-white bg-transparent'}
                            `}
                            >
                            <Text
                                className={`text-xs font-poppins ${
                                activeTab === tab ? 'text-[#1B1440]' : 'text-white'
                                }`}
                            >
                                {tab}
                            </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="green" />
                    <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
                </View>
                ) : (
                    <FlatList
                    data={data}
                    keyExtractor={(item) => item.bok_id.toString()}
                    renderItem={({ item }) => (
                        <MyTransactionCard
                        item={item}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center mt-24 px-6">
                        <Ionicons
                            name="game-controller-outline"
                            size={72}
                            color="#9CA3AF"
                        />
                        {/* abu-abu medium */}
                        <Text className="text-gray-600 text-2xl font-bold mt-6 text-center">
                            {i18n.t("ruanganNull")}
                        </Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
                    className="px-4"
                    />
                )}
            </ImageBackground>
        </ScreenPelangganWithBottomBar>
    )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
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
