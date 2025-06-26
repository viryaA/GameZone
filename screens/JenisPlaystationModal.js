import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, View, Text, TextInput, Button, Platform, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import i18n from '../locale/i18n';
import "../global.css";

export default function JenisPlaystationModal({ visible, onClose, onSave, item }) {
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [form, setForm] = useState({
        jps_nama: '',
        jps_tahun_rilis: '',
        jps_max_pemain: '',
        jps_deskripsi: '',
        jps_status: 'Aktif',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setForm(item);
        } else {
            setForm({
                jps_nama: '',
                jps_tahun_rilis: '',
                jps_max_pemain: '',
                jps_deskripsi: '',
                jps_status: 'Aktif',
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
        if (!form.jps_nama.trim()) newErrors.jps_nama = i18n.t('form_required');
        if (!form.jps_tahun_rilis) newErrors.jps_tahun_rilis = i18n.t('form_required');
        if (!form.jps_max_pemain) newErrors.jps_max_pemain = i18n.t('form_required');
        if (!form.jps_deskripsi.trim()) newErrors.jps_deskripsi = i18n.t('form_required');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-11/12">
                    <View className="bg-white p-6 rounded-xl shadow-lg">
                        <Text className="text-xl font-bold mb-4 text-green-800">
                            {item ? i18n.t('title_edit_jenis_playstation') : i18n.t('title_add_jenis_playstation')}
                        </Text>

                        {/* Nama */}
                        <Text className="font-medium mb-1">{i18n.t('nama')}</Text>
                        <TextInput
                            placeholder={i18n.t('nama')}
                            value={form.jps_nama}
                            onChangeText={(text) => handleChange('jps_nama', text)}
                            className={`border rounded-lg p-2 mb-2 ${errors.jps_nama ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.jps_nama && <Text className="text-red-500 mb-2">{errors.jps_nama}</Text>}

                        {/* Tahun Rilis */}
                        <Text className="font-medium mb-1">{i18n.t('tahun')}</Text>
                        <TouchableOpacity
                            onPress={() => setShowYearPicker(true)}
                            className={`border rounded-lg p-2 mb-2 ${errors.jps_tahun_rilis ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <Text>{form.jps_tahun_rilis || i18n.t('tahun')}</Text>
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

                        {/* Max Pemain */}
                        <Text className="font-medium mb-1">{i18n.t('pemain')}</Text>
                        <TextInput
                            placeholder={i18n.t('pemain')}
                            keyboardType="numeric"
                            value={form.jps_max_pemain?.toString()}
                            onChangeText={(text) => handleChange('jps_max_pemain', parseInt(text) || '')}
                            className={`border rounded-lg p-2 mb-2 ${errors.jps_max_pemain ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.jps_max_pemain && <Text className="text-red-500 mb-2">{errors.jps_max_pemain}</Text>}

                        {/* Deskripsi */}
                        <Text className="font-medium mb-1">{i18n.t('deskripsi')}</Text>
                        <TextInput
                            placeholder={i18n.t('deskripsi')}
                            value={form.jps_deskripsi}
                            onChangeText={(text) => handleChange('jps_deskripsi', text)}
                            className={`border rounded-lg p-2 mb-2 ${errors.jps_deskripsi ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.jps_deskripsi && <Text className="text-red-500 mb-2">{errors.jps_deskripsi}</Text>}

                        {/* Status */}
                        <Text className="font-medium mb-1">Status</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker
                                selectedValue={form.jps_status}
                                onValueChange={(val) => handleChange('jps_status', val)}
                            >
                                <Picker.Item label="Aktif" value="Aktif" />
                                <Picker.Item label="Tidak Aktif" value="Tidak Aktif" />
                            </Picker>
                        </View>

                        {/* Actions */}
                        <View className="flex-row justify-between mt-4">
                            <Button title={i18n.t('batal')} color="gray" onPress={onClose} />
                            <Button
                                title={i18n.t('simpan')}
                                onPress={() => {
                                    if (validateForm()) {
                                        onSave(form);
                                    }
                                }}
                                disabled={!form.jps_nama || !form.jps_tahun_rilis || !form.jps_max_pemain || !form.jps_deskripsi}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </BlurView>
        </Modal>
    );
}
