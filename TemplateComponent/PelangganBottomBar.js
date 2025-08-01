import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdmintBottomBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Bag', icon: 'shopping-bag' },
    { name: 'Profile', icon: 'user' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom}]}>
      <View style={styles.innerContainer}>
        {tabs.map(({ name, icon }) => {
          const isFocused = route.name === name;

          return (
            <TouchableOpacity
              key={name}
              onPress={() => navigation.navigate(name)}
              style={styles.tabButton}
            >
              {isFocused ? (
                <View style={styles.focusedTab}>
                  <Icon name={icon} size={18} color="#fff" />
                  <Text style={styles.focusedTabText}>{name}</Text>
                </View>
              ) : (
                <Icon name={icon} size={22} color="#fff" style={styles.icon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    backgroundColor: 'rgba(59, 5, 122, 1)',
    borderColor: 'rgba(113, 65, 168, 1)',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  focusedTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(88, 41, 171, 1)',
    borderRadius: 12,
  },
  focusedTabText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  icon: {
  },
});
