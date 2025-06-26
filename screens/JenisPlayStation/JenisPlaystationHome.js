import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Pressable,
    TextInput,
    Modal,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import JenisPlaystationModal from './components/JenisPlaystationModal';
import Toast from 'react-native-toast-message';
import i18n from '../../locale/i18n';
import "../../global.css";
import SortSelector from './components/SortSelector';
import FilterSelector from "./components/FilterSelector";


const apiUrl = Constants.expoConfig.extra.API_URL;

export default function JenisPlaystationHome() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState(null);
    const [sortBy, setSortBy] = useState(null); // e.g. 'jps_nama'
    const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedMaxPlayer, setSelectedMaxPlayer] = useState('All');


    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/MsJenisPlaystation`)
            .then(res => res.json())
            .then(json => {
                let initialData = json;

                // If not sorting by status, filter to only 'Aktif'
                if (sortBy !== 'jps_status') {
                    initialData = initialData.filter(item => item.jps_status === 'Aktif');
                }

                setData(json);
                applySort(initialData, sortBy, sortOrder);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Toast.show({
                    type: 'error',
                    text1: i18n.t("failed"),
                    text2: i18n.t("error_message")
                });
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
                Toast.show({
                    type: resJson.result === 1 ? 'success' : 'error',
                    text1: resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
                    text2: resJson.message
                });
                setModalVisible(false);
                fetchData();
            })
            .catch(error => {
                console.error("Save error", error);
                Toast.show({
                    type: 'error',
                    text1: i18n.t("failed"),
                    text2: i18n.t("error_message")
                });
                setModalVisible(false);
            });
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        fetch(`${apiUrl}/MsJenisPlaystation/${deleteItem.jps_id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: i18n.t("success"),
                    text2: i18n.t("delete_success"),
                });
                fetchData();
            })
            .catch(() => {
                Toast.show({
                    type: 'error',
                    text1: i18n.t("failed"),
                    text2: i18n.t("error_message"),
                });
            })
            .finally(() => setDeleteItem(null));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();
        const filtered = data.filter(item =>
            item.jps_nama.toLowerCase().includes(lowerQuery)
        );
        applySort(filtered, sortBy, sortOrder);
    };

    const applySort = (items, key, order) => {
        if (!key) {
            setFilteredData(items);
            return;
        }

        const sorted = [...items].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            if (typeof aVal === 'number') {
                return order === 'asc' ? aVal - bVal : bVal - aVal;
            }

            return order === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });

        setFilteredData(sorted);
    };

    const applyFilterAndSearch = (items,status,maxPlayer) => {
        let filtered = [...items];

        if (status !== 'All') {
            filtered = filtered.filter(item => item.jps_status === status);
        }

        if (maxPlayer !== 'All') {
            filtered = filtered.filter(item => item.jps_max_pemain.toString() === maxPlayer);
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.jps_nama.toLowerCase().includes(lowerQuery)
            );
        }

        applySort(filtered, sortBy, sortOrder);

        setSelectedMaxPlayer(maxPlayer);
        setSelectedStatus(status);
    };


    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => {
                if (item.jps_status === 'Aktif') {
                    handleEdit(item);
                }
            }}
            className="mb-6 p-6 rounded-2xl bg-green-100 shadow-xl relative"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
            }}
        >
            {/* Delete Button */}
            {item.jps_status === 'Aktif' && (
                <TouchableOpacity
                    onPress={() => setDeleteItem(item)}
                    className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-white shadow"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                >
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            )}

            {/* Title + Status */}
            <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-green-900">{item.jps_nama}</Text>
                <View
                    className={`px-3 py-1 rounded-full ${
                        item.jps_status === 'Aktif' ? 'bg-green-200' : 'bg-red-200'
                    }`}
                >
                    <Text
                        className={`text-xs font-semibold ${
                            item.jps_status === 'Aktif' ? 'text-green-800' : 'text-red-800'
                        }`}
                    >
                        {item.jps_status}
                    </Text>
                </View>
            </View>

            {/* Max Player */}
            <Text className="text-base mt-2">
                {i18n.t("max_player")}: <Text className="font-medium">{item.jps_max_pemain}</Text>
            </Text>

            {/* Hint */}
            <Text className="text-sm text-green-700 mt-3 italic">{i18n.t("tap_for_details")}</Text>
        </Pressable>
    );


    return (
        <View className="flex-1 bg-white px-4 pt-4">
            <TouchableOpacity
                onPress={handleAdd}
                className="absolute bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full justify-center items-center"
                style={{ zIndex: 999, elevation: 10 }}
                accessibilityLabel={i18n.t("add_button")}
            >
                <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>

            <View className="flex-row items-center border border-gray-300 rounded-xl px-2 py-1 mb-4 bg-white">
                <Ionicons name="search" size={18} color="gray" />
                <TextInput
                    placeholder={i18n.t("search_placeholder")}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    className="ml-2 flex-1 text-base text-gray-800 p-0"
                />
            </View>

            <TouchableOpacity
                onPress={() => setSortModalVisible(true)}
                className="self-end mb-2 px-4 py-1 rounded-full bg-green-600"
            >
                <Text className="text-white font-medium">{i18n.t('sort_by')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
                className="self-end mb-2 px-4 py-1 rounded-full bg-blue-600"
            >
                <Text className="text-white font-medium">{i18n.t('filter')}</Text>
            </TouchableOpacity>


            {loading ? (
                <View className="flex-1 justify-center items-center mt-10">
                    <ActivityIndicator size="large" color="green" />
                    <Text className="mt-4 text-gray-500">{i18n.t("loading")}</Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-10">
                    <Ionicons name="sad-outline" size={40} color="gray" />
                    <Text className="mt-4 text-gray-500">{i18n.t("no_data")}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.jps_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />

            )}

            <JenisPlaystationModal
                visible={modalVisible}
                item={selectedItem}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
                deleteItem={deleteItem}
                onDeleteCancel={() => setDeleteItem(null)}
                onDeleteConfirm={confirmDelete}
            />

            <SortSelector
                visible={sortModalVisible}
                onClose={() => setSortModalVisible(false)}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(key, order) => {
                    setSortBy(key);
                    setSortOrder(order);
                    if (key === 'jps_status') {
                        applySort(data, key, order); // show all
                    } else {
                        const aktifOnly = data.filter(item => item.jps_status === 'Aktif');
                        applySort(aktifOnly, key, order);
                    }
                }}
            />

            <FilterSelector
                visible={filterModalVisible}
                selectedStatus={selectedStatus}
                selectedMaxPlayer={selectedMaxPlayer}
                onApply={(status, maxPlayer) => {
                    applyFilterAndSearch(data,status, maxPlayer);
                }}
                onClose={() => setFilterModalVisible(false)}
            />


        </View>
    );
}
