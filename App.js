
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { RootSiblingParent } from 'react-native-root-siblings';
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Caveat': require('./assets/fonts/Caveat-Regular.ttf'),
    'Caveat-Bold': require('./assets/fonts/Caveat-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <RootSiblingParent>
    <NavigationContainer>
    <Stack.Navigator>
      {(
        <>
          <Stack.Screen name="Login" options={{headerShown:false}}  initialParams={{fromSignUp:false}}component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown:false}} component={RegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
 
  </NavigationContainer>
  </RootSiblingParent>
  );
}

