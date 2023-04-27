import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View,Image, Text, SafeAreaView, StyleSheet,TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, } from 'react-native';
import {Avatar, Title, Caption,TouchableRipple, ActivityIndicator} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { collection, doc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';




const ProfilePage = ({userinfo}) => {
  let dateformat = userinfo.date_of_birth; // Assuming userinfo.date_of_birth is '1997-04-25T05:00:00.000Z'

  const yyyy = dateformat.substring(0, 4);
  const mm = dateformat.substring(5, 7);
  const dd = dateformat.substring(8, 10);
  const formattedDob = `${yyyy}-${mm}-${dd}`;

  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userinfo.first_name);
  const [editedFirstName, setEditedFirstName] = useState(''); 
  const [LastName, setLastName] = useState(userinfo.last_name);
  const [editedLastName, setEditedLastName] = useState(''); 
  const [dob, setDob] = useState(userinfo.date_of_birth);
  const [editeddob, setEditeddob] = useState(''); 
  const [isSigningOut,setIsSigningOut] = useState(false)


  const handleEditPress = () => {
    setIsEditing(true); // Enable editing mode
    setEditedFirstName(firstName);
    setEditedLastName(LastName);
    setEditeddob(formattedDob);

  };
  function validate(){
    let isValid = true;
    let error_des = ''
    if (!editedFirstName && !editedLastName  && !editeddob) {
      error_des='Please input all the required fields';
      isValid = false;
    }
    else if (!editedFirstName && !editedLastName) {
      error_des='Please input FirstName and LastName';
      isValid = false;
    }
    else if (!editedFirstName) {
      error_des='Please input FirstName';
      isValid = false;
    }
     else if (!editedLastName) {
      error_des='Please input LastName';
      isValid = false;
    } else if (!editeddob) {
      error_des='Please input your Birth date';
      isValid = false;
    } 
    if(!isValid) {
      alert(error_des)
    }
    return isValid
  }
  const handleSavePress = async () => {
    if(validate()){
    setIsEditing(false);
    setFirstName(editedFirstName); // Disable editing mode
    setLastName(editedLastName);
    setDob(editeddob);
    const userDocRef = doc(db, "users", userinfo.userId);
    await updateDoc(userDocRef, {
      first_name:editedFirstName,
      last_name:editedLastName,
      date_of_birth:editeddob
    })}
  };

  const handleCanclePress = () => {
    setIsEditing(false);
    setFirstName(firstName); // Disable editing mode
    setLastName(LastName);
    setDob(dob);
  };

  const handleSignOut = () => {
    setIsSigningOut(true)
    signOut(auth).then(() => {
      setTimeout(()=>{setIsSigningOut(false);navigation.navigate('Login')},800)
      
      
    }).catch((error) => {
      setIsSigningOut(false)
    });
  };
  


  const handleInputChange = (value) => {
    setEditedFirstName(value);

  };
  const handleInputChangeLast = (value) => {
    setEditedLastName(value);
  };
  const handleInputChangedob = (value) => {
    setEditeddob(value);
  };

  return(
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 30, justifyContent: 'left', alignItems: 'left'}}>
            <Avatar.Image style={{backgroundColor:'#eaeaea'}}
              source={userinfo && userinfo.profile_photo_url ? {uri:userinfo.profile_photo_url} : require('../assets/images/avatarperson.png')} size={120}/>
             <View style={{marginLeft: 20}}>
              <Title style={[styles.title, {
                marginTop:35, marginBottom:5
              }]}>{userinfo.first_name} {userinfo.last_name}</Title>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={isEditing ? handleSavePress : handleEditPress}>
                  <FontAwesome name="edit"  size={25} color='#673AB7' paddingRight={8}/>
                  <Text>{isEditing ? 'Edit Profile' : 'Edit Profile'}</Text>
              </TouchableOpacity>
             </View>
          </View>
        </View>
    <View style={styles.menuContainer}>
      <View style={styles.menuItem}>
      <FontAwesome name="user"  size={25} color='#673AB7' />
      {
        isEditing ? (
          <View style={{flexDirection: 'row'}}>
         <Text style={styles.label}>First Name:</Text>
          <TextInput            
          placeholder="First Name"
          placeholderTextColor="#666666"
          value={editedFirstName}
          onChangeText={handleInputChange}
          autoCorrect={true}
          style={[
            styles.menuItemText
          ]}
        />
        </View>
        ) :(
          <Text style={[
            styles.menuItemText
          ]}>{firstName}</Text>
        )
      }

        </View>


        <View style={styles.menuItem}>
          <FontAwesome name="user-o"  size={25} color='#673AB7' />
          {
            isEditing ? (
              <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Last Name:</Text>
              <TextInput
              placeholder="Last Name"
              placeholderTextColor="#666666"
              value={editedLastName}
              onChangeText={handleInputChangeLast}
              autoCorrect={false}
              style={[
                styles.menuItemText
              ]}
            />
            </View>
            ) :(
              <Text style={[
                styles.menuItemText
              ]}>{LastName}</Text>
            )
          }
    
        </View>


        <View style={styles.menuItem}>
          <FontAwesome name="calendar"  size={25} color='#673AB7' />
          {
            isEditing ? (
              <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>YYYY-MM-DD:</Text>
              <TextInput
              placeholder="Date-Of-Birth"
              placeholderTextColor="#666666"
              value={editeddob}
              onChangeText={handleInputChangedob}
              autoCorrect={false}
              style={[
                styles.menuItemText
              ]}
            />
            </View>
            ) : (
              <Text style={[
                styles.menuItemText
              ]}>{formattedDob}</Text>
            )
          }
    
        </View>

        <View style={[styles.menuItem, isEditing ?  styles.disabledMedniItem: '']}>
          <FontAwesome name="envelope-o"  size={25} color='#673AB7' />
          <Text style={[
                styles.menuItemText
              ]}>{userinfo.email}</Text>
        </View>

        <View style={[styles.menuItem, isEditing ?  styles.disabledMedniItem: '']}>
          <FontAwesome name="map-marker"  size={25} color='#673AB7'/>
          <Text style={[
                styles.menuItemText
              ]}>CST-unitedStates</Text>
        </View>
        </View>
        <View>
      {isEditing ? (
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSavePress} >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButtonContainer} onPress={handleCanclePress}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.signoutButtonContainer} onPress={handleSignOut}>
          { isSigningOut ? <ActivityIndicator size="small" color="#ffffff" style={{width: 18, height: 18,resizeMode : 'contain' }}/> :
    <Image source={require('../assets/images/signout.png')} style={{width: 18, height: 18,resizeMode : 'contain' }}/> }
    
      <Text style={styles.signoutButtonText}>Signout</Text>
    </TouchableOpacity>
      )}
    
    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  menuContainer: {
    margin:25
  },
  userInfoSection: {
    // backgroundColor: '#dbd8e3',
    paddingHorizontal: 30,
    marginBottom: 25,
    paddingBottom:20,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,

  },
  label: {
    fontSize: 15,
    marginLeft: 15,
    marginTop: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#757a79',

  },
  signoutButtonContainer: {
    alignSelf:'center',
    flexDirection:'row',
    borderRadius: 25, // Customize the border radius as per your preference
    backgroundColor: '#673AB7',
    width: 140,
    marginTop: 30,
    paddingVertical: 10, // Customize the padding
    paddingHorizontal: 12,
    justifyContent:'space-around' // Customize the padding
  },
  signoutButtonText: {
    color: 'white', // Customize the text color
    fontSize: 18, // Customize the text size
    textAlign: 'center', // Customize the text alignment
  },
  saveButtonContainer: {
    borderRadius: 25, // Customize the border radius as per your preference
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#689f38',
    width: 100,
    marginTop: 30, // Customize the background color
    marginLeft: 60,
    paddingVertical: 10, // Customize the padding
    paddingHorizontal: 12, // Customize the padding
  },
  saveButtonText: {
    color: '#689f38', // Customize the text color
    fontSize: 18, // Customize the text size
    textAlign: 'center', // Customize the text alignment
  },
  cancelButtonContainer: {
    borderRadius: 25, // Customize the border radius as per your preference
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#d50000',
    width: 100,
    marginTop: 30, // Customize the background color
    marginLeft: 60,
    paddingVertical: 10, // Customize the padding
    paddingHorizontal: 12, // Customize the padding
  },
  cancelButtonText: {
    color: '#d50000', // Customize the text color
    fontSize: 18, // Customize the text size
    textAlign: 'center', // Customize the text alignment
  },
  caption: {
    fontSize: 18,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
    alignContent:'center'
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.5,
  }, disabledMedniItem:{
    opacity:.4
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginLeft:20,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
  //   marginTop: Platform.OS === 'ios' ? 0 : -12,
  marginTop: -8,
  paddingLeft: 10,
  marginLeft: 10,
  color: 'black',
  fontSize: 20,
  },
  menuItemText: {
    color: 'black',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    // lineHeight: ,
  },
});

export default ProfilePage;