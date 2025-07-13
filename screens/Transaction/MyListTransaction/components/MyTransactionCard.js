import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Image, TouchableOpacity, View, Text } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import {formatDate, formatDatePlus7} from '../../../../Locale/constant';
import confirmed from "../../../../assets/confirmed.png";

export default function MyTransactionCard({ item }) {
    const navigation = useNavigation();
    const keyboard = require("../../../../assets/keyboard.png");
    const confirmed = require("../../../../assets/confirmed.png");
    const toPay = require("../../../../assets/to-pay.png");
    const completed = require("../../../../assets/completed.png");
    const cancelled = require("../../../../assets/cancelled.png");
  return (
    <View>
        <TouchableOpacity
            onPress={() => navigation.navigate("DetailBooking", { item })}
            activeOpacity={0.9}
            className="flex-row bg-[#3F217A] rounded-2xl px-3 py-3 mb-3 relative"
            style={{ minHeight: 50 }}
        >
            {/* Gambar */}
            <Image
                source={keyboard}
                style={{ width: 70, height: 70, borderRadius: 12 }}
                resizeMode="cover"
            />

            {/* Konten Tengah */}
            <View className="flex-1 px-3 justify-center">
                <View>
                <Text className="text-white font-poppins-bold text-l">
                    {item.ruangan.rng_nama_ruangan}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-sm text-gray-400 font-poppins">
                    {formatDatePlus7(item.bok_waktu_mulai)}
                    </Text>
                </View>
                </View>
            </View>

            {/* Harga di Pojok Kanan Atas */}
            <Text className="absolute top-2 right-2 text-[#FFB400] font-poppins text-sm mr-2">
                Rp {item.bok_total_biaya?.toLocaleString("id-ID") || "0"}
            </Text>

            {/* Tombol Keranjang di Pojok Kanan Bawah */}
            <TouchableOpacity
            className="absolute bottom-0 right-0 justify-center items-center"
            style={{
                backgroundColor: "#F66C93",
                width: 50,
                height: 50,
                borderTopLeftRadius: 35,
                borderBottomRightRadius: 12,
            }}
            >
            <Image source={
                item.bok_status === "Sesi Selesai" ? completed
                : item.bok_status === "Pembayaran Diterima" ? confirmed
                : item.bok_status === "Sesi Dimulai" ? confirmed
                : item.bok_status === "Menunggu Pembayaran" ? toPay
                : cancelled
                }
                    style={{ width: "50%", height: "50%"}}
                    resizeMode="contain"/>
            </TouchableOpacity>
        </TouchableOpacity>
    </View>
  )
}