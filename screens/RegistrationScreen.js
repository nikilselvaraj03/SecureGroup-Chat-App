import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailRegistrationScreen from './EmailRegistrationScreen'
import NameRegistrationScreen from './NameRegistrationScreen'
import DobRegistrationScreen from './DobRegistrationScreen'
import PasswordRegistrationScreen from './PasswordRegistrationScreen'
const Stack = createNativeStackNavigator();
export default function RegistrationScreen() {
  return (
      <Stack.Navigator initialRouteName='EmailRegistration'>
        <Stack.Screen options={{headerShown:false}} name="EmailRegistration" component={EmailRegistrationScreen}/>
        <Stack.Screen options={{headerShown:false}} name="NameRegistration"component={NameRegistrationScreen}/>
        <Stack.Screen options={{headerShown:false}} name="DobRegistration" component={DobRegistrationScreen}/>
        <Stack.Screen options={{headerShown:false}} name="PasswordRegistration" component={PasswordRegistrationScreen}/>
      </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})