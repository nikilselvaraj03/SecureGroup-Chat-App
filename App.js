import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import HamburgerMenu from "./screens/HamburgerMenu";
import NewGroupScreen from "./screens/NewGroupScreen";
import { auth } from "./firebase";
import Home from "./screens/Home";
import ChatScreen from "./screens/ChatScreen";
import GroupProfileScreen from "./screens/GroupProfileScreen";

// import GroupProfileScreen from './screens/GroupProfileScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Caveat: require("./assets/fonts/Caveat-Regular.ttf"),
    "Caveat-Bold": require("./assets/fonts/Caveat-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth.token ? (
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
        ) : (
          <>
            {/* <Stack.Screen name="GroupProfileScreen" options={{headerShown:false}} component={GroupProfileScreen}/> */}
            <Stack.Screen
              name="ChatScreen"
              options={{ headerShown: false }}
              component={ChatScreen}
            />
            <Stack.Screen
              name="GroupProfileScreen"
              options={{ headerShown: false }}
              component={GroupProfileScreen}
            />
            <Stack.Screen
              name="NewGroupScreen"
              options={{ headerShown: false }}
              component={NewGroupScreen}
            />
            {/* <Stack.Screen name="HamburgerMenu" options={{headerShown:false}} component={HamburgerMenu}/> */}
            {/* <Stack.Screen name="Login" options={{headerShown:false}} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown:false}} component={RegistrationScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
