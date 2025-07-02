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
import UserModal from './components/UserModal';
import Toast from 'react-native-toast-message';
import i18n from '../../Locale/i18n';
import "../../global.css";
import SortSelector from './components/SortSelector';
import FilterSelector from "./components/FilterSelector";
import {COLOR_PRIMARY} from "../../Locale/constant";
import RoomCard from "./components/RoomCard";
import SearchSortFilterBar from "../../TemplateComponent/SearchSortFilterBar";


const apiUrl = Constants.expoConfig.extra.API_URL;

export default function RoomHome() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('ready');
    const [selectedRole, setSelectedRole] = useState('All');
    const [menuItem, setMenuItem] = useState(null);

    const fetchData = () => {
        setLoading(true);
        fetch(`${apiUrl}/MsRuangan`)
            .then(res => res.json())
            .then(json => {
                let initialData = Array.isArray(json)
                ? json
                : Array.isArray(json.data)
                ? json.data
                : null;
                
                // If not sorting by status, filter to only 'ready'
                if (sortBy !== 'rng_status') {
                    initialData = initialData.filter(item => item.rng_status === 'ready');
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
                    text2: i18n.t("errorMessage")
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

    const handleSave = async (item, file) => {
        const method = isEdit ? 'PUT' : 'POST';
        const formData = new FormData();

        formData.append('user', JSON.stringify(item)); // This matches @RequestPart("user")

        if (file) {
            formData.append('fotoProfile', {
                uri: file.uri,
                name: file.name || 'photo.jpg',
                type: file.type || 'image/jpeg'
            });
        }

        try {
            const res = await fetch(`${apiUrl}/MsUser`, {
                method,
                headers: {
                    // Do NOT set Content-Type; let fetch/React Native handle it automatically
                    // 'Content-Type': 'multipart/form-data' ← DON'T add this manually
                },
                body: formData
            });

            const resJson = await res.json();

            Toast.show({
                type: resJson.result === 1 ? 'success' : 'error',
                text1: resJson.result === 1 ? i18n.t("success") : i18n.t("failed"),
                text2: resJson.message
            });

            setModalVisible(false);
            fetchData();
        } catch (error) {
            console.error("Save error", error);
            Toast.show({
                type: 'error',
                text1: i18n.t("failed"),
                text2: i18n.t("errorMessage")
            });
            setModalVisible(false);
        }
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        fetch(`${apiUrl}/MsUser/${deleteItem.rng_id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: i18n.t("success"),
                    text2: i18n.t("deleteSuccess"),
                });
                fetchData();
            })
            .catch(() => {
                Toast.show({
                    type: 'error',
                    text1: i18n.t("failed"),
                    text2: i18n.t("errorMessage"),
                });
            })
            .finally(() => setDeleteItem(null));
    };

    const applyAll = (baseData, searchQuery, status, role, sortKey, sortOrder) => {
        let filtered = [...baseData];

        // Apply filter
        if (status !== 'All') {
            filtered = filtered.filter(item => item.rng_status === status);
        }
        if (role !== 'All') {
            filtered = filtered.filter(item => item.rng_kapasitas.toString() === role);
        }

        // Apply search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.rng_nama_ruangan.toLowerCase().includes(lowerQuery)
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
        applyAll(data, query, selectedStatus, selectedRole, sortBy, sortOrder);
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

    const applyFilterAndSearch = (items, status, role) => {
        let filtered = [...items];

        if (status !== 'All') {
            filtered = filtered.filter(item => item.rng_status === status);
        }

        if (role !== 'All') {
            filtered = filtered.filter(item => item.rng_kapasitas.toString() === role);
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.rng_nama_ruangan.toLowerCase().includes(lowerQuery)
            );
        }

        applySort(filtered, sortBy, sortOrder);

        setSelectedRole(role);
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
                selectedMaxPlayer={selectedRole}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortModalVisible={setSortModalVisible}
                setFilterModalVisible={setFilterModalVisible}
                searchPlaceHolder={i18n.t("usrSearchPlaceholder")}
            />

            <TouchableOpacity
                onPress={handleAdd}
                className={`absolute bottom-6 right-6 w-16 h-16 bg-[${COLOR_PRIMARY}] rounded-full justify-center items-center`}
                style={{ zIndex: 999, elevation: 10 }}
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
                        <Text className="mt-4 text-gray-500">{i18n.t("noData")}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={item => item.rng_id.toString()}
                        renderItem={({ item }) => (
                            <RoomCard
                                item={item}
                                menuItem={menuItem}
                                setMenuItem={setMenuItem}
                                setDeleteItem={setDeleteItem}
                                handleEdit={handleEdit}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />

                )}
            </View>

            <UserModal
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
                    if (key === 'rng_status') {
                        applySort(data, key, order); // show all
                    } else {
                        const aktifOnly = data.filter(item => item.rng_status === 'ready');
                        applySort(aktifOnly, key, order);
                    }
                }}
            />

            <FilterSelector
                visible={filterModalVisible}
                selectedStatus={selectedStatus}
                selectedRole={selectedRole}
                onApply={(status, role) => {
                    applyFilterAndSearch(data,status, role);
                }}
                onClose={() => setFilterModalVisible(false)}
            />

        </View>
    );
}
