import { Modal, View, Text, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import i18n from '../locale/i18n';
import "../global.css";

export default function JenisPlaystationModal({ visible, onClose, onSave, item }) {
    const [form, setForm] = useState({
        jps_nama: '',
        jps_tahun_rilis: '',
        jps_max_pemain: '',
        jps_deskripsi: '',
        jps_status: 'Aktif',
    });

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
    }, [item]);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="w-11/12 bg-white p-6 rounded-xl shadow-lg">
                    <Text className="text-xl font-bold mb-4 text-green-800">
                        {item ? i18n.t('title_edit_jenis_playstation') : i18n.t('title_add_jenis_playstation')}
                    </Text>

                    <TextInput
                        placeholder={i18n.t('nama')}
                        value={form.jps_nama}
                        onChangeText={(text) => handleChange('jps_nama', text)}
                        className="border border-gray-300 rounded-lg p-2 mb-2"
                    />
                    <TextInput
                        placeholder={i18n.t('tahun')}
                        value={form.jps_tahun_rilis?.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => handleChange('jps_tahun_rilis', parseInt(text))}
                        className="border border-gray-300 rounded-lg p-2 mb-2"
                    />
                    <TextInput
                        placeholder={i18n.t('pemain')}
                        value={form.jps_max_pemain?.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => handleChange('jps_max_pemain', parseInt(text))}
                        className="border border-gray-300 rounded-lg p-2 mb-2"
                    />
                    <TextInput
                        placeholder={i18n.t('deskripsi')}
                        value={form.jps_deskripsi}
                        onChangeText={(text) => handleChange('jps_deskripsi', text)}
                        className="border border-gray-300 rounded-lg p-2 mb-2"
                    />
                    <TextInput
                        placeholder={i18n.t('status')}
                        value={form.jps_status}
                        onChangeText={(text) => handleChange('jps_status', text)}
                        className="border border-gray-300 rounded-lg p-2 mb-4"
                    />

                    <View className="flex-row justify-between">
                        <Button title={i18n.t('batal')} color="gray" onPress={onClose} />
                        <Button title={i18n.t('simpan')} onPress={() => onSave(form)} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}