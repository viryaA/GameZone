import React from 'react';
import { View } from 'react-native';
import DefaultBottomBar from './DefaultBottomBar';

export default function ScreenWithBottomBar({ children }) {
    return (
        <View className="flex-1">
            <View className="flex-1">{children}</View>
            <DefaultBottomBar />
        </View>
    );
}
