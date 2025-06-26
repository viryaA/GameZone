import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../../locale/i18n'; // adjust the path as needed

export default function FilterSelector({
                                           visible,
                                           onClose,
                                           selectedStatus,
                                           selectedMaxPlayer,
                                           onApply,
                                       }) {
    const statusOptions = ['All', 'Aktif', 'Tidak Aktif'];

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-2xl p-6">
                    <Text className="text-lg font-semibold mb-4">{i18n.t("filter")}</Text>

                    {/* Status Filter */}
                    <Text className="mb-2 text-sm text-gray-700">{i18n.t("jps_status")}</Text>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {statusOptions.map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => onApply(status, selectedMaxPlayer)}
                                className={`px-4 py-2 rounded-full ${
                                    selectedStatus === status
                                        ? 'bg-green-600'
                                        : 'bg-gray-200'
                                }`}
                            >
                                <Text
                                    className={`${
                                        selectedStatus === status
                                            ? 'text-white'
                                            : 'text-gray-700'
                                    } font-medium`}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Max Player Filter */}
                    <Text className="mb-2 text-sm text-gray-700">
                        {i18n.t("jps_max_pemain")} ({i18n.t("leave_empty_for_all")})
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={selectedMaxPlayer === 'All' ? '' : selectedMaxPlayer}
                        onChangeText={(val) => {
                            const valid = val.replace(/[^0-9]/g, '');
                            onApply(selectedStatus, valid === '' ? 'All' : valid);
                        }}
                        placeholder="e.g. 2"
                        className="border border-gray-300 rounded-xl px-4 py-2 text-base text-gray-800"
                    />

                    <TouchableOpacity
                        className="mt-6 bg-green-600 py-2 rounded-full items-center"
                        onPress={onClose}
                    >
                        <Text className="text-white font-medium">{i18n.t("close")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
