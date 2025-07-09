import React from 'react';
import { View } from 'react-native';
import UserBottomBar from './PelangganBottomBar';

export default function ScreenPelangganWithBottomBar({ children }) {
    return (
        <View className="flex-1">
            <View className="flex-1">{children}</View>
            <UserBottomBar />
        </View>
    );
}
