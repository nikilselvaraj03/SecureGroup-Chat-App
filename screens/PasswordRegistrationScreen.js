import { StyleSheet,Image,TextInput, Text, View , TouchableOpacity, KeyboardAvoidingView, Dimensions} from 'react-native'
import React,{useState} from 'react'
import {auth,db,app} from '../firebase'
import { collection, addDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
export default function PasswordRegistrationScreen({ route, navigation }) {
  const {email,first_name,last_name,date_of_birth} = route.params
  const [password,setPassword] = useState('');
  const [reenterPassword, setrenterPassword] = useState('');
  const [error, setError] = useState('');
  const [isValid,setisValid] =  useState(false)
  const validate = (isSubmit) => {
    error_des = '';
    if (!password && !reenterPassword) {
      error_des='Please fill in the password fields';
      setisValid(false);
    }
    else if (!first_name) {
      error_des='Please input your password';
      setisValid(false);
    }
     else if (!last_name) {
      error_des='Please renter you password';
      setisValid(false);
    } else if(password.toString() !== reenterPassword.toString()) {
        error_des='Password does not match.'
        setisValid(false);
    }
    else {
        setisValid(true);
        if(isSubmit) {
          handleSignup();
          return;
        }
    }
    if(isSubmit) { 
      Keyboard.dismiss();
      setError(error_des);

    } else{setError('')}
}
  handleSignup = () => {
    createUserWithEmailAndPassword(auth,email, password.toString()).then(async () => {
    console.log('User account created & signed in!');
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email:email,
        first_name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }).catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Choose a password for your account!</Text></View>
      <Text>{password}</Text>
      <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.inputTitle}>PASSWORD</Text>
      <TextInput  secureTextEntry style={styles.input} value={password} onChangeText={(password)=>{setPassword(password);}} onSubmitEditing={()=>validate(false)}/>
      <Text style={styles.inputTitle}>RE-ENTER PASSWORD</Text>
      <TextInput  secureTextEntry style={styles.input} value={reenterPassword} onChangeText={(repswd)=>{setrenterPassword(repswd);}} onSubmitEditing={()=>validate(false)}/>
      {error && (
        <Text style={styles.error}> {error} </Text> )}
      <TouchableOpacity style={[styles.signupBtn,{opacity:isValid ? 1 : .6}]} onPress={()=> {validate(true);}}>
        <Text style={styles.signupTxt}>Signup</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    width:Dimensions.get('window').width - 90
  },title:{
    fontSize:35,
    fontFamily:'Caveat-Bold',
    minWidth:250,
    color:'#673AB7'
  }, inputContainer: {
    flex:2,
    justifyContent:'flex-start',
    alignItems:'center',
    minWidth:300
  }, signupBtn:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:90,
    padding:10,
    minWidth:150,
    borderWidth:2,
    borderColor:'#673AB7',
    borderRadius:25
  },
  signupTxt:{
    fontSize:17,
    color:'#673AB7'
  },
  inputTitle:{
    alignSelf:'flex-start',
    color:'grey',
    marginVertical:10
  },input:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'grey',
    minWidth:300,
    minHeight:30,
    marginBottom:40,
  },error:{
    color:'red',
    padding:15,
    fontSize:16,
    textAlign:'center'
  }
})