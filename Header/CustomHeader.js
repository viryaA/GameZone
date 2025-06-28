// components/CustomHeader.js
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeader({ navigation, route, options }) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', // spread items
            paddingTop: 40,
            paddingHorizontal: 16,
            paddingBottom: 12,
            backgroundColor: '#fff',
            elevation: 4,
        }}>
            {/* Left: Back button + title */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {navigation.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                )}
                <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold' }}>
                    {options.title || route.name}
                </Text>
            </View>

            {/* Right: Profile icon */}
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle-outline" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
}
