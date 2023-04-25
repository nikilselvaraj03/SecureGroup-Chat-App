import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, StyleSheet,TouchableOpacity, TextInput, } from 'react-native';
import {Avatar, Title, Caption,TouchableRipple} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';




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


  const handleEditPress = () => {
    setIsEditing(true); // Enable editing mode
    setEditedFirstName(firstName);
    setEditedLastName(LastName);
    setEditeddob(formattedDob);

  };
  const handleSavePress = () => {
    setIsEditing(false);
    setFirstName(editedFirstName); // Disable editing mode
    setLastName(editedLastName);
    setDob(editeddob);
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

        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'column', marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
            <Avatar.Image
              source={userinfo && userinfo.profile_photo_url ? {uri:userinfo.profile_photo_url}: require('../assets/images/minions.jpeg')} size={120}
             />
             <View style={{marginLeft: 10}}>
              <Title style={[styles.title, {
                marginTop:15, marginBottom:5, color:'white'
              }]}>{userinfo.first_name} {userinfo.last_name}</Title>
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
          <FontAwesome name="envelope-o"  size={25} color='#673AB7' />
          <Text style={[
                styles.menuItemText
              ]}>{userinfo.email}</Text>
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

        <View style={styles.menuItem}>
          <FontAwesome name="map-marker"  size={25} color='#673AB7'/>
          <Text style={[
                styles.menuItemText
              ]}>CST-unitedStates</Text>
        </View>
        </View>
        <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={isEditing ? handleSavePress : handleEditPress}>
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
        </View>

    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuContainer: {
    margin:25
  },
  userInfoSection: {
    backgroundColor: '#d5c8ed',
    paddingHorizontal: 30,
    marginBottom: 25,
    paddingBottom:10,

  },
  label: {
    fontSize: 15,
    marginLeft: 15,
    marginTop: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonContainer: {
    borderRadius: 25, // Customize the border radius as per your preference
    backgroundColor: '#673AB7',
    width: 100,
    marginTop: 30, // Customize the background color
    marginLeft: '35%',
    paddingVertical: 10, // Customize the padding
    paddingHorizontal: 12, // Customize the padding
  },
  buttonText: {
    color: 'white', // Customize the text color
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
  registerLink:{
    color:'#673AB7',
    textDecorationLine:'underline',
    fontWeight:'bold',
    marginTop:10,
    fontSize:18
},
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  forgotLink:{
    color:'#673AB7',
    textDecorationLine:'underline',
    fontWeight:'bold',
    marginTop:10,
    fontSize:18
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