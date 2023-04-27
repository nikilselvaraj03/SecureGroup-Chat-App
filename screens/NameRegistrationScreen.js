import { KeyboardAvoidingView,Image,Platform, StyleSheet,StatusBar, Text, TouchableOpacity, View, Dimensions, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import BouncingBall from './BouncingBall'
export default function NameRegistrationScreen({route,navigation}) {
  const [first_name,setfirst_name] = useState('');
  const [last_name,setlast_name] = useState('');
  const [error, setError] = useState('');
  const [isValid,setisValid] =  useState(false)
  const {email} = route.params; 

  const validate = (isSubmit) => {
    error_des = ''
    if (!first_name && !last_name) {
      error_des='Please input FirstName and LastName';
      setisValid(false);
    }
    else if (!first_name) {
      error_des='Please input FirstName';
      setisValid(false);
    }
     else if (!last_name) {
      error_des='Please input LastName';
      setisValid(false);
    }
    else {
        setisValid(true);
        if(isSubmit) {
          Keyboard.dismiss()
          navigation.navigate('DobRegistration',{email,first_name,last_name});
          return;
        }
    }
    if(isSubmit) {Keyboard.dismiss();
    setError(error_des)} else{
      setError('')
  }
}

useEffect(()=>{
  validate(false);
},[first_name,last_name])

  return (
    <View style={styles.container}>
      <BouncingBall
          amount={4}
          animationDuration={5000}
          minSpeed={30}
          maxSpeed={200}
          minSize={100}
          maxSize={100}
          useNativeDriver={false}
          style={{
            backgroundColor: '#E8EAF6',
            zIndex:1
          }}
         />
      <StatusBar barStyle="dark-content"></StatusBar>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>What's your name?</Text>
      </View>
      <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } style={styles.nameContainer}>
      <Text style={styles.inputTitle}>FIRST NAME</Text>
      <TextInput style={styles.input} onChangeText={(firstName)=>{setfirst_name(firstName);}} maxLength={20} autoFocus={true}></TextInput>
      <Text style={styles.inputTitle}>LAST NAME</Text>
      <TextInput style={styles.input} onChangeText={(lastName)=>{setlast_name(lastName);}} maxLength={20}></TextInput>
      {error && (
        <Text style={styles.error}> {error} </Text>
      )}
      <TouchableOpacity  style={[styles.nxtBtn,{opacity:isValid ? 1 : .6}]} onPress={()=> {validate(true);}}>
        <Image source={require('../assets/images/purple-right-arrow.png')} style={{width: 20, height: 20,resizeMode : 'contain'}}/>
        <Text style={styles.nxtTxt}>Next</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:StatusBar.currentHeight
  },backBtn:{
    minHeight:40,
    width:Dimensions.get('window').width,
    alignSelf:'flex-start',
    fontWeight:'bold',
    marginLeft:25,
    marginTop:100
  },
  nameContainer:{
    minWidth:300,
    flex:2,
    alignItems:'center'
  },
  titleContainer:{flex:1,justifyContent:'center'},
  title:{
    fontSize:29,
    fontFamily:'Caveat-Bold',
    marginVertical:40,
    color:'#673AB7',
    alignSelf:'flex-start',
    minWidth:300
  },inputTitle:{
    alignSelf:'flex-start',
    color:'grey'
  },input:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'grey',
    minWidth:300,
    minHeight:30,
    marginBottom:40
  },nxtBtn:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginVertical:50,
    padding:10,
    minWidth:150,
    borderWidth:2,
    borderColor:'#673AB7',
    borderRadius:25
  },
  nxtTxt:{
    fontSize:17,
    color:'#673AB7'
  }, error:{
    color:'red',
    marginVertical:15,
    fontSize:16,
    alignSelf:'flex-start'
  }
})