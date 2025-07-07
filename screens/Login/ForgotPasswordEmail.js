// screens/auth/ForgotPasswordEmail.js
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

export default function ForgotPasswordEmail() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const apiUrl = Constants.expoConfig.extra.API_URL;

  const handleNext = async () => {
    if (!email) {
      return Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
    }

    try {
      const response = await fetch(`${apiUrl}/MsUser/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
      });

      const text = await response.text();
      if (!response.ok) {
        return Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: text,
        });
      }

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your email inbox.',
      });
      navigation.navigate('ForgotPasswordToken', { email });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to reach the server. Please try again later.',
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/default-background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.stepIndicator}>
          <View style={styles.activeStep} />
          <View style={styles.inactiveStep} />
          <View style={styles.inactiveStep} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <LinearGradient
            colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.5 }}
            style={styles.card}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Forgot Password</Text>
            </View>

            {/* Lock Icon */}
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/lock-icon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.infoText}>
                Enter the email address associated with your account to receive a password reset code.
              </Text>
            </View>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="example@mail.com"
              placeholderTextColor="white"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <LinearGradient
              colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleNext} style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>Send Code</Text>
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
  inactiveStep: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 4,
    width: 110,
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
    width: 130,
    height: 130,
    marginBottom: 12,
    marginTop: 10,
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins',
    opacity: 0.8,
    paddingHorizontal: 16,
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
