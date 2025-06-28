import {TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLOR_PRIMARY} from "../Locale/constant";

const SearchSortFilterBar = ({
                                 searchQuery,
                                 setSearchQuery,
                                 handleSearch,
                                 applyAll,
                                 data,
                                 selectedStatus,
                                 selectedMaxPlayer,
                                 sortBy,
                                 sortOrder,
                                 setSortModalVisible,
                                 setFilterModalVisible,
                                 searchPlaceHolder,
                             }) => {
    return (
        <>
            <View className="flex-row justify-end gap-2 mb-4 pt-4 px-4">
                {/* Tombol Search */}
                <View className="flex-1 flex-row items-center bg-white px-3 rounded-lg border border-gray">
                    <Ionicons name="search-outline" size={18} color="gray" />
                    <TextInput
                        className="ml-2 flex-1 text-sm text-gray-800"
                        placeholder={searchPlaceHolder}
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
        </>
    );
};

export default SearchSortFilterBar;