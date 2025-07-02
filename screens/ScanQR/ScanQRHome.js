import { CameraView, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import { View, Text, Alert, Button, TouchableOpacity, Image, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import "../../global.css"
import ScreenWithBottomBar from "../../TemplateComponent/ScreenWithBottomBar"

export default function ScanQRHome() {
    const [permission, requestPermission] = useCameraPermissions()
    const [facing, setFacing] = useState('back')
    const [flash, setFlash] = useState('off')
    const [scanned, setScanned] = useState(false)

    const handleBarcodeScanned = ({ data, type }) => {
        if (!scanned) {
            setScanned(true)
            Alert.alert("Scanned", `Type: ${type}\nData: ${data}`)
            setTimeout(() => setScanned(false), 3000)
        }
    }

    const toggleCamera = () => {
        setFacing(facing === 'back' ? 'front' : 'back')
    }

    const toggleFlash = () => {
        setFlash(flash === 'off' ? 'torch' : 'off')
    }

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need gallery access to pick an image')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })

        if (!result.canceled) {
            Alert.alert('Image Picked', 'Image loaded from gallery')
            // Optional: add QR code processing logic for selected image
        }
    }

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
            {/* Camera */}
            <CameraView
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                facing={facing}
                flashMode={flash}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />

            {/* Top Gradient Toolbar */}
            <LinearGradient
                colors={['#3B057A', '#6A1B9A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="absolute top-0 left-0 right-0 py-5 px-6 flex-row justify-between items-center"
            >
                <TouchableOpacity onPress={toggleFlash}>
                    <Ionicons
                        name={flash === 'off' ? 'flash-off-outline' : 'flash-outline'}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>

                <Text className="text-white font-semibold text-lg">Scan QR</Text>

                <TouchableOpacity onPress={openGallery}>
                    <Ionicons name="image-outline" size={28} color="white" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Bottom Camera Flip */}
            <View className="absolute inset-0 items-center justify-end pb-10">
                <TouchableOpacity
                    onPress={toggleCamera}
                    className="bg-blue-700 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </ScreenWithBottomBar>
    )
}
