import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { formatCurrencyRupiah } from '../../Locale/constant';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import i18n from "../../Locale/i18n";
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL;

export default function DetailTransactionHistoryHome() {
    const route = useRoute();
    const navigation = useNavigation();
    const { item } = route.params;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    console.log("item:",item);

    const barcodeUri = item.rng_image
        ? { uri: `${apiUrl}/Images/QRCodes/${item.bok_qr_code}` }
        : localImageMap[roomType];

    const [activeTab, setActiveTab] = useState('Booking');
    const detailRuanganImageUri = require("../../assets/detail-ruangan.png");
    useEffect(() => {
        const PaymentMethod = async () => {
            fetch(`${apiUrl}/Payment/GetByBookId` + item.bok_id )
                .then(res => res.json())
                .then(json => {
                    setLoading(false); // Stop loading
                    if (json['result']) {
                        setData(json.data);
                        console.log(json.data.user.usr_email);
                    }
                })
                .catch(err => {
                    setLoading(false); // Stop loading
                    console.error(err);
                    Toast.show({
                        type: 'error',
                        text1: i18n.t("failed"),
                        text2: i18n.t("error_message")
                    });
                });
        };

        PaymentMethod();
    }, []);
    return (
        <ImageBackground
            source={require("../../assets/background-hal.png")} // ← Ganti dengan path ke gambar lokal kamu
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
                    <Text className="text-white text-xs font-poppins-bold">{item.ruangan.rng_jenis_ruangan}</Text>
                </View>
                <View className="bg-[#3F217A] px-4 py-3 rounded-b-2xl">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-white text-l font-semibold font-poppins-bold">{item.ruangan.rng_nama_ruangan}</Text>
                        <Text className="text-orange-400 text-l font-poppins-bold">{formatCurrencyRupiah(item.ruangan.rng_harga_per_jam)}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-center space-x-2 rounded-2xl">
                <View className= "d-flex flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setActiveTab('Booking')}
                        className={`px-4 py-2 rounded-xl ${
                        activeTab === 'Booking' ? 'bg-[#3F217A]' : 'border border-white'
                        }`}
                    >
                        <Text className={`text-base font-poppins ${
                        activeTab === 'Booking' ? 'text-white' : 'text-white'
                        }`}>
                        Description
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('Barcode')}
                        className={`px-4 py-2 rounded-xl ${
                        activeTab === 'Barcode' ? 'bg-[#3F217A]' : 'border border-white'
                        }`}
                    >
                        <Text className={`text-base font-poppins ${
                        activeTab === 'Barcode' ? 'text-white' : 'text-white'
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
                <View className="bg-[#3F217A] rounded-2xl px-4 py-3 mb-3 border border-gray-400">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1 gap-1">
                            <Text className="text-white font-poppins-bold text-sm">
                                Customer Info
                            </Text>
                            <View className="flex-row flex-wrap">
                                <Text className="text-sm text-white font-poppins">
                                    {item.user.usr_nama}
                                </Text>
                                <Text className="text-sm text-white font-poppins">{"  - "}</Text>
                                <Text className="text-sm text-white font-poppins underline">
                                    {item.user.usr_email}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-[#3F217A] rounded-2xl px-4 py-3 mb-3 border border-gray-400">
                    <Text className="text-white font-semibold text-sm mb-2">Play Date & Time</Text>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-white text-base">
                                {new Date(item.bok_waktu_mulai).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    weekday: 'short',
                                })}
                            </Text>
                            <Text className="text-white text-sm">{formatTime(item.bok_waktu_mulai)}</Text>
                        </View>
                        <Text className="text-white text-xl">→</Text>
                        <View>
                            <Text className="text-white text-base">
                                {new Date(item.bok_waktu_selesai).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    weekday: 'short',
                                })}
                            </Text>
                            <Text className="text-white text-sm">{formatTime(item.bok_waktu_selesai)}</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-[#3F217A] rounded-2xl px-4 py-3 mb-3 border border-gray-400">
                    {/* Title */}
                    <Text className="text-white font-poppins-bold text-sm mb-3">
                        Payment Details
                    </Text>

                    {/* Line item: Rp 35.000 × 3 days */}
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-white text-base">
                            Rp {item.ruangan?.rng_harga_per_jam} × {item.bok_durasi_jam} days
                        </Text>
                        <Text className="text-white text-base">
                            {formatCurrencyRupiah(Number(item.ruangan?.rng_harga_per_jam) * Number(item.bok_durasi_jam))}
                        </Text>
                    </View>

                    {/* Discount */}
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-white text-base">Discount</Text>
                        <Text className="text-white text-base">-</Text>
                    </View>

                    {/* Total Amount */}
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-white font-poppins-bold text-base">Total Amount</Text>
                        <Text className="text-white font-poppins-bold text-base">
                            {formatCurrencyRupiah(Number(item.ruangan?.rng_harga_per_jam) * Number(item.bok_durasi_jam))}
                        </Text>
                    </View>

                    {/* Divider line */}
                    <View className="border-t border-gray-400 mb-2" />

                    {/* Payment Method */}
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-white text-sm">Method Of Payment</Text>
                        <Text className="text-white text-sm">{data.pym_metode}</Text>
                    </View>

                    {/* Status Transaction */}
                    <View className="flex-row justify-between">
                        <Text className="text-white text-sm">Status Transaction</Text>
                        <Text className="text-white text-sm">{data.pym_status}</Text>
                    </View>
                </View>


            </ScrollView>

            {activeTab === "Barcode" && (
                <View className="mb-4 items-center">
                    <Image
                        source={barcodeUri}
                        className="w-40 h-40 rounded-xl"
                        resizeMode="cover"
                    />
                    <Text className="text-white mt-2">{item.rng_name}</Text>
                </View>
            )}
        </View>
        </ImageBackground>
    );
}

function formatTime(datetimeStr) {
    if (!datetimeStr) return 'No time';
    const timePart = datetimeStr.split('T')[1]?.substring(0, 5); // HH:mm
    if (!timePart) return 'Invalid time';
    const [hourStr, minute] = timePart.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute} ${ampm}`;
}

