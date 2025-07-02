import React, { useState } from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfilePhoto = ({ uri }) => {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => uri && setShowPreview(true)}>
                {uri ? (
                    <Image
                        source={{ uri }}
                        className="w-8 h-8 rounded-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-8 h-8 rounded-full bg-gray-400 justify-center items-center">
                        <Ionicons name="person" size={20} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Fullscreen Preview Modal */}
            {uri && (
                <Modal visible={showPreview} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setShowPreview(false)}>
                        <View className="flex-1 bg-black/90 justify-center items-center">
                            <Image
                                source={{ uri }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                            <TouchableOpacity
                                className="absolute top-10 right-5"
                                onPress={() => setShowPreview(false)}
                            >
                                <Ionicons name="close-circle" size={36} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
    );
};

export default UserProfilePhoto;
