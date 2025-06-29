import { Modal, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
                    animationType="slide"
                    visible={true}
                    onRequestClose={() => setMenuItem(null)}
                >
                    <TouchableWithoutFeedback onPress={() => setMenuItem(null)}>
                        <View className="flex-1 bg-black/40 justify-end">
                            <TouchableWithoutFeedback>
                                <View className="bg-white w-full rounded-t-2xl p-5">
                                    {/* Drag Handle */}
                                    <View className="w-12 h-1 rounded-full bg-gray-300 self-center mb-4" />

                                    <Text className="text-base text-center text-gray-800 mb-4 font-poppins-bold">
                                        {i18n.t("action")}
                                    </Text>

                                    {/* Edit Button */}
                                    <TouchableOpacity
                                        className="flex-row items-center py-3 border-b border-gray-200"
                                        onPress={() => {
                                            setMenuItem(null);
                                            handleEdit(item);
                                        }}
                                    >
                                        <Ionicons name="pencil-outline" size={20} color="#2563eb" />
                                        <Text className="ml-2 text-blue-600 text-base font-poppins">{i18n.t("edit")}</Text>
                                    </TouchableOpacity>

                                    {/* Delete Button */}
                                    <TouchableOpacity
                                        className="flex-row items-center py-3"
                                        onPress={() => {
                                            setMenuItem(null);
                                            setDeleteItem(item);
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                        <Text className="ml-2 text-red-600 text-base font-poppins">{i18n.t("delete")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

export default JenisPlayStationCard;
