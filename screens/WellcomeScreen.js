import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import "../global.css"

export default function WellcomeScreen({ navigation }) {
    useEffect(() => {
        const checkFirstLaunch = async () => {
            const hasLaunched = await AsyncStorage.getItem('hasLaunched')
            if (hasLaunched) {
                // Skip welcome and go to Settings
                navigation.replace('SettingsStack')
            } else {
                await AsyncStorage.setItem('hasLaunched', 'true')
            }
        }
        checkFirstLaunch()
    }, [])

    return (
        <ImageBackground
            source={require('../assets/wellcome-background.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/50 pt-10 px-4 relative">
                <TouchableOpacity
                    onPress={() => navigation.replace('SettingsStack')}
                    style={styles.buttonWrapper}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#661BEA', '#411786']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Start Gaming</Text>
                        <View style={styles.arrowCircle}>
                            <Ionicons name="arrow-forward" size={14} color="white" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <Image
                    source={require('../assets/arrow.png')}
                    className="w-[144px] h-[111px] absolute bottom-5 left-5"
                />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: {
        position: 'absolute',
        bottom: 96,
        right: 20,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    arrowCircle: {
        backgroundColor: '#FB3D81', // your requested color
        padding: 6,
        borderRadius: 9999,
    },
})
