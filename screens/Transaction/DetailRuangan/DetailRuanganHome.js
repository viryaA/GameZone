import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { formatCurrencyRupiah } from '../../../Locale/constant';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import GameRoomCard from './components/GameRoomCard';
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import i18n from "../../../Locale/i18n";

export default function DetailRuanganHome() {
    const route = useRoute();
    const navigation = useNavigation();
    const { item } = route.params;
    const itemsParam  = item;

    const [activeTab, setActiveTab] = useState('description');
    const detailRuanganImageUri = require("../../../assets/detail-ruangan.png");
    const bintangKecildiLangityangBiru = require("../../../assets/bintang-kecil.png");
    const keranjang = require("../../../assets/keranjang.png");

    const listData = Array.isArray(item) ? item : [item];
    console.log("itemsParam", item)
    return (
        <ImageBackground
            source={require("../../../assets/background-hal.png")} // ← Ganti dengan path ke gambar lokal kamu
            style={{ flex: 1 }}
            resizeMode="cover"
        >
        <View className="bg-black/40" style={{height: '100%'}}>
            <View className="rounded-3xl" style={{height: '40%'}}>
                <Image
                    source={detailRuanganImageUri}
                    style={{ width: "100%", height: "70%", borderRadius: 12 }}
                    resizeMode="cover"
                />
                {/* <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute left-0 w-9 h-9 rounded-full bg-black justify-center items-center"
                    style={{
                    position: 'absolute',
                    top: 170,
                    left: 20,
                    backgroundColor: 'black',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    opacity: 0.8,
                    }}
                    >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity> */}
                <View
                    style={{
                    position: 'absolute',
                    top: 170,
                    left: 20,
                    backgroundColor: 'black',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    opacity: 0.8,
                    }}
                >
                    <Text className="text-white text-xs font-poppins-bold">{item.rng_jenis_ruangan}</Text>
                </View>
                <View className="bg-[#3F217A] px-4 py-3 rounded-b-2xl">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-white text-l font-semibold font-poppins-bold">{item.rng_nama_ruangan}</Text>
                        <Text className="text-orange-400 text-l font-poppins-bold">{formatCurrencyRupiah(item.rng_harga_per_jam)}</Text>
                    </View>

                    <View className="flex-row items-center space-x-1">
                        <Image
                        source={bintangKecildiLangityangBiru}
                        style={{ width: 30, height: 20 }}
                        resizeMode="contain"
                        />
                        <Text className="text-[#C7C7C7] text-l font-poppins">{`(${item.totalBooking} Rentals)`}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-center space-x-2 rounded-2xl">
                <View className= "d-flex flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setActiveTab('description')}
                        className={`px-4 py-2 rounded-xl ${
                        activeTab === 'description' ? 'bg-[#3F217A]' : 'border border-white'
                        }`}
                    >
                        <Text className={`text-base font-poppins ${
                        activeTab === 'description' ? 'text-white' : 'text-white'
                        }`}>
                        Description
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('specifications')}
                        className={`px-4 py-2 rounded-xl ${
                        activeTab === 'specifications' ? 'bg-[#3F217A]' : 'border border-white'
                        }`}
                    >
                        <Text className={`text-base font-poppins ${
                        activeTab === 'specifications' ? 'text-white' : 'text-white'
                        }`}>
                        Specifications
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
            className="p-5 rounded-2xl"
            showsVerticalScrollIndicator={false}
            >
                <Text
                style={{ textAlign: 'justify' }}
                className={`text-white font-poppins ${activeTab === 'description' ? "text-sm" : "text-l"} `}
                >
                {activeTab === 'description'
                    ? item.rng_deskripsi
                    : activeTab === 'specifications'
                    ? `TV Size          :  ${item.rng_ukuran_tv}\nRoom Size   :  ${item.rng_ukuran_ruangan}\nCapacity     :  ${item.rng_kapasitas}`
                    : ''}
                </Text>

                {activeTab === 'specifications' && (
                    <View style={{ height: 1, backgroundColor: 'gray', marginTop: 8 }} />
                )}
            </ScrollView>

            {activeTab === "specifications" && (
                <FlatList
                data={listData}
                keyExtractor={(item) => item.rng_id.toString()}
                renderItem={({ item }) => (
                    <GameRoomCard item={item} />
                )}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center mt-24 px-6">
                    <Ionicons name="game-controller-outline" size={72} color="#9CA3AF" />
                    <Text className="text-gray-600 text-2xl font-bold mt-6 text-center">
                        {i18n.t("ruanganNull")}
                    </Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 280, flexGrow: 1 }} // ← ini yang penting
                className="px-4"
                />
            )}
            <View
            className="w-full px-4 absolute bottom-5 left-0 right-0 bg-[#3F217A] pt-5 pb-8 px-4"
            >
                <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-3 bg-[#3F217A]">
                    <TouchableOpacity onPress={() => navigation.navigate("FormBooking", { itemsParam })} className="bg-[#F75E7E] py-3 rounded-xl flex-row items-center justify-center gap-3">
                    <Ionicons name="cart-outline" size={20} color="white" />
                    <Text className="text-white font-poppins-bold text-lg">Book now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ImageBackground>
    );
}
