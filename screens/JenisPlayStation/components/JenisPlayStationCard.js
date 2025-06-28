import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_PRIMARY } from "../../../Locale/constant";
import i18n from "../../../Locale/i18n";

const JenisPlayStationCard = ({
                                  item,
                                  menuItem,
                                  setMenuItem,
                                  setDeleteItem,
                                  handleEdit,
                              }) => {
    return (
        <View className="mb-4 rounded-2xl overflow-hidden shadow-lg bg-green-100">
            {/* Header - Nama PS */}
            <View
                className="px-4 py-3 flex-row items-center justify-between"
                style={{ backgroundColor: COLOR_PRIMARY }}
            >
                <View className="flex-row items-center">
                    <Ionicons name="game-controller-outline" size={18} color="#f6a12c" />
                    <Text className="ml-2 text-white font-poppins font-semibold">
                        {item.jps_nama}
                    </Text>
                </View>

                {item.jps_status === 'Aktif' && (
                    <TouchableOpacity onPress={() => setMenuItem(item)}>
                        <Ionicons name="ellipsis-vertical" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Konten Utama */}
            <Pressable
                onPress={() => {
                    if (item.jps_status === 'Aktif') {
                        handleEdit(item);
                    }
                }}
                className="bg-white px-4 py-4"
            >
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-gray font-poppins text-sm">
                        {i18n.t("maxPlayer")}: {item.jps_max_pemain}
                    </Text>
                    <Text
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.jps_status === 'Aktif'
                                ? 'bg-green-200 text-green-800 font-poppins'
                                : 'bg-red-200 text-red-800'
                        }`}
                    >
                        {item.jps_status}
                    </Text>
                </View>

            </Pressable>

            {/* Popup Modal */}
            {menuItem?.jps_id === item.jps_id && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={true}
                    onRequestClose={() => setMenuItem(null)}
                >
                    <TouchableOpacity
                        className="flex-1 justify-center items-center bg-black/40"
                        activeOpacity={1}
                        onPressOut={() => setMenuItem(null)}
                    >
                        <View className="bg-white rounded-lg w-64 p-4">
                            <Text className="text-base font-semibold text-gray-800 mb-3 font-poppins">Opsi</Text>
                            <TouchableOpacity
                                className="py-2"
                                onPress={() => {
                                    setMenuItem(null);
                                    handleEdit(item);
                                }}
                            >
                                <Text className="text-blue-600 font-poppins">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="py-2"
                                onPress={() => {
                                    setMenuItem(null);
                                    setDeleteItem(item);
                                }}
                            >
                                <Text className="text-red-600 font-poppins">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default JenisPlayStationCard;
