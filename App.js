
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { auth } from './firebase';
import Home from './screens/Home'
import { useEffect } from 'react';
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Caveat': require('./assets/fonts/Caveat-Regular.ttf'),
    'Caveat-Bold': require('./assets/fonts/Caveat-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

//   useEffect(() =>{
//     const unsubscribe = auth.onAuthStateChanged(user => {
//          if(user) {
//              navigation.navigate('Home')
//          }
//      })
//      return unsubscribe
//  })
  return (
    <NavigationContainer>
    <Stack.Navigator>
      {auth.token ? (
        <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
      ) : (
        <>
          <Stack.Screen name="Login" options={{headerShown:false}} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown:false}} component={RegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
  );
}

