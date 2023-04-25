import * as React from 'react';
import { View, Text} from 'react-native';

import Contacts from './Contacts';
import CreateGroup from './CreateGroup';
import LandingScreen from './LandingScreen';
import ProfilePage from './ProfilePage';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


const home = 'Home';
const profilePage = 'ProfilePage';
const contacts = 'Requests';
const creategroup = 'CreateGroup';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName={home} screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    if(rn === profilePage){
                        iconName = focused ? 'person-circle-outline' : 'person-outline'
                    } else if (rn === contacts) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === creategroup){
                        iconName = focused ? 'add-circle-outline' : 'add-outline'

                    }else if (rn === home){
                        iconName = focused ? 'home' : 'home-outline'

                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                }
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'black',
                labelStyle: { paddingBottom:10, fontSize: 10 }
            }}
            >
                <Tab.Screen name={home} options={{headerShown:false}} component={LandingScreen}/>
                <Tab.Screen name={creategroup} options={{headerShown:false}} component={CreateGroup}/>
                <Tab.Screen name={contacts} options={{headerShown:false}} component={Contacts}/>
                <Tab.Screen name={profilePage} options={{headerShown:false}} component={ProfilePage}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}