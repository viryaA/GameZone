import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RentalCard = ({ item, handleDetailLoc }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        handleDetailLoc(item);
      }}
      activeOpacity={0.8}
      className="mx-4 mb-4 px-4 py-3 flex-row items-center justify-between"
      style={{
        backgroundColor: "#3d1d80",
        borderRadius: 16, // lebih membulat dari rounded-xl
      }}
    >
      {/* Kiri: Icon + Teks */}
      <View className="flex-row items-center space-x-3">
        <Image
          source={require("../../../assets/icon-gamepad.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
        <Text className="text-white font-semibold text-sm ml-3">
          {item.rtl_nama}
        </Text>
      </View>

      {/* Kanan: Panah */}
      <Ionicons name="chevron-forward" size={20} color="white" />
    </TouchableOpacity>
  );
};

export default RentalCard;
