import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useReducer } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatScreen";
import GroupProfileScreen from "./GroupProfileScreen";
import LandingScreen from './LandingScreen';
const Stack = createNativeStackNavigator();
export default function HomeScreenLayout({userDetails}) {
    
  return (
    userDetails !== null && <Stack.Navigator initialRouteName='Landing'>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Landing"
        component={LandingScreen}
        initialParams={{userinfo:userDetails}}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GroupProfileScreen"
        component={GroupProfileScreen}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})