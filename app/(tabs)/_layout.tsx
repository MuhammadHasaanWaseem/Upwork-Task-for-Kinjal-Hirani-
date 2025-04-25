import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import {  Home, User } from 'lucide-react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#010118',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: { backgroundColor: '#010118' },
        }),
      }}
    >
    
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Home fill={focused ? '#FF4500' : ''} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
   
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <User fill={focused ? '#FF4500'  : ''} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  activeIndicator: {
    width: 70,
    height: 1,
    backgroundColor: 'white',
    marginTop: 2,
    borderRadius: 3,
  },
};
