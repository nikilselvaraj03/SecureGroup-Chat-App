import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
export default function Home({userToken}) {
  let navigation = useNavigation();
  [userinfo,setUserInfo] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    let userInformation = null;
    async function fetchUserInfo(){
      userInformation = await getDoc(doc(db,'users',userToken.uid));
      if (userInformation && userInformation.exists()) {
        setUserInfo(userInformation.data());
        Toast.show('Welcome back '+userinfo.first_name, {
          duration: Toast.durations.LONG,
          backgroundColor:'#defabb',
          textColor: '#008b00',
          position:-120
        });
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
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({})