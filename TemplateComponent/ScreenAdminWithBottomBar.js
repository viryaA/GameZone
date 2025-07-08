import React from 'react';
import { View } from 'react-native';
import AdminBottomBar from './AdminBottomBar';

export default function ScreenAdminWithBottomBar({ children }) {
    return (
        <View className="flex-1">
            <View className="flex-1">{children}</View>
            <AdminBottomBar />
        </View>
    );
}
