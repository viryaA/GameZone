import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { formatCurrencyRupiah } from '../../../Locale/constant';
import { ScrollView } from 'react-native-gesture-handler';

export default function DetailRuanganHome() {
    // const route = useRoute();
    // const { item } = route.params;

    const [activeTab, setActiveTab] = useState('description');
    const detailRuanganImageUri = require("../../../assets/detail-ruangan.png");
    const bintangKecildiLangityangBiru = require("../../../assets/bintang-kecil.png");
    const keranjang = require("../../../assets/keranjang.png");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // const fetchData = () => {
    //     setLoading(true);
    //     fetch(`${apiUrl}/MsRuangan/${item.rng_id}`)
    //     .then((res) => res.json())
    //     .then((json) => {
    //     let initialData = Array.isArray(json)
    //         ? json
    //         : Array.isArray(json.data)
    //         ? json.data
    //         : [];

    //     // Filter hanya data ruangan yang memiliki rental dan cocok dengan ID rental yang sedang aktif (misal item.rtl_id)
    //     const filteredData = json.filter((x) => x.rental.rtl_id === item.rtl_id);

    //     // Jika bukan sorting berdasarkan status, hanya ambil yang Aktif
    //     const visibleData = filteredData;

    //     console.log("rtl_id", item.rtl_id);

    //     setData(visibleData);
    //     setLoading(false);
    //     })
    //     .catch((err) => {
    //     console.error(err);
    //     Toast.show({
    //         type: "error",
    //         text1: i18n.t("failed"),
    //         text2: i18n.t("errorMessage"),
    //     });
    //     setLoading(false);
    //     });
    // };

    return (
        <View className="bg-[#1B1440]" style={{height: '100%'}}>
            <View className="bg-[#3F217A] rounded-3xl" style={{height: '40%'}}>
                <Image
                    source={detailRuanganImageUri}
                    style={{ width: "100%", height: "70%", borderRadius: 12 }}
                    resizeMode="cover"
                />
                <View className="bg-[#3F217A] px-4 py-3 rounded-b-2xl">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-white text-xl font-semibold font-poppins-bold">Room VIP 1</Text>
                        <Text className="text-orange-400 text-xl font-poppins-bold">{formatCurrencyRupiah(35000)}</Text>
                    </View>

                    <View className="flex-row items-center space-x-1">
                        <Image
                        source={bintangKecildiLangityangBiru}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                        />
                        <Text className="text-[#C7C7C7] text-l font-poppins">(200 Rentals)</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-center space-x-2 bg-[#1B1440] p-10 rounded-2xl">
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
            style={{ height: 200 }}
            className="bg-[#1B1440] p-5 rounded-2xl"
            showsVerticalScrollIndicator={false}
            >
                <Text
                    style={{ textAlign: 'justify' }}
                    className="text-white font-poppins text-sm"
                >
                    Rasakan pengalaman gaming maksimal di Ruang VIP 1 kami yang eksklusif. 
                    Dirancang untuk kenyamanan dan performa, ruangan ini dilengkapi pencahayaan RGB yang atmosferik, 
                    kursi gaming ergonomis, dan setup PC berteknologi tinggi. Cocok untuk mabar bareng teman, streaming, 
                    atau menikmati sesi solo gaming yang tenang dan privat. Gaming jadi lebih seru, nyaman, dan berkesan!
                </Text>
            </ScrollView>
            <View
            className="w-full px-4 absolute bottom-5 left-0 right-0 bg-[#3F217A] pt-5 pb-8 px-4"
            >
                <TouchableOpacity
                    className="bg-[#F75E7E] py-3 rounded-xl flex-row items-center justify-center gap-6"
                    onPress={() => {
                    // Aksi booking di sini
                    console.log('Booking...');
                    }}
                >
                    <Image
                        source={keranjang}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                    />
                    <Text className="text-white font-semibold text-xl font-poppins-bold">Book now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
