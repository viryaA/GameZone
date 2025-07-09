import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pastikan kamu pakai expo atau install vector-icons

export default function CustomToast({ text1, text2, type, onClose }) {
  const isSuccess = type === 'success';

  return (
    <View style={[styles.toastContainer, isSuccess ? styles.success : styles.error]}>
      <View style={styles.iconContainer}>
        <Image
          source={
            isSuccess
              ? require('./assets/success-icon.png')
              : require('./assets/error-icon.png')
          }
          style={styles.icon}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.text1, isSuccess ? styles.successText : styles.errorText]}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={[styles.text2, isSuccess ? styles.successText : styles.errorText]}>
            {text2}
          </Text>
        ) : null}
      </View>

      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={18} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderLeftWidth: 5,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,

    // Shadow for Android
    elevation: 4,
  },
  success: {
    borderLeftColor: '#10B981', // green
  },
  error: {
    borderLeftColor: '#EF4444', // red
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins',
  
  },
  successText: {
    color: '#065F46',
  },
  errorText: {
    color: '#991B1B',
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});
