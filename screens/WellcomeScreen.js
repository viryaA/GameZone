import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { styled } from 'nativewind'
import "../global.css"

const StyledLinearGradient = styled(LinearGradient)

export default function WellcomeScreen({ navigation }) {
    return (
        <ImageBackground
            source={require('../assets/wellcome-background.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/50 pt-10 px-4 relative">

                {/* Gradient Button */}
                <TouchableOpacity
                    onPress={() => console.log('Start Gaming')}
                    className="absolute bottom-24 right-5"
                    activeOpacity={0.8}
                >
                    <StyledLinearGradient
                        colors={['#661BEA', '#411786']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="px-6 py-3 rounded-full flex-row items-center space-x-3"
                    >
                        <Text className="text-white font-semibold">Start Gaming</Text>
                        <View className="bg-black rounded-full p-2">
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </View>
                    </StyledLinearGradient>
                </TouchableOpacity>

                {/* Arrow Image in Bottom-Left */}
                <Image
                    source={require('../assets/arrow.png')}
                    className="w-[144px] h-[111px] absolute bottom-5 left-5"
                />
            </View>
        </ImageBackground>
    )
}
