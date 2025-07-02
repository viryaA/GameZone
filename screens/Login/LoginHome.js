import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL;
import Toast from 'react-native-toast-message';

export default function LoginHome() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Input required',
                text2: 'Please enter both email and password.',
            });
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/MsUser/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usr_email: email,
                    usr_password: password,
                }),
            });

            const result = await response.json();

            if (result.result === 1) {
                Toast.show({
                    type: 'success',
                    text1: 'Login berhasil!',
                    text2: `Selamat datang, ${result.data.usr_nama || 'user'}!`,
                });

                // navigation.navigate("HomeMain")
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login gagal',
                    text2: result.message || 'Email/password salah.',
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Server error',
                text2: 'Terjadi kesalahan saat login.',
            });
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/default-background.png')}
            className="flex-1"
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Top image */}
                <Image
                    source={require('../../assets/login-top-image.png')}
                    className="w-full h-64"
                    resizeMode="cover"
                />

                {/* Bottom section */}
                <View className="bg-[#3B057A] px-6 pt-4 pb-2 rounded-t-3xl mt-2">
                    {/* Centered Image */}
                    <Image
                        source={require('../../assets/icon-brand.png')}
                        className="w-[200px] h-[120px] self-center"
                        resizeMode="contain"
                    />

                    {/* Title */}
                    <Text className="text-center text-white mt-2">
                        Your Second Home{'\n'}With a Better Setup.
                    </Text>

                    <Text className="text-white underline text-sm mb-2">Log in to your account</Text>

                    {/* Email */}
                    <Text className="text-white text-sm mb-1">Email</Text>
                    <TextInput
                        placeholder="exsapel@gmail.com"
                        placeholderTextColor="#ccc"
                        className="bg-[#5829AB] rounded-md px-4 py-3 text-white mb-4"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password */}
                    <Text className="text-white text-sm mb-1">Password</Text>
                    <View className="flex-row items-center bg-[#5829AB] rounded-md px-4 py-3 mb-4">
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#ccc"
                            className="flex-1 text-white"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Button */}
                    <LinearGradient
                        colors={['#253B80', '#6D3ECB']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="rounded-full mb-4"
                    >
                        <TouchableOpacity className="py-3" activeOpacity={0.8} onPress={handleLogin}>
                            <Text className="text-center text-white font-bold text-lg">Log In</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <Text className="text-center text-white text-sm">
                        Don’t have account? <Text className="underline">Create now</Text>
                    </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}
