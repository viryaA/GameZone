import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const apiUrl = Constants.expoConfig.extra.API_URL;

const RoomCard = ({ item, onPress }) => {
  const navigation = useNavigation();
  const localImageMap = {
    VIP: require("../../../../assets/VIPRoom.png"),
    Private: require("../../../../assets/PrivateRoom.png"),
    Reguler: require("../../../../assets/RegularRoom.png"),
  };

  // Tentukan tipe ruangan berdasarkan nama
  let roomType = "Reguler"; // default
  if (item.rng_nama_ruangan.includes("VIP")) {
    roomType = "VIP";
  } else if (item.rng_nama_ruangan.includes("Private")) {
    roomType = "Private";
  }

  const profileImageUri = item.rng_image
      ? { uri: `${apiUrl}/Images/Ruangan/${item.rng_image}` }
      : localImageMap[roomType];

  return (
      <TouchableOpacity
          onPress={() => navigation.navigate("DetailRuangan", { item })}
          activeOpacity={0.9}
          className="flex-row bg-[#1B1440] rounded-2xl px-3 py-3 mb-3 relative"
          style={{ minHeight: 100 }}
      >
        {/* Gambar */}
        <Image
            source={profileImageUri}
            style={{ width: 100, height: 100, borderRadius: 12 }}
            resizeMode="cover"
        />

        {/* Konten Tengah */}
        <View className="flex-1 px-3 justify-between">
          <View>
            <Text className="text-white font-semibold text-sm">
              {item.rng_nama_ruangan}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={14} color="#FFB400" />
              <Text className="text-xs text-gray-400 ml-1">
                ({item.rental_count || 200} Rentals)
              </Text>
            </View>
          </View>
        </View>

        {/* Harga di Pojok Kanan Atas */}
        <Text className="absolute top-2 right-2 text-[#FFB400] font-bold text-sm">
          Rp {item.rng_harga_per_jam?.toLocaleString("id-ID") || "0"}
        </Text>

        {/* Tombol Keranjang di Pojok Kanan Bawah */}
        <TouchableOpacity className="absolute bottom-2 right-2 bg-[#F66C93] w-9 h-9 rounded-br-2xl rounded-tl-2xl justify-center items-center">
          <Ionicons name="cart-outline" size={18} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
  );
};

export default RoomCard;