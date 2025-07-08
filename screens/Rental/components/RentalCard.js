import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'; 


const RentalCard = ({ item, handleDetailLoc }) => {
  return (
    <LinearGradient
      colors={['rgb(96, 57, 200)', 'rgb(7, 22, 79)']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 16,
        marginHorizontal: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          handleDetailLoc(item);
        }}
        activeOpacity={0.8}
        style={{
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Kiri: Icon + Teks */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require("../../../assets/icon-gamepad.png")}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginLeft: 16 }}>
            {item.rtl_nama}
          </Text>
        </View>

        {/* Kanan: Panah */}
        <Ionicons name="chevron-forward" size={25} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default RentalCard;
