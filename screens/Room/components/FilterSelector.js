import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import i18n from '../../../Locale/i18n';
import {COLOR_PRIMARY} from "../../../Locale/constant";
import {Ionicons} from "@expo/vector-icons"; // adjust the path as needed

export default function FilterSelector({
                                           visible,
                                           onClose,
                                           selectedStatus,
                                           selectedRole,
                                           onApply,
                                       }) {
    const statusOptions = ['All', 'Aktif', 'Tidak Aktif'];
    const roleOptions = ['All', 'penyewa', 'super_admin','admin'];

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-2xl p-6">
                        <Text className="text-lg font-semibold mb-4">{i18n.t("filter")}</Text>

                        {/* Status Filter */}
                        <Text className={`mb-2 text-black font-poppins`}>{i18n.t("jpsStatus")}</Text>
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {statusOptions.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => onApply(status, selectedRole)}
                                    className={`px-4 py-2 rounded-lg ${
                                        selectedStatus === status
                                            ? `bg-[${COLOR_PRIMARY}]`
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <View className="flex-row gap-2">
                                        <Text
                                            className={`${
                                                selectedStatus === status
                                                    ? 'text-white'
                                                    : 'text-gray-700'
                                            } font-poppins`}
                                        >
                                            {status}
                                        </Text>
                                        {selectedStatus === status && (
                                            <Ionicons name="checkmark-done" size={18} color="green" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Role Filter */}
                        <Text className="mb-2 text-sm text-gray-700">
                            {i18n.t("role")}
                        </Text>
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {roleOptions.map((role) => (
                                <TouchableOpacity
                                    key={role}
                                    onPress={() => onApply(selectedStatus, role)}
                                    className={`px-4 py-2 rounded-lg ${
                                        selectedRole === role
                                            ? `bg-[${COLOR_PRIMARY}]`
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <View className="flex-row gap-2 items-center">
                                        <Text
                                            className={`${
                                                selectedRole === role
                                                    ? 'text-white'
                                                    : 'text-gray-700'
                                            } font-poppins`}
                                        >
                                            {role
                                                .split('_')
                                                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                                .join(' ')
                                            }
                                        </Text>
                                        {selectedRole === role && (
                                            <Ionicons name="checkmark-done" size={18} color="white" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            className={`mt-6 bg-[${COLOR_PRIMARY}] py-2 rounded-lg items-center`}
                            onPress={onClose}
                        >
                            <Text className="text-white font-medium">{i18n.t("close")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
