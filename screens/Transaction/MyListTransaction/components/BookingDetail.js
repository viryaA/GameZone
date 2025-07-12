import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { ImageBackground, View, StyleSheet, Image, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";import Toast from "react-native-toast-message";
import i18n from "../../../../Locale/i18n";
import { formatCurrencyRupiah, formatDate } from '../../../../Locale/constant';
import QRCodeCard from './QRCodeCard';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function BookingDetail() {
    const route = useRoute();
    const { item } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const detailRuanganImageUri = require("../../../../assets/detail-ruangan.png");
    const [activeTab, setActiveTab] = useState('booking');

    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/Payment/GetByBookId/` + item.bok_id)
        .then((res) => res.json())
        .then((json) => {
        let initialData = [];

        if (Array.isArray(json)) {
        initialData = json;
        } else if (Array.isArray(json.data)) {
        initialData = json.data;
        } else if (json.data && typeof json.data === 'object') {
        initialData = [json.data];
        } else if (typeof json === 'object' && json.pym_metode) {
        initialData = [json];
        }

        setData(initialData);
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

    console.log("data", data);
    console.log("id", item.bok_id);
    
    return (
        <ImageBackground
        source={require("../../../../assets/default-background.png")}
        style={styles.background}
        resizeMode="cover">
            <Image
                source={detailRuanganImageUri}
                style={{ width: "100%", height: "30%" }}
                resizeMode="cover"
            />
            <View className="pt-12 pb-4 mb-2 px-2" style={{ position: 'absolute', width: '100%' }}>
                <View className="items-center justify-center relative">
                    
                    {/* Title di Tengah */}
                    <Text className="text-white font-poppins-bold">
                    Booking Detail Transaction
                    </Text>

                    {/* Tombol Back di Kiri */}
                    <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute left-4 w-9 h-9 rounded-full bg-white/20 justify-center items-center"
                    >
                    <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>

                </View>
            </View>
            <View
                style={{
                position: 'absolute',
                top: 180,
                left: 20,
                backgroundColor: 'black',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                opacity: 0.8,
                }}
            >
                <Text className="text-white text-l font-poppins-bold">{item.ruangan.rng_jenis_ruangan}</Text>
            </View>
            <View className="bg-[#3F217A] px-4 py-3 rounded-b-2xl">
                <View className="flex-row justify-between items-center">
                    <Text className="text-white text-l font-semibold font-poppins-bold">{item.ruangan.rng_nama_ruangan}</Text>
                    <Text className="text-orange-400 text-l font-poppins">{formatCurrencyRupiah(item.bok_total_biaya)}</Text>
                </View>
            </View>

            <View className="flex-row">
                <TouchableOpacity
                onPress={() => setActiveTab("booking")}
                className={` ${activeTab === "booking" ? "bg-[#3F217A]" : "bg-transparent border border-white"} self-start rounded-lg px-4 py-2 mt-4 ml-4`}>
                    <Text className="text-white font-poppins-bold text-sm">Booking</Text>
                </TouchableOpacity>

                {item.bok_status !== "Menunggu Pembayaran" && item.bok_status !== "Dibatalkan" && (
                    <TouchableOpacity 
                    onPress={() => setActiveTab("barcode")}
                    className={`${activeTab === "barcode" ? "bg-[#3F217A]" : "bg-transparent border border-white"} self-start rounded-lg px-4 py-2 mt-4 ml-4`}>
                        <Text className="text-white font-poppins-bold text-sm">Barcode</Text>
                    </TouchableOpacity>
                )}
                {item.bok_status === "Sesi Selesai" && (
                    <TouchableOpacity 
                    onPress={() => {
                        const downloadUrl = `${apiUrl}/TrBooking/download-invoice/` + item.bok_id;
                        fetch(downloadUrl, {
                            method: 'GET',
                        })
                            .then((res) => {
                            if (res.ok) {
                                Toast.show({
                                    type: "success",
                                    text1: "Sukses",
                                    text2: "Berhasil mengirim invoice!",
                                });
                            } else {
                                Toast.show({
                                    type: "error",
                                    text1: "Gagal",
                                    text2: "Gagal mengirim invoice!",
                                });
                            }
                            })
                            .catch((err) => {
                            console.error("Error:", err);
                            Toast.show({
                                    type: "error",
                                    text1: "Gagal",
                                    text2: "Terjadi kesalahan pada saat mengirim invoice!",
                                });
                            });
                    }}
                    className="bg-transparent self-start rounded-lg px-4 py-2 mt-3 ml-3">
                        <Ionicons name="print-outline" size={30} color="white" />
                    </TouchableOpacity>
                )}
            </View>
            
            {activeTab === "booking" && (
                <>
                    <View className="bg-[#3F217A] rounded-xl mt-4 mx-4 p-4">
                        <Text className="text-white font-poppins-bold text-base mb-2">Play Date & Time</Text>
                        <View className="flex-row justify-between items-center">
                            <View className="items-center">
                            <Text className="text-white font-poppins-bold text-sm">{formatDate(item.bok_waktu_mulai, true)}</Text>
                            <Text className="text-white text-xs font-poppins">{formatDate(item.bok_waktu_mulai, false, true)}</Text>
                            </View>
                            <Text className="text-white font-bold">→</Text>
                            <View className="items-center">
                            <Text className="text-white font-poppins-bold text-sm">{formatDate(item.bok_waktu_selesai, true)}</Text>
                            <Text className="text-white text-xs font-poppins">{formatDate(item.bok_waktu_selesai, false, true)}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-[#3F217A] rounded-xl mt-4 mx-4 p-4">
                        <Text className="text-white font-poppins-bold text-base mb-2">Payment Details</Text>
                        <View className="flex-row justify-between">
                            <View className="flex-row">
                                <Text className="text-white font-poppins text-sm">{formatCurrencyRupiah(item.ruangan.rng_harga_per_jam)}</Text>
                                <Text className="text-white font-poppins text-sm"> X {item.bok_durasi_jam} Hours</Text>
                            </View>
                            <Text className="text-white font-poppins text-sm">{formatCurrencyRupiah(item.bok_total_biaya)}</Text>
                        </View>
                        <View className="flex-row justify-between mt-1">
                            <Text className="text-white font-poppins text-sm">Discount</Text>
                            <Text className="text-white font-poppins text-sm">-</Text>
                        </View>
                        <View className="flex-row justify-between mt-1">
                            <Text className="text-white font-poppins text-sm">Total Amount</Text>
                            <Text className="text-white font-poppins text-sm">{formatCurrencyRupiah(item.bok_total_biaya)}</Text>
                        </View>
                        <View className="border-t border-white my-2" />
                        {item.bok_status !== "Menunggu Pembayaran" && item.bok_status !== "Dibatalkan" && (
                            <View className="flex-row justify-between">
                                <Text className="text-white font-poppins text-sm">Method Of Payment</Text>
                                <Text className="text-white font-poppins text-sm">{data[0]?.pym_metode || "-"}</Text>
                            </View>
                        )}
                        <View className="flex-row justify-between mt-1">
                            <Text className="text-white font-poppins text-sm">Status Transaction</Text>
                            <Text className="text-white font-poppins text-sm">{
                            item.bok_status === "Sesi Selesai"? "Completed"
                            : item.bok_status === "Menunggu Pembayaran"? "Awaiting Payment"
                            : item.bok_status === "Dibatalkan"? "Cancelled"
                            : "Payment Received"
                            }</Text>
                        </View>
                    </View>

                    {item.bok_status === "Menunggu Pembayaran" ? (
                        <TouchableOpacity
                        className="bg-[#FF5B7F] mx-4 mt-4 rounded-full py-3 flex-row items-center justify-center"
                        onPress={() => {/* handle payment */}}
                        >
                            <Ionicons name="cart" size={20} color="white" />
                            <Text className="text-white font-poppins-bold text-base ml-2">Payment Now</Text>
                        </TouchableOpacity>
                    ) : item.bok_status === "Dibatalkan" ? (
                        <TouchableOpacity
                        className="bg-[#FF5B7F] mx-4 mt-4 rounded-full py-3 flex-row items-center justify-center"
                        onPress={() => {/* handle payment */}}
                        >
                            <Ionicons name="cart" size={20} color="white" />
                            <Text className="text-white font-poppins-bold text-base ml-2">Book Again</Text>
                        </TouchableOpacity>
                    ) : null}
                </>
            )}

            {activeTab === "barcode" && (
                <QRCodeCard qrCode={item.bok_qr_code}/>
            )}
        </ImageBackground>
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