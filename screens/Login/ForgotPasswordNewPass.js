// screens/auth/ForgotPasswordNewPass.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

export default function ForgotPasswordNewPass() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, token } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const apiUrl = Constants.expoConfig.extra.API_URL;

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return Toast.show({ type: 'error', text1: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return Toast.show({ type: 'error', text1: 'Passwords do not match.' });
    }

    try {
      const response = await fetch(`${apiUrl}/MsUser/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email,
          newPassword: password,
        }).toString(),
      });

      const text = await response.text();
      if (!response.ok) {
        return Toast.show({ type: 'error', text1: 'Reset failed', text2: text });
      }

      Toast.show({ type: 'success', text1: 'Password Reset Successful', text2: 'Please log in again.' });
      navigation.navigate('LoginMain');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Server Error', text2: 'Unable to reset password.' });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/default-background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.activeStep} />
          <View style={styles.activeStep} />
          <View style={styles.activeStep} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <LinearGradient colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']} style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>New Password</Text>
            </View>

            {/* Icon and Info Text */}
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/reset-password.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.infoText}>
                Your identity has been verified. Set and confirm your new password.
              </Text>
            </View>

            {/* Password Field */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="white"
                style={styles.input}
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.eyeIcon}>
                <Ionicons name={securePassword ? 'eye-off' : 'eye'} size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Re-enter new password"
                placeholderTextColor="white"
                style={styles.input}
                secureTextEntry={secureConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeIcon}>
                <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* Reset Button */}
            <LinearGradient colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']} style={styles.button}>
              <TouchableOpacity onPress={handleReset} style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  activeStep: {
    height: 4,
    width: 110,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginRight: 6,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  backIcon: {
    marginRight: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins',
    opacity: 0.8,
  },
  emailText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  button: {
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});
