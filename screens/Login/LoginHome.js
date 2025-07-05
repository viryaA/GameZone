import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function LoginHome() {
    const navigation = useNavigation();
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
                // Arahkan ke halaman utama kalau login sukses
                // navigation.navigate('Home'); // contoh
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login gagal',
                    text2: 'Email/password salah.',
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
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image
                            source={require('../../assets/login-top-image.png')}
                            style={styles.topImage}
                            resizeMode="cover"
                        />

                        <LinearGradient
                            colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1.5 }}
                            style={styles.card}
                        >
                            <Image
                                source={require('../../assets/gamezone.png')}
                                style={styles.logo}
                            />

                            <Text style={styles.slogan}>
                                Your Second Home{'\n'}With a Better Setup.
                            </Text>

                            <Text style={styles.loginTitle}>
                                Log in to your account
                            </Text>

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                placeholder="example@gmail.com"
                                placeholderTextColor="white"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                fontSize={12}
                            />

                            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="white"
                                    secureTextEntry={!showPassword}
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    fontSize={12}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye' : 'eye-off'}
                                        size={22}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>

                            <LinearGradient
                                colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.buttonGradient}
                            >
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                    style={styles.buttonTouchable}
                                >
                                    <Text style={styles.buttonText}>Log In</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                            <Text style={styles.footerText}>
                                Don’t have account?{' '}
                                <Text
                                    style={styles.footerLink}
                                    onPress={() => navigation.navigate('CreateAccount')}
                                >
                                    Create now
                                </Text>
                            </Text>
                        </LinearGradient>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    topImage: {
        width: '100%',
        height: 256,
    },
    card: {
        marginTop: -55,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        flex: 1,
    },
    logo: {
        resizeMode: 'contain',
        marginBottom: 12,
        marginTop: 15,
        alignSelf: 'center',
    },
    slogan: {
        letterSpacing: 3,
        textAlign: 'center',
        color: 'white',
        marginBottom: 16,
        marginTop: 4,
        fontFamily: 'Poppins',
        lineHeight: 28,
        fontSize: 14,
    },
    loginTitle: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginBottom: 8,
        marginTop: 20,
        fontFamily: 'Poppins',
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        marginTop: 12,
    },
    input: {
        backgroundColor: 'rgba(88,41,171,1)',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'white',
        marginTop: 8,
        fontFamily: 'Poppins',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(88,41,171,1)',
        borderRadius: 6,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        color: 'white',
        fontFamily: 'Poppins',
    },
    buttonGradient: {
        borderRadius: 999,
        width: 350,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 40,
        alignSelf: 'center',
    },
    buttonTouchable: {
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    footerText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins',
    },
    footerLink: {
        textDecorationLine: 'underline',
    },
});
