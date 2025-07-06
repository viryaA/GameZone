import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Pressable,
    ScrollView,
    Animated,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const apiUrl = Constants.expoConfig.extra.API_URL;

export default function BookingModalConfirm({ visible, onClose, data, onConfirm }) {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const translateY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy >= 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    // Slide down and close
                    Animated.timing(translateY, {
                        toValue: height,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        translateY.setValue(0); // reset for next time
                        onClose();
                    });
                } else {
                    // Slide back to position
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleConfirmCheckIn = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/TrBooking/updateStatusByQr`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bok_qr_code: data.bok_qr_code,
                    bok_status: 'Sudah Check-in',
                }),
            });
            const result = await response.json();
            if (result.success || result.result) {
                Toast.show({
                    type: 'success',
                    text1: 'Check-in Successful',
                    text2: 'Customer has been checked in successfully',
                });
                if (onConfirm) onConfirm(result.data);
                onClose();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Check-in Failed',
                    text2: result.message || 'Failed to check in customer',
                });
            }
        } catch (error) {
            console.error('Check-in error:', error);
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: 'Please check your connection and try again',
            });
        } finally {
            setLoading(false);
            onClose();
            navigation.navigate('Home');
        }
    };

    if (!visible) return null;

    return (
        <View className="absolute inset-0 z-50 justify-end">
            {/* Backdrop */}
            <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

            {/* Modal content with animation */}
            <Animated.View
                className="max-h-[85%] rounded-t-2xl overflow-hidden"
                style={{
                    transform: [{ translateY }],
                }}
                {...panResponder.panHandlers}
            >
                <LinearGradient
                    colors={['#742FEA', '#40128B']}
                    className="p-5 pb-10"
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Drag Handle */}
                        <View className="w-full items-center mb-4">
                            <View className="w-20 h-1.5 bg-white rounded-full" />
                        </View>

                        {/* Room Title */}
                        <Text className="text-white text-center text-xl font-bold mb-5">Room VIP 1</Text>

                        {/* Customer Info */}
                        <View className="bg-purple-700/60 rounded-xl p-4 mb-3">
                            <Text className="text-white font-semibold text-sm mb-1">Customer Info</Text>
                            <Text className="text-white text-base">{data.user?.usr_nama} - {data.user?.usr_email}</Text>
                        </View>

                        {/* Play Date & Time */}
                        <View className="bg-purple-700/60 rounded-xl p-4 mb-3">
                            <Text className="text-white font-semibold text-sm mb-2">Play Date & Time</Text>
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white text-base">
                                        {new Date(data.bok_waktu_mulai).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            weekday: 'short',
                                        })}
                                    </Text>
                                    <Text className="text-yellow-300 text-sm">{formatTime(data.bok_waktu_mulai)}</Text>
                                </View>
                                <Text className="text-white text-xl">→</Text>
                                <View>
                                    <Text className="text-white text-base">
                                        {new Date(data.bok_waktu_selesai).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            weekday: 'short',
                                        })}
                                    </Text>
                                    <Text className="text-yellow-300 text-sm">{formatTime(data.bok_waktu_selesai)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Total Amount */}
                        <View className="bg-purple-700/60 rounded-xl p-4 mb-5">
                            <Text className="text-white font-semibold text-sm mb-2">Total Amount</Text>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white text-base">
                                    Rp {data.ruangan?.rng_harga_per_jam} × {data.bok_durasi_jam} hours
                                </Text>
                                <Text className="text-white text-lg font-bold">Rp {data.bok_total_biaya}</Text>
                            </View>
                        </View>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            className="bg-pink-400 rounded-full py-3"
                            onPress={handleConfirmCheckIn}
                            disabled={loading}
                        >
                            <View className="flex-row justify-center items-center">
                                {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
                                <Text className="text-white text-center font-bold text-base">
                                    {loading ? 'Processing...' : 'Confirm To Check In'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </Animated.View>
        </View>
    );
}

function formatTime(datetimeStr) {
    if (!datetimeStr) return 'No time';
    const timePart = datetimeStr.split('T')[1]?.substring(0, 5); // HH:mm
    if (!timePart) return 'Invalid time';
    const [hourStr, minute] = timePart.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute} ${ampm}`;
}
