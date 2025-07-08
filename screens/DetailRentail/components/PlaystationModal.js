import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Modal,
    View,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import i18n from '../../../Locale/i18n';
import "../../../global.css";

export default function PlaystationModal({ visible, onClose, onSave, item, deleteItem, onDeleteConfirm,onDeleteCancel }) {
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [form, setForm] = useState({
        jps_id: '',
        jps_tahun_rilis: '',
        pst_serial_number: '',
        pst_merk: '',
        pst_harga_per_jam: 0,
        rtl_id: 'Aktif',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setForm(item);
        } else {
            setForm({
                jps_id: '',
                jps_tahun_rilis: '',
                pst_serial_number: '',
                pst_merk: '',
                pst_harga_per_jam: 0,
                rtl_id: 'Aktif',
            });
        }
        setErrors({});
    }, [item]);

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.jps_id.trim()) newErrors.jps_id = i18n.t('formRequired');
        if (!form.jps_tahun_rilis) newErrors.jps_tahun_rilis = i18n.t('formRequired');
        if (!form.pst_serial_number) newErrors.pst_serial_number = i18n.t('formRequired');
        if (!form.pst_merk.trim()) newErrors.pst_merk = i18n.t('formRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if(!!deleteItem){
        return (
            <Modal
                visible={!!deleteItem}
                transparent
                animationType="fade"
                onRequestClose={onDeleteCancel}
            >
                <TouchableWithoutFeedback onPress={onDeleteCancel}>
                    <View className="flex-1 bg-black/50 justify-center items-center">
                        <View className="bg-white p-6 rounded-xl w-11/12">
                            <Text className="text-xl font-bold mb-4 text-[#004080]">
                                {i18n.t("jpsDeleteTitle")}
                            </Text>
                            <Text className="text-center text-gray-700 mb-4">
                                {i18n.t("jpsDeleteConfirm", { name: deleteItem?.jps_id })}
                            </Text>
                            <View className="flex-row mt-4">
                                <TouchableOpacity
                                    className="flex-1 mr-2 py-3 rounded-xl bg-gray-200 items-center shadow"
                                    onPress={onDeleteCancel}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                        elevation: 3,
                                    }}
                                >
                                    <Text className="text-gray-800 font-semibold text-base">{i18n.t("cancel")}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 ml-2 py-3 rounded-xl bg-red-600 items-center shadow"
                                    onPress={onDeleteConfirm}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                        elevation: 3,
                                    }}
                                >
                                    <Text className="text-white font-semibold text-base">{i18n.t("delete")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                onClose();
            }}>
                <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-11/12"
                    >
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View className="bg-white p-6 rounded-xl shadow-lg">
                                <Text className="text-xl font-bold mb-4 text-[#004080]">
                                    {item ? i18n.t('jpsEditTitle') : i18n.t('jpsAddTitle')}
                                </Text>

                                {/* Nama */}
                                <Text className="font-medium mb-1">{i18n.t('name')}</Text>
                                <TextInput
                                    placeholder={i18n.t('name')}
                                    value={form.jps_id}
                                    onChangeText={(text) => handleChange('jps_id', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.jps_id ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.jps_id && <Text className="text-red-500 mb-2">{errors.jps_id}</Text>}

                                {/* Tahun */}
                                <Text className="font-medium mb-1">{i18n.t('releaseYear')}</Text>
                                <TouchableOpacity
                                    onPress={() => setShowYearPicker(true)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.jps_tahun_rilis ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <Text>{form.jps_tahun_rilis || i18n.t('releaseYear')}</Text>
                                </TouchableOpacity>
                                {errors.jps_tahun_rilis && <Text className="text-red-500 mb-2">{errors.jps_tahun_rilis}</Text>}

                                {showYearPicker && (
                                    <DateTimePicker
                                        value={form.jps_tahun_rilis ? new Date(form.jps_tahun_rilis, 0) : new Date()}
                                        mode="date"
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            setShowYearPicker(false);
                                            if (selectedDate) {
                                                const selectedYear = selectedDate.getFullYear().toString();
                                                handleChange('jps_tahun_rilis', selectedYear);
                                            }
                                        }}
                                    />
                                )}

                                {/* Pemain */}
                                <Text className="font-medium mb-1">{i18n.t('playerCount')}</Text>
                                <TextInput
                                    placeholder={i18n.t('playerCount')}
                                    keyboardType="numeric"
                                    value={form.pst_serial_number?.toString()}
                                    onChangeText={(text) => handleChange('pst_serial_number', parseInt(text) || '')}
                                    className={`border rounded-lg p-2 mb-2 ${errors.pst_serial_number ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.pst_serial_number && <Text className="text-red-500 mb-2">{errors.pst_serial_number}</Text>}

                                {/* Deskripsi */}
                                <Text className="font-medium mb-1">{i18n.t('description')}</Text>
                                <TextInput
                                    placeholder={i18n.t('description')}
                                    value={form.pst_merk}
                                    onChangeText={(text) => handleChange('pst_merk', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.pst_merk ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.pst_merk && <Text className="text-red-500 mb-2">{errors.pst_merk}</Text>}

                                {/* Status */}
                                <Text className="font-medium mb-1">Status</Text>
                                <View className="border border-gray-300 rounded-lg mb-4">
                                    <Picker
                                        selectedValue={form.rtl_id}
                                        onValueChange={(val) => handleChange('rtl_id', val)}
                                    >
                                        <Picker.Item label="Aktif" value="Aktif" />
                                        <Picker.Item label="Tidak Aktif" value="Tidak Aktif" />
                                    </Picker>
                                </View>

                                <View className="flex-row mt-6">
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="flex-1 mr-2 py-3 rounded-xl bg-gray-200 items-center shadow"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 3,
                                        }}
                                    >
                                        <Text className="text-gray-800 font-semibold text-base">{i18n.t('cancel')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            if (validateForm()) {
                                                onSave(form);
                                            }
                                        }}
                                        disabled={!form.jps_id || !form.jps_tahun_rilis || !form.pst_serial_number || !form.pst_merk}
                                        className={`flex-1 ml-2 py-3 rounded-xl items-center shadow ${
                                            form.jps_id && form.jps_tahun_rilis && form.pst_serial_number && form.pst_merk
                                                ? 'bg-[#004080]'
                                                : 'bg-[#004080]'
                                        }`}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 3,
                                        }}
                                    >
                                        <Text className="text-white font-semibold text-base">{i18n.t('save')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </BlurView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
