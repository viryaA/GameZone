import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import JenisPlaystationModal from './JenisPlaystationModal';
import i18n from '../locale/i18n';
import "../global.css";

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function JenisPlaystationHome() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/MsJenisPlaystation`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setFilteredData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsEdit(true);
        setModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setIsEdit(false);
        setModalVisible(true);
    };

    const handleSave = (item) => {
        const method = isEdit ? 'PUT' : 'POST';
        fetch(`${apiUrl}/MsJenisPlaystation`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
            .then(res => res.json())
            .then(resJson => {
                Alert.alert(
                    resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
                    resJson.message
                );
                setModalVisible(false);
                fetchData();
            })
            .catch(error => {
                console.error("Save error", error);
                Alert.alert(i18n.t("failed"), i18n.t("error_message"));
                setModalVisible(false);
            });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();
        const filtered = data.filter(item =>
            item.jps_nama.toLowerCase().includes(lowerQuery)
        );
        setFilteredData(filtered);
    };

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => handleEdit(item)}
            className="mb-4 p-5 rounded-2xl bg-green-100 shadow-md"
        >
            <Text className="text-lg font-semibold text-green-900">{item.jps_nama}</Text>
            <Text className="text-base mt-1">
                {i18n.t("max_player")}: <Text className="font-medium">{item.jps_max_pemain}</Text>
            </Text>
            <Text className="text-sm text-green-700 mt-2 italic">{i18n.t("tap_for_details")}</Text>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-white px-4 pt-6">
            {/* Floating Add Button */}
            <TouchableOpacity
                onPress={handleAdd}
                className="absolute bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full justify-center items-center"
                style={{ zIndex: 999, elevation: 10 }}
                accessibilityLabel={i18n.t("add_button")}
            >
                <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>

            {/* Search Input with Icon */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    placeholder={i18n.t("search_placeholder")}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    className="ml-2 flex-1 text-base text-gray-800"
                />
            </View>

            {/* Loading or List */}
            {loading ? (
                <View className="flex-1 justify-center items-center mt-10">
                    <ActivityIndicator size="large" color="green" />
                    <Text className="mt-4 text-gray-500">{i18n.t("loading")}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.jps_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            <JenisPlaystationModal
                visible={modalVisible}
                item={selectedItem}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
            />
        </View>
    );
}
