import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ScreenWithBottomBar from '../TemplateComponent/ScreenWithBottomBar';
import { Asset } from 'expo-asset';
import { Image as ImgResolve } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';


const apiUrl = Constants.expoConfig.extra.API_URL;

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const usr_id = 20;

  const defaultProfileImages = [
    require('../assets/profil/p1.jpg'),
    require('../assets/profil/p2.jpg'),
    require('../assets/profil/p3.jpg'),
    require('../assets/profil/p4.jpg'),
    require('../assets/profil/p5.jpg'),
  ];

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required.');
      }
    })();

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/MsUser/${usr_id}`);
        const data = await response.json();

        setUserName(data.usr_username || '');
        setFullName(data.usr_nama || '');
        setEmail(data.usr_email || '');
        setPhoneNumber(data.usr_no_telp || '');
        setGender(data.usr_gender || '');
        setBirth(data.usr_tgl_lahir ? new Date(data.usr_tgl_lahir) : new Date());

        console.log('Data user:', data);

        if (data.usr_foto_profile) {
          const fullImageUrl = `${apiUrl}/Images/User/${data.usr_foto_profile}`;
          setProfileImage(fullImageUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) setBirth(selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
  };

  const uploadAccountData = async () => {
  const formData = new FormData();

  // Basic field validation
  if (!userName || !fullName || !email || !phoneNumber || !gender || !birth) {
    return Toast.show({
      type: 'error',
      text1: 'Failed to save data!',
      text2: 'All fields must be filled out.',
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Toast.show({
      type: 'error',
      text1: 'Invalid email format',
      text2: 'Please enter a valid email address.',
    });
  }

  // Phone validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 14) {
    return Toast.show({
      type: 'error',
      text1: 'Invalid phone number',
      text2: 'Phone number must be between 10 and 14 digits.',
    });
  }

  // Prepare data
  const userData = {
    usr_id: usr_id,
    usr_username: userName,
    usr_nama: fullName,
    usr_tgl_lahir: formatDate(birth),
    usr_gender: gender,
    usr_no_telp: phoneNumber,
    usr_email: email,
  };

  console.log('📦 Payload yang dikirim ke backend:', JSON.stringify(userData, null, 2));

  formData.append('user', JSON.stringify(userData));

  if (profileImage && profileImage.startsWith('file://')) {
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

  try {
    const response = await fetch(`${apiUrl}/MsUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user.');
    }

    Toast.show({
      type: 'success',
      text1: 'Profile updated successfully!',
    });
  } catch (err) {
    Alert.alert('Error', err.message);
  }
};


  return (
    
    <ImageBackground
      source={require('../assets/default-background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScreenWithBottomBar>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
        >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageContainer}>
            <View style={styles.profileWrapper}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/user-icon.png')}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
                <Feather name="camera" size={18} color="grey" />
              </TouchableOpacity>
            </View>

            <View style={styles.usernameEditContainer}>
              {isEditingUsername ? (
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  onBlur={() => setIsEditingUsername(false)}
                  style={styles.usernameInput}
                  autoFocus
                  placeholder="Your Username"
                  placeholderTextColor="#ccc"
                />
              ) : (
                <TouchableOpacity
                  style={styles.usernameDisplay}
                  onPress={() => setIsEditingUsername(true)}
                >
                  <Feather name="edit" size={16} color="white" style={{ marginRight: 6 }} />
                  <Text style={styles.usernameText}>{userName || 'Your Username'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.imageOptionsContainer}>
            {defaultProfileImages.map((imgSrc, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={async () => {
                  const uri = ImgResolve.resolveAssetSource(imgSrc).uri;
                  const assetObj = Asset.fromModule(imgSrc);
                  await assetObj.downloadAsync();
                  setProfileImage(assetObj.localUri || uri);
                }}
              >
                <Image source={imgSrc} style={styles.optionImage} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor="#ccc"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Birth</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputRow}>
                <Ionicons name="calendar" size={18} color="#fff" style={styles.calendarIcon} />
                <Text style={styles.dateText}>{formatDate(birth)}</Text>
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

            <View style={[styles.halfInputContainer, { marginLeft: 10 }]}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  dropdownIconColor="white"
                  style={styles.picker}
                >
                  <Picker.Item style={{ fontSize: 14 }} label="Female" value="Female" />
                  <Picker.Item style={{ fontSize: 14 }} label="Male" value="Male" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#ccc"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <LinearGradient
              colors={['rgba(38,59,129,1)', 'rgb(141, 100, 229)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.button}
          >
              <TouchableOpacity activeOpacity={0.8} style={styles.buttonTouchable} onPress={uploadAccountData}>
                  <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
          </LinearGradient>

        </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
      </ScreenWithBottomBar>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 24, paddingBottom: 40 },
  imageContainer: { alignItems: 'center', marginBottom: 20, marginTop: 40, position: 'relative' },
  profileWrapper: { position: 'relative', width: 110, height: 110 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: '#eee',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 1,
  },
  imageOptionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 7 },
  optionImage: {
    width: 63,
    height: 45,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
  },
  usernameEditContainer: { marginTop: 10, alignItems: 'center' },
  usernameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  usernameText: { color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins' },
  usernameInput: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 200,
    textAlign: 'center',
  },
  label: { color: 'white', fontSize: 16, marginTop: 16, fontWeight: 'bold', fontFamily: 'Poppins' },
  input: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    color: 'white',
    fontFamily: 'Poppins',
    height: 45,
    fontSize: 14,
  },
  inputRow: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    height: 45,
  },
  calendarIcon: { marginRight: 8 },
  dateText: { color: 'white', fontSize: 14, fontFamily: 'Poppins' },
  pickerContainer: {
    backgroundColor: 'rgba(88,41,171,1)',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    height: 45,
    justifyContent: 'center',
  },
  picker: { color: 'white', height: 55, fontSize: 12 },
  row: { flexDirection: 'row', gap: 12 },
  halfInputContainer: { flex: 1 },
  updateButton: {
    backgroundColor: '#5829ab',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  button: {
    borderRadius: 10,
    width: 350,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 16,
    alignSelf: 'center',
  },
  buttonTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: { flexGrow: 1 },
});