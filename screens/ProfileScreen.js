import { CameraView, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import { View, Text, Alert, Button, TouchableOpacity } from 'react-native'
import "../global.css"

export default function ProfileScreen() {
    const [permission, requestPermission] = useCameraPermissions()
    const [facing, setFacing] = useState('back')
    const [scanned, setScanned] = useState(false)

    const handleBarcodeScanned = ({ data, type }) => {
        if (!scanned) {
            setScanned(true)
            Alert.alert("Scanned", `Type: ${type}\nData: ${data}`)
            // Reset scan after 3 seconds
            setTimeout(() => setScanned(false), 3000)
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

    const toggleCamera = () => {
        setFacing(facing === 'back' ? 'front' : 'back')
    }

    return (
        <View className="flex-1 bg-blue-100">
            {/* Fullscreen Camera */}
            <CameraView
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'], // Only scan QR
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />

            {/* Overlay Buttons */}
            <View className="absolute inset-0 items-center justify-end pb-10">
                <TouchableOpacity
                    onPress={toggleCamera}
                    className="bg-blue-700 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
