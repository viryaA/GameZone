import { CameraView, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import {View, Text, Alert, Button, TouchableOpacity, Image, Platform, ActivityIndicator} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import "../../global.css"
import ScreenWithBottomBar from "../../TemplateComponent/ScreenWithBottomBar"
import i18n from "../../Locale/i18n";
import BookingModalConfirm from "./components/BookingModalConfirm";

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.API_URL;

export default function ScanQRHome() {
    const [permission, requestPermission] = useCameraPermissions()
    const [facing, setFacing] = useState('back')
    const [torch, setTorch] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [cameraActive, setCameraActive] = useState(true) // New state to control camera
    const [scanResult, setScanResult] = useState(null) // Store scan result
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const handleBarcodeScanned = ({ data, type }) => {
        if (!scanned && cameraActive) {
            setScanned(true);
            setScanResult({ data, type });

            setCameraActive(false);
            setLoading(true); // Start loading

            fetch(`${apiUrl}/TrBooking/scan?code=` + data )
                .then(res => res.json())
                .then(json => {
                    setLoading(false); // Stop loading
                    if (json['result']) {
                        setData(json.data);
                        console.log(json.data.user.usr_email);
                    }
                })
                .catch(err => {
                    setLoading(false); // Stop loading
                    console.error(err);
                    Toast.show({
                        type: 'error',
                        text1: i18n.t("failed"),
                        text2: i18n.t("error_message")
                    });
                });
            setModalVisible(true)
        }
    };

    const resetScanner = () => {
        setScanned(false)
        setScanResult(null)
        setCameraActive(true)
    }

    const toggleCamera = () => {
        if (!cameraActive) return // Prevent camera toggle when inactive

        const newFacing = facing === 'back' ? 'front' : 'back'
        setFacing(newFacing)

        // If switching away from back camera, turn off the torch
        if (newFacing !== 'back') {
            setTorch(false)
        }
    }

    const toggleTorch = () => {
        if (!cameraActive) return // Prevent torch toggle when camera inactive
        setTorch(prev => !prev)
    }

    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission denied', 'We need gallery access');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const asset = result.assets[0];
            const imageUri = asset.uri;

            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                name: 'image.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // DO NOT manually set Content-Type for multipart/form-data
                    // Let fetch do it automatically when using FormData
                },
            });

// Check the actual response body
            const text = await response.text();
            console.log('Raw response text:', text);

            try {
                const json = JSON.parse(text);
                console.log('Decoded JSON:', json);

                const qr = json?.[0]?.symbol?.[0]?.data;
                if (qr) {
                    setQrValue(qr);
                } else {
                    setQrValue('❌ QR not found in image');
                }
            } catch (e) {
                console.error('Failed to parse response JSON:', e);
                setQrValue('❌ Error decoding response');
            }
        }
    };


    if (!permission) return <View />
    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-blue-50">
                <Text className="text-lg text-blue-900 mb-4">
                    We need your permission to use the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        )
    }

    return (
        <ScreenWithBottomBar>
            {/* Camera - Only render when active */}
            {cameraActive && (
                <CameraView
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                    facing={facing}
                    enableTorch={torch}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            )}

            {/* Frozen/Inactive Camera Overlay */}
            {!cameraActive && data !== null && (
                <BookingModalConfirm
                    visible={modalVisible}
                    onClose={() => {
                        setModalVisible(false)
                        setCameraActive(true)
                        setScanResult(null)
                        setScanned(false)
                    }}
                    onConfirm={() => {
                        console.log("Checked in");
                        setModalVisible(false);
                        resetScanner();
                    }}
                    data={data}
                />
            )}

            {/* Top Gradient Toolbar */}
            <LinearGradient
                colors={['#3F217A', '#2B0257']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 20,
                    right: 20,
                    borderRadius: 10,
                    elevation: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    zIndex: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: 'transparent',
                    borderWidth: 0.5,
                    borderColor: 'white',
                }}
            >
                <TouchableOpacity onPress={openGallery}>
                    <Ionicons name="image-outline" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleTorch}
                    disabled={facing !== 'back' || !cameraActive}
                    style={{
                        opacity: (facing !== 'back' || !cameraActive) ? 0.3 : 1,
                        marginHorizontal: 20
                    }}
                >
                    <Ionicons
                        name={torch ? 'flashlight' : 'flashlight-outline'}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleCamera}
                    disabled={!cameraActive}
                    style={{ opacity: !cameraActive ? 0.3 : 1 }}
                >
                    <Ionicons name="camera-reverse-outline" size={28} color="white" />
                </TouchableOpacity>
            </LinearGradient>

            {loading && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100
                }}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{ color: 'white', marginTop: 10 }}>{i18n.t("loading")}</Text>
                </View>
            )}


            {/* Instructional Text - Only show when camera is active */}
            {cameraActive && (
                <Text
                    style={{
                        position: 'absolute',
                        top: 650,
                        left: 30,
                        right: 30,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 14,
                        zIndex: 10,
                        textShadowColor: 'rgba(0, 0, 0, 0.6)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                    }}
                >
                    The QR Code will be automatically detected when you position it between the guide lines
                </Text>
            )}

        </ScreenWithBottomBar>
    )
}