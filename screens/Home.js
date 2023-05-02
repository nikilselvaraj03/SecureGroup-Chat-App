import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';

import Contacts from './Contacts';
import CreateGroup from './CreateGroup';
import LandingScreen from './LandingScreen';
import ProfilePage from './ProfilePage';
import NewGroupScreen from './NewGroupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


const home = 'Home';
const profile = 'Profile';
const contacts = 'Requests';
const creategroup = 'Create New Group';

const Tab = createBottomTabNavigator();



export default function Home({userToken}) {
  let navigation = useNavigation();
  const [userinfo,setUserInfo] = useState(null);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
    });
    let userInformation = null;

    async function fetchUserInfo(){
      const docRef = doc(db, 'users', userToken.uid);
      userInformation = await getDoc(docRef);
      if (userInformation && userInformation.exists() && userInformation.data()) {
        setUserInfo(userInformation.data());
        if(userInformation && userInformation.data() && userInformation.data().first_name){
        Toast.show('Welcome back '+userInformation.data().first_name, {
          duration: Toast.durations.LONG,
          backgroundColor:'#defabb',
          textColor: '#008b00',
          position:-120
        });}
    } else {
      Toast.show('Unable to retrieve your information right now, please try again later', {
        duration: Toast.durations.LONG,
        backgroundColor:'#FFEBEE',
        textColor: '#B71C1C',
        position:-120
      });
    }
    }
    fetchUserInfo()

    return unsubscribe;
  }, []);

  function getrouteName(route) {
    const routeName = getFocusedRouteNameFromRoute(route)
    return routeName
  }
  return (
            <Tab.Navigator initialRouteName={home} screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    if(rn === profile){
                        iconName = focused ? 'person-circle-outline' : 'person-outline'
                    } else if (rn === contacts) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === creategroup){
                        iconName = focused ? 'add-circle-outline' : 'add-outline'

                    }else if (rn === home){
                        iconName = focused ? 'home' : 'home-outline'

                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarStyle:{
                  activeTintColor: 'tomato',
                  inactiveTintColor: 'black',
                  labelStyle: { paddingBottom:10, fontSize: 10},
              }
            })}
           
            >
                <Tab.Screen name={home} options={{
                  headerShown:false}}>{() => <LandingScreen userinfo={userinfo} />}</Tab.Screen>  
                {/* <Tab.Screen name={home} options={{headerShown:false}} initialParams={{userinfo}} />  */}
                <Tab.Screen name={creategroup} options={{headerShown:true}} component={NewGroupScreen}/>
                <Tab.Screen name={contacts} options={{headerShown:false}}>{() => <Contacts userinfo={userinfo} />}</Tab.Screen>
                <Tab.Screen name={profile} options={{headerShown:false}}>{() => <ProfilePage userinfo={userinfo} />}</Tab.Screen>                
          </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})