import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const apiUrl = Constants.expoConfig.extra.API_URL;

export default function FillAccount() {
  const navigation = useNavigation();
  const route = useRoute();
  const { usr_id } = route.params;

  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDone = async () => {
    if (!fullName || !birth || !gender || !phoneNumber) {
      return Toast.show({
        type: 'error',
        text1: 'Input required',
        text2: 'Semua field wajib diisi.',
      });
    }

    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 14) {
      return Toast.show({
        type: 'error',
        text1: 'Invalid phone number',
        text2: 'Phone number must be between 10 and 14 digits.',
      });
    }

    try {
      await uploadAccountData();
      Toast.show({
        type: 'success',
        text1: 'Data berhasil disimpan!',
      });
      navigation.navigate('LoginMain');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Gagal menyimpan data!',
        text2: 'Silakan coba lagi.',
      });
    }
  };

  const uploadAccountData = async () => {
    const formData = new FormData();

    const userData = {
      usr_id: usr_id,
      usr_nama: fullName,
      usr_tgl_lahir: birth.toISOString().split('T')[0],
      usr_gender: gender,
      usr_no_telp: phoneNumber,
    };

    console.log(userData);

    formData.append('user', JSON.stringify(userData));

    if (profileImage) {
      let imageUri = profileImage;
      let imageName = 'profile.jpg';
      let imageType = 'image/jpeg';

      if (!profileImage.startsWith('file://')) {
        const matchingAsset = defaultProfileImages.find(
          img => Image.resolveAssetSource(img).uri === profileImage
        );
        if (matchingAsset) {
          const assetObj = Asset.fromModule(matchingAsset);
          await assetObj.downloadAsync();
          imageUri = assetObj.localUri || assetObj.uri;
        }
      }

      if (imageUri.startsWith('file://')) {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName.split('.').pop();
        imageName = fileName;
        imageType = `image/${fileType}`;
      }

      formData.append('fotoProfile', {
        uri: imageUri,
        type: imageType,
        name: imageName,
      });
    }

    const response = await fetch(`${apiUrl}/MsUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error response:', errorData);
      throw new Error(errorData.message || 'Gagal update user.');
    }

    return await response.json();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birth;
    setShowDatePicker(Platform.OS === 'ios');
    setBirth(currentDate);
  };

  const defaultProfileImages = [
    require('../../assets/profil/p1.jpg'),
    require('../../assets/profil/p2.jpg'),
    require('../../assets/profil/p3.jpg'),
    require('../../assets/profil/p4.jpg'),
    require('../../assets/profil/p5.jpg'),
  ];

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
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'android' ? 100 : 60}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['rgba(58,5,121,255)', 'rgba(66, 4, 137, 0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.5 }}
            style={styles.card}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('LoginMain')}>
                <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Fill Account</Text>
            </View>

            {/* Profile Image */}
            <View style={styles.imageContainer}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../../assets/user-icon.png')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
                <Feather name="camera" size={16} color="grey" />
              </TouchableOpacity>
            </View>

            {/* Default Profile Options */}
            <View style={styles.imageOptionsContainer}>
              {defaultProfileImages.map((imgSrc, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setProfileImage(Image.resolveAssetSource(imgSrc).uri)}
                >
                  <Image source={imgSrc} style={styles.optionImage} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="white"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Birth & Gender */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Birth</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, styles.dateInput]}
                >
                  <Ionicons name="calendar" size={18} color="white" style={styles.calendarIcon} />
                  <Text style={styles.dateText}>{birth.toISOString().split('T')[0]}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={birth}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(value) => setGender(value)}
                    dropdownIconColor="white"
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Male" value="Male" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="0882 1041 4425"
              placeholderTextColor="white"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            {/* Done Button */}
            <LinearGradient
              colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleDone} activeOpacity={0.8} style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </LinearGradient>

            <Text style={styles.footerText}>
              <Text style={styles.footerLink} onPress={() => navigation.navigate('LoginMain')}>
                Skip for now
              </Text>
            </Text>
          </LinearGradient>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// ==============================
// Styles
// ==============================

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
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginRight: 6,
  },
  scrollContainer: {
    paddingBottom: 100,
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
  backIcon: { marginRight: 8 },
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
    height: 55,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  pickerContainer: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    height: 55,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIcon: {
    marginLeft: 4,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  imageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },
  optionImage: {
    width: 63,
    height: 55,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
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
