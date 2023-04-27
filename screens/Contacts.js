import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';

import { collection, doc, getDoc, query, where, getDocs, deleteDoc, setDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../consts/colors';
import Toast from 'react-native-root-toast';


const width = Dimensions.get('window').width / 2 - 30;

const Contacts = ({ userinfo }) => {
    navigation = useNavigation()
    const [groups, setGroups] = useState([]);
    const [likedGroups, setLikedGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredGroups, setFilteredGroups] = useState(groups);
    const todoRef = collection(db,'Groups');
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            setGroups([])
            fetchData();
          });
          fetchData();
          return unsubscribe
    },[]);
          
    const fetchData = async () => {
        if(userinfo){
            const docRef = doc(db, "users", userinfo.userId);
            const requests = await (await getDoc(docRef)).data().requests
        if(requests && requests.length > 0) {
          let q = query(todoRef, where('Groupid', 'in', requests));
          let rtrgroups = []
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            rtrgroups.push(doc.data())
          });
          setGroups(rtrgroups)
        }
        }
      };


      const handleReject = async (groupid) => {
        const userDocRef = doc(db, "users", userinfo.userId);
        try {
          // Delete the record from Firebase Firestore
          await updateDoc(userDocRef, {
            requests:arrayRemove(groupid)})
            setGroups(JSON.parse((JSON.stringify((groups.filter((group)=>{return group.Groupid != groupid}))))))
          console.log('Group deleted successfully:', groupid);
      
          // Update the state to reflect the changes
          // setGroups(groupid.filter(item => item !== groupid));
      
          // Show a success message to the user
          console.log('Success', 'Group request rejected successfully');
      
        } catch (error) {
          console.error('Error deleting group:', error);
          // Show an error message to the user
          console.log('Error', 'Failed to reject group request');
        }
      };
      const handleApprove = async (groupid) => {
        console.log(groupid)
          const userDocRef = doc(db, "users", userinfo.userId);
          await updateDoc(userDocRef, {
            groups: arrayUnion(groupid),
            requests:arrayRemove(groupid)
        }).then(async ()=>{
          const groupRef = doc(db, "Groups", groupid);
          await updateDoc(groupRef,{
            participants:arrayUnion(userinfo.userId)
          })
        })
        
        
      setGroups(JSON.parse((JSON.stringify((groups.filter((group)=>{return group.Groupid != groupid}))))))

      }

      
        const Card = ({groups, groupid}) => {

          return (
            <TouchableOpacity style={{ height:70}} activeOpacity={0.8}>
           
  
                <View
                  style={{
                    flex:1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems:'center',
                    paddingHorizontal:30,
                    borderBottomColor:'#d1c4e9',
                    borderBottomWidth:StyleSheet.hairlineWidth
                  }}> 
                <View style={{flex:3}}>
                  <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 17, textAlign: 'left', color:'#424242', maxWidth: 120}}>
                  {groups}
                </Text>
                </View>    

                <View style={style.buttoncontainer}>
                <TouchableOpacity style={style.approvebuttonContainer} onPress={() => handleApprove(groupid)}>
                    <Text style={style.approvebuttonText}>Approve</Text>
             </TouchableOpacity>
             <TouchableOpacity style={style.rejectbuttonContainer} onPress={() => handleReject(groupid)}>
                    <Text style={style.rejectbuttonText}>Reject</Text>
             </TouchableOpacity>
             </View>
              </View>
      
            </TouchableOpacity>

          );
        };
      
        return (
          <SafeAreaView
            style={{flex: 1, width:Dimensions.get('window').width, justifyContent:'center', backgroundColor:'white'}}>
            <View style={style.header}>

                <Text style={{fontSize:25, color: '#673AB7', justifyContent:'center', fontWeight: 'bold', paddingHorizontal: 20}}>
                  REQUESTS
                </Text>

            </View>
            <View style={style.cards}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginRight:0,
              }}
              
              numColumns={1}
              data={searchQuery ? filteredGroups : groups}
              renderItem={({item}) => {
                return <Card groups={item.Name} groupid={item.Groupid} userinfo={userinfo.requests}  />;
              }}
      
            /></View>
          </SafeAreaView>
        );
      };
      const style = StyleSheet.create({
        cards:{
          flex:1,
          backgroundColor:'white',
          margin:18,
          borderRadius:12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        requestGroups:{
            borderBottomColor: '#fff',
            borderBottomWidth: 1,
        },
        categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
        categoryTextSelected: {
          color: '#673AB7',
          paddingBottom: 5,
          borderBottomWidth: 2,
          borderColor: '#fffff',
        },buttoncontainer:{
          flexDirection:'row',
          flex:3,
          justifyContent:'space-between'
        },
        header: {
          marginTop: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        approve:{
            backgroundColor:'#4285F4',
            width: 200,
            padding:10,
            width: 100,
        },
        reject:{
            backgroundColor:'#c94c4c',
            width: 200,
            padding:10,
            width: 100,
            marginLeft: 10,
        },
        approvebuttonContainer: {
          borderRadius: 25, // Customize the border radius as per your preference
          backgroundColor: '#ffffff',
          borderWidth:StyleSheet.hairlineWidth,
          borderColor:'#4285F4',
          color:'#4285F4',
          minWidth: 70,
          paddingVertical: 6,
          paddingHorizontal:7  // Customize the padding
        }, rejectbuttonContainer: {
          borderRadius: 25, // Customize the border radius as per your preference
          backgroundColor: '#ffffff',
          borderWidth:StyleSheet.hairlineWidth,
          borderColor:'#c94c4c',
          color:'#c94c4c',
          minWidth: 70,
          paddingVertical: 6,
          paddingHorizontal:7, // Customize the padding
        },
        approvebuttonText: {
          color: '#4285F4', // Customize the text color
          fontSize: 14, // Customize the text size
          textAlign: 'center', // Customize the text alignment
        },
        rejectbuttonText: {
          color: '#c94c4c', // Customize the text color
          fontSize: 14, // Customize the text size
          textAlign: 'center', // Customize the text alignment
        },
        searchContainer: {
          height: 50,
          marginBottom: 15,
          backgroundColor: COLORS.light,
          borderRadius: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        input: {
          fontSize: 18,
          fontWeight: 'bold',
          flex: 1,
          color: COLORS.dark,
        },
        sortBtn: {
          marginLeft: 10,
          height: 50,
          width: 50,
          borderRadius: 10,
          backgroundColor: '#673AB7',
          justifyContent: 'center',
          alignItems: 'center',
        },
      });

    export default Contacts;
 