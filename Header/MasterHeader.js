import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_PRIMARY } from '../Locale/constant';
import "../global.css";
import { StatusBar } from 'expo-status-bar';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

export default function MasterHeader({ navigation, route, options }) {
    const title = options.title || route.name;
    const isProfile = route.name === 'Profile';
    const isDetailPage = title.includes('Detail');

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };
    
    return (
        isDetailPage ? (
            <View
                className="pt-14 px-4 pb-10 flex-row items-center justify-between"
            >
                <StatusBar style="dark" />
                <TouchableOpacity className="w-8 items-center" onPress={() => navigation.navigate("RentalMain")}>
                    <Ionicons name="arrow-back-outline" size={24} color={COLOR_PRIMARY} />
                </TouchableOpacity>

                {/* Center: title */}
                <Text className="text-center text-base font-poppins-bold text-lg" style={{color: COLOR_PRIMARY}}>
                    {title}
                </Text>

                {/* Right: profile icon or placeholder */}
                {!isProfile ? (
                    <TouchableOpacity
                        className="w-8 items-center"
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="share-social-outline" size={26} color={COLOR_PRIMARY} />
                    </TouchableOpacity>
                ) : (
                    <View className="w-8" />
                )}
            </View>
        ) : (
            <View
                className="pt-10 rounded-b-3xl px-4 pb-3 flex-row items-center justify-between"
                style={{ backgroundColor: COLOR_PRIMARY }}
            >
                {/* Left: menu button */}
                <TouchableOpacity className="w-8 items-center" onPress={() => navigation.toggleDrawer()}>
                    <Ionicons name="menu-outline" size={24} color="white" />
                </TouchableOpacity>

                {/* Center: title */}
                <Text className="text-center text-white text-base font-poppins-bold text-lg">
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
        )
    );
}
