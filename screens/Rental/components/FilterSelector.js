import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../../locale/i18n'; // adjust the path as needed
import { COLOR_PRIMARY } from '../../../locale/constant';

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
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/40">
                    <View className={`bg-white rounded-t-2xl p-6`}>
                        <View className="items-center mb-4">
                            <Text className="text-xl font-poppins">{i18n.t("filter")}</Text>
                        </View>

                        {/* Status Filter */}
                        <Text className={`mb-2 text-black font-poppins`}>{i18n.t("rtl_status")}</Text>
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {statusOptions.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => onApply(status, selectedMaxPlayer)}
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

                        {/* Max Player Filter */}
                        {/* <Text className="mb-2 text-sm text-gray-700">
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
                        /> */}

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
