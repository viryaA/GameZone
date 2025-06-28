import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import RentalModal from './components/RentalModal';
import Toast from 'react-native-toast-message';
import i18n from '../../Locale/i18n';
import "../../global.css";
import SortSelector from './components/SortSelector';
import FilterSelector from "./components/FilterSelector";
import { COLOR_PRIMARY } from '../../Locale/constant';
import RentalCard from './components/RentalCard';
import SearchSortFilterBar from "../../TemplateComponent/SearchSortFilterBar";

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

    return (
        <View className="flex-1 bg-gray">

            <SearchSortFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                applyAll={applyAll}
                data={data}
                selectedStatus={selectedStatus}
                selectedMaxPlayer={selectedMaxPlayer}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortModalVisible={setSortModalVisible}
                setFilterModalVisible={setFilterModalVisible}
                searchPlaceHolder={i18n.t("search_placeholder_rtl")}
            />

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
                        renderItem={({ item }) => (
                            <RentalCard
                                item={item}
                                menuItem={menuItem}
                                setMenuItem={setMenuItem}
                                setDeleteItem={setDeleteItem}
                                handleEdit={handleEdit}
                                COLOR_PRIMARY={COLOR_PRIMARY}
                                i18n={i18n}
                            />
                        )}
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
