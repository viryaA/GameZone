import React from 'react';
import { View } from 'react-native';
import UserBottomBar from './UserBottomBar';

export default function ScreenUserWithBottomBar({ children }) {
    return (
        <View className="flex-1">
            <View className="flex-1">{children}</View>
            <UserBottomBar />
        </View>
    );
}
