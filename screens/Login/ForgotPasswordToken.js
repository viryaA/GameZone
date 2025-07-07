// screens/auth/ForgotPasswordToken.js
import React, { useRef, useState } from 'react';
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

export default function ForgotPasswordToken() {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const apiUrl = Constants.expoConfig.extra.API_URL;

  const { email: routeEmail } = route.params || {};
  const email = routeEmail || 'example@email.com';

  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const token = code.join('');
    if (token.length < 6) {
      return Toast.show({
        type: 'error',
        text1: 'Incomplete Code',
        text2: 'Please enter the full 6-digit code.',
      });
    }

    try {
      const response = await fetch(`${apiUrl}/MsUser/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, otp: token }).toString(),
      });

      const text = await response.text();
      if (!response.ok) {
        return Toast.show({
          type: 'error',
          text1: 'Invalid Code',
          text2: text,
        });
      }

      Toast.show({
        type: 'success',
        text1: 'Code Verified',
        text2: 'You can now reset your password.',
      });
      navigation.navigate('ForgotPasswordNewPass', { email, token });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Unable to verify code. Please try again later.',
      });
    }
  };

  const handleResend = async () => {
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
          text1: 'Failed to Resend Code',
          text2: text,
        });
      }

      Toast.show({
        type: 'success',
        text1: 'New Code Sent',
        text2: 'Check your email inbox.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Unable to send verification code.',
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
          <View style={styles.activeStep} />
          <View style={styles.inactiveStep} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <LinearGradient colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']} style={styles.card}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Verify Code</Text>
            </View>

            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/email-verification.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.infoText}>We’ve sent a 6-digit code to your email</Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  returnKeyType="next"
                />
              ))}
            </View>

            <LinearGradient colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']} style={styles.button}>
              <TouchableOpacity onPress={handleVerify} style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Didn’t get the code? Resend</Text>
            </TouchableOpacity>
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
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: 'rgba(88,41,171,1)',
    color: 'white',
    fontSize: 18,
    borderRadius: 8,
    width: 45,
    height: 50,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  button: {
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  resendText: {
    color: '#ddd',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginTop: 8,
  },
});
