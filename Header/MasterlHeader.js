import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_PRIMARY } from '../Locale/constant';
import "../global.css";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

export default function MasterlHeader({ navigation, route, options }) {
    const title = options.title || route.name;
    const isProfile = route.name === 'Profile';

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };
    return (
        <View
            className="pt-10 px-4 pb-3 flex-row items-center justify-between rounded-b-3xl"
            style={{ backgroundColor: COLOR_PRIMARY }}
        >
            {/* Left: menu button */}
            <TouchableOpacity className="w-8 items-center" onPress={() => navigation.toggleDrawer()}>
                <Ionicons name="menu-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Center: title */}
            <Text className=" text-center text-white text-base font-poppins-bold">
                {title}
            </Text>

            {/* Right: profile icon or placeholder */}
            {!isProfile ? (
                <TouchableOpacity
                    className="w-8 items-center"
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons name="person-circle-outline" size={26} color="white" />
                </TouchableOpacity>
            ) : (
                <View className="w-8" />
            )}
        </View>
    );
}
