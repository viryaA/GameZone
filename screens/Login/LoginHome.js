import {
    View, Text, TextInput, TouchableOpacity, ImageBackground,
    Image, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../Konteks/UserContext';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function LoginHome() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const checkSession = async () => {
            const rawData = await AsyncStorage.getItem('userData');
            const loginTime = await AsyncStorage.getItem('loginTime');
            const userData = rawData && JSON.parse(rawData);
            if (userData && loginTime) {
                const diffDays = (new Date() - new Date(loginTime)) / (1000 * 60 * 60 * 24);
                if (diffDays < 0) {
                    navigation.navigate(userData?.usr_role);
                } else {
                    await AsyncStorage.multiRemove(['userData', 'loginTime']);
                }
            }
        };
        checkSession();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            return Toast.show({
                type: 'error',
                text1: 'Input required',
                text2: 'Please enter both email and password.',
            });
        }

        try {
            const response = await fetch(`${apiUrl}/MsUser/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usr_email: email, usr_password: password }),
            });

            const result = await response.json();
            if (result.result === 1) {
                await AsyncStorage.setItem('userData', JSON.stringify(result.data));
                await AsyncStorage.setItem('loginTime', new Date().toISOString());
                setUser(result.data);

                Toast.show({
                    type: 'success',
                    text1: 'Login berhasil!',
                    text2: `Selamat datang, ${result.data.usr_nama || 'user'}!`,
                });

                navigation.navigate(result.data.usr_role);
            } else {
                Toast.show({ type: 'error', text1: 'Login gagal', text2: 'Email/password salah.' });
            }
        } catch (err) {
            console.error('Login error:', err);
            Toast.show({ type: 'error', text1: 'Server error', text2: 'Terjadi kesalahan saat login.' });
        }
    };

    return (
        <ImageBackground source={require('../../assets/default-background.png')} style={styles.background}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                        <Image source={require('../../assets/login-top-image.png')} style={styles.topImage} />
                        <LinearGradient colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']} style={styles.card}>
                            <Image source={require('../../assets/gamezone.png')} style={styles.logo} />
                            <Text style={styles.slogan}>Your Second Home{'\n'}With a Better Setup.</Text>
                            <Text style={styles.loginTitle}>Log in to your account</Text>

                            <InputLabel label="Email" />
                            <TextInput
                                placeholder="example@gmail.com"
                                placeholderTextColor="white"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                            />

                            <InputLabel label="Password" />
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="white"
                                    secureTextEntry={!showPassword}
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordEmail')} style={styles.forgotPassword}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <LinearGradient colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']} style={styles.buttonGradient}>
                                <TouchableOpacity onPress={handleLogin} style={styles.buttonTouchable}>
                                    <Text style={styles.buttonText}>Log In</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                            <Text style={styles.footerText}>
                                Don’t have account?{' '}
                                <Text style={styles.footerLink} onPress={() => navigation.navigate('CreateAccount')}>
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

const InputLabel = ({ label }) => (
    <Text style={[styles.label, label === 'Password' && { marginTop: 16 }]}>{label}</Text>
);

const styles = StyleSheet.create({
    background: { flex: 1 },
    scrollContainer: { flexGrow: 1 },
    topImage: { width: '100%', height: 256 },
    card: {
        marginTop: -55,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        flex: 1,
    },
    logo: { resizeMode: 'contain', marginVertical: 15, alignSelf: 'center' },
    slogan: {
        textAlign: 'center',
        color: 'white',
        marginBottom: 16,
        fontFamily: 'Poppins',
        lineHeight: 28,
        fontSize: 14,
        letterSpacing: 3,
    },
    loginTitle: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginVertical: 7,
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
        fontFamily: 'Poppins',
        marginTop: 8,
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
    forgotPassword: { alignSelf: 'flex-end', marginTop: 5 },
    forgotText: {
        color: '#ccc',
        fontSize: 12,
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
    },
    buttonGradient: {
        borderRadius: 999,
        width: 350,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 30,
        alignSelf: 'center',
    },
    buttonTouchable: { width: '100%', alignItems: 'center' },
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
    footerLink: { textDecorationLine: 'underline' },
});
