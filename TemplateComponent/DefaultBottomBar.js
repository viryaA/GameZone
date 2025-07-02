import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function DefaultBottomBar() {
    const navigation = useNavigation();
    const route = useRoute();

    const tabs = [
        { name: 'Home', icon: 'home' },
        { name: 'Bag', icon: 'shopping-bag' },
        { name: 'Profile', icon: 'user' },
    ];

    return (
        <View className="bg-purple-900 pt-2 pb-6 px-6 border-t border-purple-800">
            <View className="flex-row justify-between items-center">
                {tabs.map(({ name, icon }) => {
                    const isFocused = route.name === name;

                    return (
                        <TouchableOpacity
                            key={name}
                            onPress={() => navigation.navigate(name)}
                            className="flex-1 items-center"
                        >
                            {isFocused ? (
                                <View className="flex-row items-center bg-purple-700 px-4 py-2 rounded-full">
                                    <Icon name={icon} size={18} color="#fff" />
                                    <Text className="ml-2 text-white text-base">{name}</Text>
                                </View>
                            ) : (
                                <Icon name={icon} size={22} color="#fff" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
