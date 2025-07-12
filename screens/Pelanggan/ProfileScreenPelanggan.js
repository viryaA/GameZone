import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ImageBackground, ScrollView,
  StyleSheet, Platform, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Asset } from 'expo-asset';
import { Image as ImgResolve } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenPelangganWithBottomBar from '../../TemplateComponent/ScreenPelangganWithBottomBar';
import { UserContext } from '../../Konteks/UserContext';

const apiUrl = Constants.expoConfig.extra.API_URL;
const defaultImages = [
  require('../../assets/profil/p1.jpg'),
  require('../../assets/profil/p2.jpg'),
  require('../../assets/profil/p3.jpg'),
  require('../../assets/profil/p4.jpg'),
  require('../../assets/profil/p5.jpg'),
];

export default function ProfileScreenPelanggan() {
  const { user } = useContext(UserContext);
  const [usr_id, setUsrId] = useState(null);
  const [rtl_id, setRtlId] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const rawData = await AsyncStorage.getItem('userData');
        const userData = rawData && JSON.parse(rawData);
        const id = userData?.usr_id;
        if(userData?.rtl_id?.rtl_id){
          setRtlId(userData?.rtl_id?.rtl_id);
        }
        console.log('User ID:', id);
        setUsrId(id);
      } catch (error) {
        console.error('Failed to load userData:', error);
      }
    };

    fetchUserId();
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') Alert.alert('Permission Denied', 'Access to media is required.');
    })();

    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/MsUser/${usr_id}`);
        const data = await res.json();
        setUserName(data.usr_username || '');
        setFullName(data.usr_nama || '');
        setEmail(data.usr_email || '');
        setPhoneNumber(data.usr_no_telp || '');
        setGender(data.usr_gender || '');
        setBirth(data.usr_tgl_lahir ? new Date(data.usr_tgl_lahir) : new Date());
        if (data.usr_foto_profile)
          setProfileImage(`${apiUrl}/Images/User/${data.usr_foto_profile}`);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    fetchData();
  }, [usr_id]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true, aspect: [1, 1], quality: 0.5,
      });
      if (!result.canceled && result.assets?.[0]?.uri)
        setProfileImage(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'Image pick failed');
    }
  };

  const uploadData = async () => {
    const formData = new FormData();
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!userName || !fullName || !email || !gender || !phoneNumber || !birth) {
      return Toast.show({ type: 'error', text1: 'Fill all fields' });
    }

    if (!emailValid) return Toast.show({ type: 'error', text1: 'Invalid email' });
    if (digitsOnly.length < 10 || digitsOnly.length > 14)
      return Toast.show({ type: 'error', text1: 'Invalid phone number' });

    formData.append('user', JSON.stringify({
      usr_id, usr_username: userName, usr_nama: fullName, usr_email: email,
      usr_gender: gender, usr_no_telp: phoneNumber, usr_tgl_lahir: formatDate(birth),rtl_id:null,
    }));

    if (profileImage?.startsWith('file://')) {
      const fileName = profileImage.split('/').pop();
      formData.append('fotoProfile', {
        uri: profileImage, type: `image/${fileName.split('.').pop()}`, name: fileName,
      });
    }

    try {
      const res = await fetch(`${apiUrl}/MsUser`, {
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
      Toast.show({ type: 'success', text1: 'Profile updated!' });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderInput = (label, value, setter, props = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setter}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#ccc"
        {...props}
      />
    </>
  );

  return (
    <ImageBackground source={require('../../assets/default-background.png')} style={styles.bg}>
      <ScreenPelangganWithBottomBar>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.imageContainer}>
                <View style={styles.profileWrapper}>
                  <Image
                    source={profileImage ? { uri: profileImage } : require('../../assets/user-icon.png')}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
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
                    />
                  ) : (
                    <TouchableOpacity style={styles.usernameDisplay} onPress={() => setIsEditingUsername(true)}>
                      <Feather name="edit" size={16} color="white" style={{ marginRight: 6 }} />
                      <Text style={styles.usernameText}>{userName || 'Your Username'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.imageOptionsContainer}>
                {defaultImages.map((img, i) => (
                  <TouchableOpacity key={i} onPress={async () => {
                    const uri = ImgResolve.resolveAssetSource(img).uri;
                    const asset = Asset.fromModule(img);
                    await asset.downloadAsync();
                    setProfileImage(asset.localUri || uri);
                  }}>
                    <Image source={img} style={styles.optionImage} />
                  </TouchableOpacity>
                ))}
              </View>

              {renderInput('Full Name', fullName, setFullName)}
              {renderInput('Email', email, setEmail, { keyboardType: 'email-address' })}

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>Birth</Text>
                  <TouchableOpacity style={styles.inputRow} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.dateText}>{formatDate(birth)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={birth} mode="date" display="default"
                      onChange={(e, d) => { if (d) setBirth(d); setShowDatePicker(false); }}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
                <View style={[styles.half, { marginLeft: 10 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Male" value="Male" />
                    </Picker>
                  </View>
                </View>
              </View>

              {renderInput('Phone Number', phoneNumber, setPhoneNumber, { keyboardType: 'phone-pad' })}

              <LinearGradient colors={['#263b81', '#8d64e5']} style={styles.button}>
                <TouchableOpacity onPress={uploadData} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScreenPelangganWithBottomBar>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 24, paddingBottom: 40 },
  imageContainer: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  profileWrapper: { width: 110, height: 110 },
  profileImage: {
    width: 110, height: 110, borderRadius: 55,
    borderColor: '#fff', borderWidth: 2, backgroundColor: '#eee'
  },
  cameraIcon: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#fff', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#fff',
  },
  usernameEditContainer: { marginTop: 10, alignItems: 'center' },
  usernameDisplay: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  usernameText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  usernameInput: {
    backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8, color: 'white', width: 200, textAlign: 'center'
  },
  label: { color: 'white', fontSize: 16, marginTop: 16, fontWeight: 'bold' },
  input: {
    backgroundColor: 'rgba(88,41,171,1)', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 12, marginTop: 8,
    color: 'white', height: 45,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', height: 45,
    backgroundColor: 'rgba(88,41,171,1)', borderRadius: 8, padding: 12, marginTop: 8,
  },
  dateText: { color: 'white', fontSize: 14 },
  pickerContainer: {
    backgroundColor: 'rgba(88,41,171,1)', borderRadius: 8,
    overflow: 'hidden', height: 45, justifyContent: 'center', marginTop: 8,
  },
  picker: { color: 'white', height: 45 },
  row: { flexDirection: 'row', marginTop: 16 },
  half: { flex: 1 },
  imageOptionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 7 },
  optionImage: { width: 63, height: 45, borderRadius: 10, borderColor: 'white', borderWidth: 2 },
  button: {
    marginTop: 25, borderRadius: 10, height: 45,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%',
  },
  updateButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
