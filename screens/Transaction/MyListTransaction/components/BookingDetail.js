import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react'
import { ImageBackground, View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { formatCurrencyRupiah } from '../../../../Locale/constant';

export default function BookingDetail() {
    const route = useRoute();
    const { item } = route.params;
    const navigation = useNavigation();

    const detailRuanganImageUri = require("../../../../assets/detail-ruangan.png");
    return (
        <ImageBackground
        source={require("../../../../assets/default-background.png")}
        style={styles.background}
        resizeMode="cover">
            <Image
                source={detailRuanganImageUri}
                style={{ width: "100%", height: "30%", borderRadius: 12 }}
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
                    <Text className="text-white text-l font-semibold font-poppins-bold">{item.rng_nama_ruangan}</Text>
                    <Text className="text-orange-400 text-l font-poppins-bold">{formatCurrencyRupiah(item.rng_harga_per_jam)}</Text>
                </View>

                <View className="flex-row items-center space-x-1">
                    <Text className="text-[#C7C7C7] text-l font-poppins">{`(${item.totalBooking} Rentals)`}</Text>
                </View>
            </View>
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