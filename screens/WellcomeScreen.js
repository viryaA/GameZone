import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import "../global.css"

export default function WellcomeScreen({ navigation }) {
    const checkFirstLaunch = async () => {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched')
        if (hasLaunched) {
            // Skip welcome and go to Settings
            navigation.replace('SettingsStack')
        } else {
            await AsyncStorage.setItem('hasLaunched', 'true')
        }
    }

    return (
        <ImageBackground
            source={require('../assets/wellcome-background.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/50 pt-10 px-4 relative">
                <Text style={styles.topTagline}>
                    Increase your gaming{'\n'}experience🔥
                </Text>

                <Text style={styles.tagline}>
                    Cozy Corner{'\n'}for Hardcore{'\n'}Gamers.
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        checkFirstLaunch();
                        navigation.replace('SettingsStack')
                    }}
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
                    className="w-[90px] h-[65px] absolute bottom-20 left-10"
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
        paddingHorizontal: 24, // increased from 16
        paddingVertical: 12,   // increased from 8
        borderRadius: 9999,
        gap: 12, // more spacing between text and icon
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16, // increased from 14
    },
    arrowCircle: {
        backgroundColor: '#FB3D81',
        padding: 8, // slightly increased
        borderRadius: 9999,
    },
    tagline: {
        position: 'absolute',
        bottom: 180, // increase as needed to push above the button
        left: 110,
        color: 'white',
        fontSize: 35,
        fontWeight: '700',
    },
    topTagline: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        color: 'white',
        fontSize: 18,
        // fontWeight: '600',
        lineHeight: 26,
        textAlign: 'center',
        letterSpacing: 2,
    },

})
