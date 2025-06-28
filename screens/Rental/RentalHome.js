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
import RentalModal from './components/RentalModal';
import Toast from 'react-native-toast-message';
import i18n from '../../locale/i18n';
import "../../global.css";
import SortSelector from './components/SortSelector';
import FilterSelector from "./components/FilterSelector";
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../locale/constant';


const apiUrl = Constants.expoConfig.extra.API_URL;

export default function RentalHome() {
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
    const [selectedStatus, setSelectedStatus] = useState('Aktif');
    const [selectedMaxPlayer, setSelectedMaxPlayer] = useState('All');
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [menuItem, setMenuItem] = useState(null);

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/MsRental`)
            .then(res => res.json())
            .then(json => {
                let initialData = Array.isArray(json)
                ? json
                : Array.isArray(json.data)
                ? json.data
                : [];
                console.log("API RESPONSE", initialData);

                // If not sorting by status, filter to only 'Aktif'
                if (sortBy !== 'rtl_status') {
                    initialData = initialData.filter(item => item.rtl_status === 'Aktif');
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
        fetch(`${apiUrl}/MsRental`, {
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
        fetch(`${apiUrl}/MsRental/${deleteItem.rtl_id}`, { method: 'DELETE' })
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

    const applyAll = (baseData, searchQuery, status, address, sortKey, sortOrder) => {
        let filtered = [...baseData];

        // Apply filter
        if (status !== 'All') {
            filtered = filtered.filter(item => item.rtl_status === status);
        }
        if (address !== 'All') {
            filtered = filtered.filter(item => item.rtl_alamat.toString() === address);
        }

        // Apply search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.rtl_nama.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply sort
        if (sortKey) {
            filtered.sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];

                if (typeof aVal === 'number') {
                    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        }

        setFilteredData(filtered);
    };


    const handleSearch = (query) => {
        setSearchQuery(query);
        applyAll(data, query, selectedStatus, selectedMaxPlayer, sortBy, sortOrder);
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

    const applyFilterAndSearch = (items,status, address) => {
        let filtered = [...items];

        if (status !== 'All') {
            filtered = filtered.filter(item => item.rtl_status === status);
        }

        if (address !== 'All') {
            filtered = filtered.filter(item => item.rtl_alamat.toString() === address);
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.rtl_nama.toLowerCase().includes(lowerQuery)
            );
        }

        applySort(filtered, sortBy, sortOrder);

        setSelectedMaxPlayer(address);
        setSelectedStatus(status);
    };


    const renderItem = ({ item }) => (
        <View className="mb-4 rounded-2xl overflow-hidden shadow-lg bg-[#f1f5f9]">

            {/* Header - Nama Rental */}
            <View className={`bg-[${COLOR_PRIMARY}] px-4 py-3 flex-row items-center justify-between`}>
            <View className="flex-row items-center">
                <Ionicons name="game-controller-outline" size={18} color="#f6a12c" />
                <Text className="ml-2 text-white font-poppins font-semibold">
                {item.rtl_nama}
                </Text>
            </View>

            <TouchableOpacity onPress={() => setMenuItem(item)}>
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
            </View>

            {/* Konten Utama */}
            <Pressable
            onPress={() => {
                if (item.rtl_status === 'Aktif') {
                handleEdit(item);
                }
            }}
            className="bg-white px-4 py-4"
            >
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray font-poppins text-sm">{item.rtl_alamat}</Text>
                <Text
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.rtl_status === 'Aktif'
                    ? 'bg-green-200 text-green-800 font-poppins'
                    : 'bg-red-200 text-red-800'
                }`}
                >
                {item.rtl_status}
                </Text>
            </View>

            {item.jps_status === 'Aktif' && (
                <Text className="text-xs italic text-[#f6a12c] mt-2 font-poppins">
                {i18n.t("tap_for_details")}
                </Text>
            )}
            </Pressable>

            {/* Popup Modal */}
            {menuItem?.rtl_id === item.rtl_id && (
            <Modal
                transparent
                animationType="fade"
                visible={true}
                onRequestClose={() => setMenuItem(null)}
            >
                <TouchableOpacity
                className="flex-1 justify-center items-center bg-black/40"
                activeOpacity={1}
                onPressOut={() => setMenuItem(null)}
                >
                <View className="bg-white rounded-lg w-64 p-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3 font-poppins">Opsi</Text>
                    <TouchableOpacity
                    className="py-2"
                    onPress={() => {
                        setMenuItem(null);
                        handleEdit(item);
                    }}
                    >
                    <Text className="text-blue-600 font-poppins">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    className="py-2"
                    onPress={() => {
                        setMenuItem(null);
                        setDeleteItem(item);
                    }}
                    >
                    <Text className="text-red-600 font-poppins">Hapus</Text>
                    </TouchableOpacity>
                </View>
                </TouchableOpacity>
            </Modal>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray">
            <StatusBar style="light" />
            {/* HEADER */}
            <View
            className="flex-row justify-between items-center px-4 pt-10 pb-2"
            style={{
                backgroundColor: COLOR_PRIMARY,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
            }}
            >
                {/* Kiri: tombol menu */}
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Ionicons name="menu-outline" size={24} color="white" />
                </TouchableOpacity>

                {/* Tengah: jika search aktif, tampilkan input */}
                {isSearchVisible ? (
                    <View className="flex-1 flex-row items-center bg-white px-3 mx-5 rounded-full">
                    <Ionicons name="search-outline" size={18} color="gray" />
                    <TextInput
                        className="ml-2 flex-1 text-sm text-gray-800"
                        placeholder="Cari Rental..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                        onPress={() => {
                            setSearchQuery(""); // Kosongkan input
                            applyAll(data, "", selectedStatus, selectedMaxPlayer, sortBy, sortOrder); // Reset hasil pencarian
                        }}
                        >
                            <Ionicons name="close-circle" size={18} color="gray" />
                        </TouchableOpacity>
                    )}
                    </View>
                ) : (
                    <Text className="text-lg text-white font-poppins">Rental</Text>
                )}
                {/* Kanan: search button */}
                <View className="flex-row gap-4 items-center">
                    <TouchableOpacity onPress={() => setSearchVisible(prev => !prev)}>
                    <Ionicons name={isSearchVisible ? "close-outline" : "search-outline"} size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row justify-end gap-2 mb-4 pt-4 px-4">
                {/* Tombol Search */}
                <View className="flex-1 flex-row items-center bg-white px-3 rounded-lg border border-gray">
                    <Ionicons name="search-outline" size={18} color="gray" />
                    <TextInput
                        className="ml-2 flex-1 text-sm text-gray-800"
                        placeholder="Cari Rental..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                        onPress={() => {
                            setSearchQuery(""); // Kosongkan input
                            applyAll(data, "", selectedStatus, selectedMaxPlayer, sortBy, sortOrder); // Reset hasil pencarian
                        }}
                        >
                            <Ionicons name="close-circle" size={18} color="gray" />
                        </TouchableOpacity>
                    )}
                    </View>

                {/* Tombol Sort */}
                <TouchableOpacity
                    onPress={() => setSortModalVisible(true)}
                    className={`flex-row items-center px-4 py-2 rounded-lg bg-[${COLOR_PRIMARY}]`}
                >
                    <Ionicons name="swap-vertical-outline" size={18} color="white" />
                    {/* <Text className="text-white font-medium ml-2">{i18n.t('sort_by')}</Text> */}
                </TouchableOpacity>

                {/* Tombol Filter */}
                <TouchableOpacity
                    onPress={() => setFilterModalVisible(true)}
                    className={`flex-row items-center px-4 py-2 rounded-lg bg-[${COLOR_PRIMARY}]`}
                >
                    <Ionicons name="funnel-outline" size={18} color="white" />
                    {/* <Text className="text-white font-medium ml-2">{i18n.t('filter')}</Text> */}
                </TouchableOpacity>
            </View>
            
            <View className="h-[1px] bg-black mx-4 mb-2" />

            <TouchableOpacity
                onPress={handleAdd}
                className={`absolute bottom-6 right-6 w-16 h-16 bg-[${COLOR_PRIMARY}] rounded-full justify-center items-center`}
                style={{ zIndex: 999, elevation: 10 }}
                accessibilityLabel={i18n.t("add_button")}
            >
                <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>

            <View className="px-4">
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
                        keyExtractor={item => item.rtl_id.toString()}
                        renderItem={renderItem}
                        style={{fontFamily: 'Poppins-Regular'}}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />

                )}
            </View>

            <RentalModal
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
                    if (key === 'rtl_status') {
                        applySort(data, key, order); // show all
                    } else {
                        const aktifOnly = data.filter(item => item.rtl_status === 'Aktif');
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
