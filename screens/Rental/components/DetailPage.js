import { useRoute } from '@react-navigation/native';
import React from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Linking,
} from 'react-native';
import { COLOR_PRIMARY, COLOR_THIRD } from '../../../Locale/constant';

function DetailPage() {
  const route = useRoute();
  const { rentalItem } = route.params;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

  return (
    <View className="bg-white rounded-2xl mx-4 p-4">
      <View className="pb-5 flex-row">
        <Text className="font-poppins-bold text-lg" style={{color: COLOR_PRIMARY}}>Game</Text>
        <Text className="font-poppins-bold text-lg" style={{color: COLOR_THIRD}}>Zone</Text>
      </View>
        {/* Baris 1 */}
        <View className="flex-row mb-2">
          <View className="flex-1">
            <Text className="text-gray-500">Name</Text>
            <Text className="font-poppins">{rentalItem.rtl_nama}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500">Alamat</Text>
            <Text className="font-poppins">{rentalItem.rtl_alamat}</Text>
          </View>
        </View>

        {/* Baris 2 */}
        <View className="flex-row mb-2">
          <View className="flex-1">

          <TouchableOpacity
          onPress={() => {
            const lat = rentalItem.rtl_latitude;
            const lng = rentalItem.rtl_longitude;
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            Linking.openURL(url);
          }}
          className="flex-1"
        >
          <Text className="text-gray-500">Lokasi</Text>
          <Text className="font-poppins text-blue-500 underline">
            Lihat lokasi disini
          </Text>
        </TouchableOpacity>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500">Status</Text>
            <Text className="font-poppins">{rentalItem.rtl_status}</Text>
          </View>
        </View>
    </View>
  )
}

export default DetailPage