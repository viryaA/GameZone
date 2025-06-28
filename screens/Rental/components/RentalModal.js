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
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import i18n from '../../../Locale/i18n';
import "../../../global.css";
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RentalModal({ visible, onClose, onSave, item, deleteItem, onDeleteConfirm,onDeleteCancel }) {
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [form, setForm] = useState({
        rtl_nama: '',
        rtl_alamat: '',
        rtl_latitude: '',
        rtl_longitude: '',
        rtl_status: 'Aktif',
    });

    const [errors, setErrors] = useState({});
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      handleChange('rtl_latitude', route.params.latitude);
      handleChange('rtl_longitude', route.params.longitude);
    }
  }, [route.params]);

    useEffect(() => {
        if (item) {
            setForm(item);
        } else {
            setForm({
                rtl_nama: '',
                rtl_alamat: '',
                rtl_latitude: '',
                rtl_longitude: '',
                rtl_status: 'Aktif',
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
        if (!form.rtl_nama.trim()) newErrors.rtl_nama = i18n.t('form_required');
        if (!form.rtl_alamat) newErrors.rtl_alamat = i18n.t('form_required');
        if (!form.rtl_latitude) newErrors.rtl_latitude = i18n.t('form_required');
        if (!form.rtl_longitude.trim()) newErrors.rtl_longitude = i18n.t('form_required');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        handleChange('rtl_latitude', location.coords.latitude);
        handleChange('rtl_longitude', location.coords.longitude);
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
                            <Text className="text-lg font-semibold text-red-700 mb-2">
                                {i18n.t("delete_title_jps")}
                            </Text>
                            <Text className="text-center text-gray-700 mb-4">
                                {i18n.t("delete_confirm_jps", { name: deleteItem?.rtl_nama })}
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
                                    {item ? i18n.t('title_add_rental') : i18n.t('title_add_rental')}
                                </Text>

                                {/* Nama */}
                                <Text className="font-medium mb-1">{i18n.t('nama')}</Text>
                                <TextInput
                                    placeholder={i18n.t('nama')}
                                    value={form.rtl_nama}
                                    onChangeText={(text) => handleChange('rtl_nama', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.rtl_nama ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.rtl_nama && <Text className="text-red-500 mb-2">{errors.rtl_nama}</Text>}

                                {/* Alamat */}
                                <Text className="font-medium mb-1">{i18n.t('alamat')}</Text>
                                <TextInput
                                    placeholder={i18n.t('alamat')}
                                    value={form.rtl_alamat}
                                    onChangeText={(text) => handleChange('rtl_alamat', parseInt(text) || '')}
                                    className={`border rounded-lg p-2 mb-2 ${errors.rtl_alamat ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.rtl_alamat && <Text className="text-red-500 mb-2">{errors.rtl_alamat}</Text>}

                                {/* latitude */}
                                <Text className="font-medium mb-1">{i18n.t('deskripsi')}</Text>
                                <TextInput
                                    placeholder={i18n.t('deskripsi')}
                                    value={form.rtl_latitude?.toString()}
                                    onChangeText={(text) => handleChange('rtl_latitude', parseInt(text) || '')}
                                    className={`border rounded-lg p-2 mb-2 ${errors.rtl_latitude ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.rtl_latitude && <Text className="text-red-500 mb-2">{errors.rtl_latitude}</Text>}

                                {/* longitude */}
                                <Text className="font-medium mb-1">{i18n.t('deskripsi')}</Text>
                                <TextInput
                                    placeholder={i18n.t('deskripsi')}
                                    value={form.rtl_longitude?.toString()}
                                    onChangeText={(text) => handleChange('rtl_longitude', parseInt(text) || '')}
                                    className={`border rounded-lg p-2 mb-2 ${errors.rtl_longitude ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.rtl_longitude && <Text className="text-red-500 mb-2">{errors.rtl_longitude}</Text>}

                                <TouchableOpacity
                                onPress={() => navigation.navigate('SelectLocationScreen')}
                                className="mt-2 bg-[#004080] py-2 px-4 rounded-xl items-center"
                                >
                                    <Text className="text-white font-poppins">Pilih Lokasi dari Peta</Text>
                                </TouchableOpacity>

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
                                        <Text className="text-gray-800 font-semibold text-base">{i18n.t('batal')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            if (validateForm()) {
                                                onSave(form);
                                            }
                                        }}
                                        disabled={!form.rtl_nama || !form.rtl_alamat || !form.rtl_latitude || !form.rtl_longitude}
                                        className={`flex-1 ml-2 py-3 rounded-xl items-center shadow ${
                                            form.rtl_nama && form.rtl_alamat && form.rtl_latitude && form.rtl_longitude
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
                                        <Text className="text-white font-semibold text-base">{i18n.t('simpan')}</Text>
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
