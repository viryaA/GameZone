// components/BottomSortModal.js
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../../locale/i18n';

const sortOptions = [
    { key: 'rtl_nama', label: i18n.t('rtl_nama') },
    { key: 'rtl_alamat', label: i18n.t('rtl_alamat') },
    { key: 'rtl_status', label: i18n.t('rtl_status') },
];

export default function BottomSortModal({ visible, onClose, sortBy, sortOrder, onSortChange }) {
    const handleSelect = (key) => {
        const nextOrder = (key === sortBy && sortOrder === 'asc') ? 'desc' : 'asc';
        onSortChange(key, nextOrder);
        onClose();
    };

    const handleReset = () => {
        onSortChange(null, 'asc');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/30 justify-end">
                    <View className="bg-white rounded-t-2xl p-6">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            {i18n.t('sort_by')}
                        </Text>
                        {sortOptions.map(({ key, label }) => {
                            const isSelected = sortBy === key;
                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleSelect(key)}
                                    className="flex-row items-center py-2"
                                >
                                    <Ionicons
                                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                                        size={20}
                                        color={isSelected ? "#059669" : "#9CA3AF"}
                                        style={{ marginRight: 10 }}
                                    />
                                    <Text className="text-base text-gray-800">
                                        {label} {isSelected ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            onPress={handleReset}
                            className="mt-6 px-4 py-2 bg-red-100 rounded-full items-center"
                        >
                            <Text className="text-red-700 font-medium">{i18n.t('reset')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
