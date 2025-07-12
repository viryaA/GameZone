import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

export default function QRCodeCard({ qrCode }) {
  const viewShotRef = useRef();

  const captureQR = async () => {
    if (!viewShotRef.current) {
      Toast.show({
          type: "error",
          text1: "Gagal",
          text2: "QR belum siap, Mohon tunggu QR Code ditampilkan.",
      });
      return null;
    }

    return await viewShotRef.current.capture();
  };

  const handleSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
            type: "error",
            text1: "Gagal",
            text2: "Tidak dapat mengakses galeri.",
        });
        return;
      }

      const uri = await captureQR();
      if (!uri) return;

      await MediaLibrary.saveToLibraryAsync(uri);
      Toast.show({
            type: "success",
            text1: "Sukses",
            text2: "QR Code berhasil disimpan ke galeri!",
        });
    } catch (error) {
      console.error(error);
      Toast.show({
            type: "error",
            text1: "Gagal",
            text2: "Terjadi kesalahan saat menyimpan gambar.",
        });
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureQR();
      if (!uri) return;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Toast.show({
          type: "error",
          text1: "Gagal",
          text2: "File tidak ditemukan!",
      });
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
      Toast.show({
          type: "error",
          text1: "Gagal",
          text2: "Terjadi kesalahan saat mengambil file!",
      });
    }
  };

  return (
    <View className="bg-[#3F217A] border border-white rounded-xl mx-4 mt-6 p-4">
      {/* QR Code Box dibungkus ViewShot */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <View className="bg-white rounded-xl p-4 items-center border border-white/10">
          <QRCode
            value={qrCode}
            size={180}
            backgroundColor="white"
            color="black"
          />
        </View>
      </ViewShot>

      {/* Action Buttons */}
      <View className="flex-row justify-end gap-3 mt-4 space-x-3">
        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row items-center bg-[#6D45A1] px-4 py-2 rounded-lg"
        >
          <Ionicons name="share-social" size={16} color="white" />
          <Text className="text-white font-poppins-bold text-sm ml-1">Share</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="flex-row items-center bg-[#6D45A1] px-4 py-2 rounded-lg"
        >
          <Ionicons name="download" size={16} color="white" />
          <Text className="text-white font-poppins-bold text-sm ml-1">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}