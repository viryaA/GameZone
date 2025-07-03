import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
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
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function CreateAccount() {
  const navigation = useNavigation();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async () => {
  if (!nama || !email || !password || !confirmPassword) {
    return Toast.show({
      type: 'error',
      text1: 'Input required',
      text2: 'Semua field wajib diisi.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Toast.show({
      type: 'error',
      text1: 'Email tidak valid',
      text2: 'Masukkan email dengan format yang benar',
    });
  }

  if (password !== confirmPassword) {
    return Toast.show({
      type: 'error',
      text1: 'Password tidak cocok',
      text2: 'Password dan konfirmasi tidak sama.',
    });
  }

  try {
    const formData = new FormData();

    const userData = {
      usr_email: email,
      usr_password: password,
      usr_nama: nama,
    };

    formData.append('user', JSON.stringify(userData));

    // Kalau ada fotoProfile, misalnya dari ImagePicker:
    // formData.append('fotoProfile', {
    //   uri: image.uri,
    //   type: 'image/jpeg',
    //   name: 'profile.jpg',
    // });

    console.log("POST to:", `${apiUrl}/MsUser`);

    const response = await fetch(`${apiUrl}/MsUser`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // ❌ JANGAN set 'Content-Type' secara manual! Biarkan fetch menambahkan boundary otomatis
      },
      body: formData,
    });

    const result = await response.json();

    if (result.result === 1) {
      Toast.show({
        type: 'success',
        text1: 'Akun berhasil dibuat!',
      });
      navigation.navigate('FillAccount', { usr_id: result.data.usr_id });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Gagal membuat akun',
        text2: result.message || 'Coba lagi nanti.',
      });
    }
  } catch (error) {
    console.error(error);
    Toast.show({
      type: 'error',
      text1: 'Server error',
      text2: 'Terjadi kesalahan saat mendaftar.',
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
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.activeStep} />
          <View style={styles.inactiveStep} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <LinearGradient
              colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1.5 }}
              style={styles.card}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Sign Up</Text>
              </View>

              {/* Player ID */}
              <Text style={styles.label}>Player ID</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor="white"
                style={styles.input}
                value={nama}
                onChangeText={setNama}
              />

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="white"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  placeholder="create your password"
                  placeholderTextColor="white"
                  secureTextEntry={!showPassword}
                  style={styles.passwordText}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              <View style={styles.strengthContainer}>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          passwordStrength >= level
                            ? passwordStrength === 3
                              ? '#4CAF50'
                              : passwordStrength === 2
                              ? '#FFC107'
                              : '#F44336'
                            : '#ddd',
                      },
                    ]}
                  />
                ))}
              </View>

<Text style={styles.passwordHint}>
  {password.length > 0 && passwordStrength < 3 || password.length == 0
    ? 'Use at least 6 characters, including uppercase letters and numbers or symbols, to make your password strong.'
    : password.length > 0 && passwordStrength === 3
    ? 'Your password is strong.'
    : ''}
</Text>



              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="repeat your password"
                placeholderTextColor="white"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {/* Submit Button */}
              <LinearGradient
                colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.button}
              >
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Footer */}
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('FillAccount')}>
                  Login
                </Text>
              </Text>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// ==============================
// Styles
// ==============================

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  activeStep: {
    height: 4,
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginRight: 6,
  },
  inactiveStep: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 4,
    width: 170,
    borderRadius: 2,
    marginRight: 6,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
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
  label: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  input: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    color: 'white',
    fontFamily: 'Poppins',
  },
  passwordInput: {
    backgroundColor: 'rgba(88,41,171,1)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  passwordText: {
    flex: 1,
    paddingVertical: 12,
    color: 'white',
    fontFamily: 'Poppins',
  },
  strengthContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
    marginStart: 5,
    gap: 8,
  },
  strengthBar: {
    height: 5,
    width: 50,
    borderRadius: 5,
  },
  button: {
    borderRadius: 10,
    width: 350,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
    alignSelf: 'center',
  },
  buttonTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
  passwordHint: {
    color: 'white',
    fontSize: 10,
    fontStyle: 'italic',
    fontFamily: 'Poppins',
    marginStart: 5,
  },

});
