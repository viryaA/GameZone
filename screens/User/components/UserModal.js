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

const roleOptions = ['penyewa', 'super_admin', 'admin'];

export default function UserModal({ visible, onClose, onSave, item, deleteItem, onDeleteConfirm, onDeleteCancel }) {
    const [form, setForm] = useState({
        usr_nama: '',
        usr_email: '',
        usr_password: '',
        usr_role: 'penyewa',
        usr_no_telp: '',
        usr_tgl_lahir: '',
        usr_gender: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setForm(item);
        } else {
            setForm({
                usr_nama: '',
                usr_email: '',
                usr_password: '',
                usr_role: 'penyewa',
                usr_no_telp: '',
                usr_tgl_lahir: '',
                usr_gender: '',
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
        if (!form.usr_nama.trim()) newErrors.usr_nama = i18n.t('formRequired');
        if (!form.usr_email.trim()) newErrors.usr_email = i18n.t('formRequired');
        if (!form.usr_password.trim()) newErrors.usr_password = i18n.t('formRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (deleteItem) {
        return (
            <Modal visible transparent animationType="fade" onRequestClose={onDeleteCancel}>
                <TouchableWithoutFeedback onPress={onDeleteCancel}>
                    <View className="flex-1 bg-black/50 justify-center items-center">
                        <View className="bg-white p-6 rounded-xl w-11/12">
                            <Text className="text-xl font-bold mb-4 text-[#004080]">
                                {i18n.t("jpsDeleteTitle")}
                            </Text>
                            <Text className="text-center text-gray-700 mb-4">
                                {i18n.t("jpsDeleteConfirm", { name: deleteItem?.usr_nama })}
                            </Text>
                            <View className="flex-row mt-4">
                                <TouchableOpacity
                                    className="flex-1 mr-2 py-3 rounded-xl bg-gray-200 items-center shadow"
                                    onPress={onDeleteCancel}
                                >
                                    <Text className="text-gray-800 font-semibold text-base">{i18n.t("cancel")}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 ml-2 py-3 rounded-xl bg-red-600 items-center shadow"
                                    onPress={onDeleteConfirm}
                                >
                                    <Text className="text-white font-semibold text-base">{i18n.t("delete")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
                <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-11/12"
                    >
                        <TouchableWithoutFeedback>
                            <View className="bg-white p-6 rounded-xl shadow-lg">
                                <Text className="text-xl font-bold mb-4 text-[#004080]">
                                    {item ? i18n.t('editUser') : i18n.t('addUser')}
                                </Text>

                                {/* Nama */}
                                <Text className="font-medium mb-1">{i18n.t('name')}</Text>
                                <TextInput
                                    placeholder={i18n.t('name')}
                                    value={form.usr_nama}
                                    onChangeText={text => handleChange('usr_nama', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.usr_nama ? 'border-red-500' : 'border-gray-300'}`}
                                />

                                {/* Email */}
                                <Text className="font-medium mb-1">Email</Text>
                                <TextInput
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    value={form.usr_email}
                                    onChangeText={text => handleChange('usr_email', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.usr_email ? 'border-red-500' : 'border-gray-300'}`}
                                />

                                {/* Password */}
                                <Text className="font-medium mb-1">{i18n.t('password')}</Text>
                                <TextInput
                                    placeholder={i18n.t('password')}
                                    secureTextEntry
                                    value={form.usr_password}
                                    onChangeText={text => handleChange('usr_password', text)}
                                    className={`border rounded-lg p-2 mb-2 ${errors.usr_password ? 'border-red-500' : 'border-gray-300'}`}
                                />

                                {/* Role (Only for Admin) */}
                                <Text className="font-medium mb-1">Role</Text>
                                <View className="border border-gray-300 rounded-lg mb-4">
                                    <Picker
                                        selectedValue={form.usr_role}
                                        onValueChange={val => handleChange('usr_role', val)}
                                    >
                                        {roleOptions.map(role => (
                                            <Picker.Item key={role} label={role
                                                .split('_')
                                                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                                .join(' ')
                                            } value={role} />
                                        ))}
                                    </Picker>
                                </View>

                                {/* Phone */}
                                <Text className="font-medium mb-1">No Telp</Text>
                                <TextInput
                                    placeholder="No Telp"
                                    keyboardType="phone-pad"
                                    value={form.usr_no_telp}
                                    onChangeText={text => handleChange('usr_no_telp', text)}
                                    className="border border-gray-300 rounded-lg p-2 mb-2"
                                />

                                {/* Gender */}
                                <Text className="font-medium mb-1">Gender</Text>
                                <View className="border border-gray-300 rounded-lg mb-4">
                                    <Picker
                                        selectedValue={form.usr_gender}
                                        onValueChange={val => handleChange('usr_gender', val)}
                                    >
                                        <Picker.Item label="-" value="" />
                                        <Picker.Item label="Laki-laki" value="male" />
                                        <Picker.Item label="Perempuan" value="female" />
                                    </Picker>
                                </View>

                                <View className="flex-row mt-6">
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="flex-1 mr-2 py-3 rounded-xl bg-gray-200 items-center"
                                    >
                                        <Text className="text-gray-800 font-semibold text-base">{i18n.t('cancel')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            if (validateForm()) {
                                                onSave(form);
                                            }
                                        }}
                                        disabled={!form.usr_nama || !form.usr_email || !form.usr_password}
                                        className={`flex-1 ml-2 py-3 rounded-xl items-center ${
                                            form.usr_nama && form.usr_email && form.usr_password
                                                ? 'bg-[#004080]'
                                                : 'bg-[#999]'
                                        }`}
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
