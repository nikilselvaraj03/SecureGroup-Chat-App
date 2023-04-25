import { StyleSheet, Keyboard, TextInput, Text, View, TouchableOpacity, KeyboardAvoidingView, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-root-toast';
export default function PasswordRegistrationScreen({ route, navigation }) {

  const { email, first_name, last_name, date_of_birth, profilePhotoURL } = route.params
  const [password, setPassword] = useState('');
  const [reenterPassword, setrenterPassword] = useState('');
  const [error, setError] = useState('');
  const [isValid, setisValid] = useState(false)
  const [loading, setLoading] = useState(false);

  const validate = (isSubmit) => {
    error_des = '';
    setisValid(false);
    if (!password && !reenterPassword) {
      error_des = 'Please fill in the password fields';
      
    }
    else if (!password) {
      error_des = 'Please input your password';
    } else if(password.length < 8 || password.length > 16) {
      error_des = 'Password length should atleast be 8 characters long';
    } 
    else if (!reenterPassword) {
      error_des = 'Please renter you password';
    } else if (password.toString() !== reenterPassword.toString()) {
      error_des = 'Password does not match.'
    }
    else {
      setisValid(true);
      if (isSubmit) {
        Keyboard.dismiss();
        setLoading(true)
        handleSignup();
        return;
      }
    }
    if (isSubmit) {
      setError(error_des);
    } else { setError('') }
  }

  handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password.toString()).then(async (userCred) => {
      console.log('User account created & signed up!');
      try {

        const docRef = await setDoc(doc(db, "users", userCred.user.uid), {
          email: email,
          first_name: first_name,
          last_name: last_name,
          date_of_birth: date_of_birth,
          userId: userCred.user.uid,
          profile_photo_url : profilePhotoURL
        }).then(() => {
          console.log("Document written with ID: ", userCred.user.uid);
          Toast.show('Signup for TopDeck Successful.', {
            duration: Toast.durations.LONG,
            backgroundColor: '#defabb',
            textColor: '#008b00',
            position: -120
          });
          setLoading(false)
          navigation.navigate('Login',{fromSignup:true})
        }
        )
      } catch (e) {
        console.error("Error adding document: ", e);
        setLoading(false)
      }
    }).catch(error => {
      setLoading(false)
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
  }

  useEffect(()=>{
    validate(false);
  },[password,reenterPassword])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Choose a password for your account!</Text></View>
      <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.inputTitle}>PASSWORD</Text>
        <TextInput secureTextEntry maxLength={16} style={styles.input} value={password} onChangeText={(password) => { setPassword(password); }} />
        <Text style={styles.inputTitle}>RE-ENTER PASSWORD</Text>
        <TextInput secureTextEntry  maxLength={16} style={styles.input} value={reenterPassword} onChangeText={(repswd) => { setrenterPassword(repswd); }}/>
        {error && (
          <Text style={styles.error}> {error} </Text>)}
        <TouchableOpacity style={[styles.signupBtn, { opacity: isValid ? 1 : .6 }, (loading) ? styles.signupLoading : '']} onPress={() => { validate(true); }}>
          {(loading) ? <ActivityIndicator size="small" color="#673AB7" /> : null}
          <Text style={styles.signupTxt}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: Dimensions.get('window').width - 90
  }, title: {
    fontSize: 35,
    fontFamily: 'Caveat-Bold',
    minWidth: 250,
    color: '#673AB7'
  }, inputContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 300
  }, signupBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 90,
    padding: 10,
    minWidth: 150,
    borderWidth: 2,
    borderColor: '#673AB7',
    borderRadius: 25
  }, signupLoading: {
    justifyContent: 'space-around'
  },
  signupTxt: {
    fontSize: 17,
    color: '#673AB7'
  },
  inputTitle: {
    alignSelf: 'flex-start',
    color: 'grey',
    marginVertical: 10
  }, input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
    minWidth: 300,
    minHeight: 30,
    marginBottom: 40,
  }, error: {
    color: 'red',
    padding: 15,
    fontSize: 16,
    textAlign: 'center'
  }
})