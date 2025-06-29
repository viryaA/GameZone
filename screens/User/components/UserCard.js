import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_PRIMARY } from "../../../Locale/constant";
import i18n from "../../../Locale/i18n";
import Constants from 'expo-constants';
import UserProfilePhoto from "./UserProfilePhoto";

const apiUrl = Constants.expoConfig.extra.API_URL;

const UserCard = ({
                      item,
                      menuItem,
                      setMenuItem,
                      setDeleteItem,
                      handleEdit,
                  }) => {
    const profileImageUri = item.usr_foto_profile
        ? `${apiUrl}/Images/User/${item.usr_foto_profile}`
        : null;

    return (
        <View className="mb-4 rounded-2xl overflow-hidden shadow-lg bg-green-100">
            {/* Header */}
            <View
                className="px-4 py-3 flex-row items-center justify-between"
                style={{ backgroundColor: COLOR_PRIMARY }}
            >
                <View className="flex-row items-center">
                    {/* 👇 Modified: Open full image on press */}
                    <UserProfilePhoto uri={profileImageUri} />

                    <Text className="ml-2 text-white font-poppins font-semibold">
                        {item.usr_nama}
                    </Text>
                </View>

                {item.usr_status === 'Aktif' && (
                    <TouchableOpacity onPress={() => setMenuItem(item)}>
                        <Ionicons name="ellipsis-vertical" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Main Content */}
            <Pressable
                onPress={() => {
                    if (item.usr_status === 'Aktif') {
                        handleEdit(item);
                    }
                }}
                className="bg-white px-4 py-4"
            >
                <View className="flex-row justify-between items-center">
                    {/* Left: Email & Phone */}
                    <View>
                        {/* Email Row */}
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="mail-outline" size={16} color="#6b7280" />
                            <Text className="ml-2 text-gray-700 font-poppins text-sm">
                                {item.usr_email || '-'}
                            </Text>
                        </View>

                        {/* Phone Row */}
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={16} color="#6b7280" />
                            <Text className="ml-2 text-gray-700 font-poppins text-sm">
                                {item.usr_no_telp || '-'}
                            </Text>
                        </View>
                    </View>

                    {/* Right: Status Chip */}
                    <Text
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            item.usr_status === 'Aktif'
                                ? 'bg-green-200 text-green-800 font-poppins'
                                : 'bg-red-200 text-red-800'
                        }`}
                    >
                        {item.usr_status}
                    </Text>
                </View>
            </Pressable>

            {/* Modal Actions */}
            {menuItem?.usr_id === item.usr_id && (
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
                                    <View className="w-12 h-1 rounded-full bg-gray-300 self-center mb-4" />
                                    <Text className="text-base text-center text-gray-800 mb-4 font-poppins-bold">
                                        {i18n.t("action")}
                                    </Text>

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

export default UserCard;
