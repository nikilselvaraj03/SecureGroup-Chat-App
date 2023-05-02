import {TouchableWithoutFeedback, Keyboard, Image,StatusBar,Platform, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {ActivityIndicator} from 'react-native-paper';
import Home from './Home';
const LoginScreen = ({ route, navigationParam }) => {

    const navigation = useNavigation();
    const [email,setEmail] = useState('');
    const [password,setPassword] =  useState('')
    const [isLoading,setisLoading] =  useState(false)
    const [error, setError] = useState('');
    const [isValid,setisValid] =  useState(false);
    const [loggedIn,setLoggedIn] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const {fromSignUp} = route.params;
    if(fromSignUp) {
      auth.currentUser = null;
      auth.signOut()
  }
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => setIsKeyboardOpen(true)
      );
        // Add a touch event listener to the root view
        const hideKeyboardOnPress = Keyboard.addListener('keyboardDidHide', () => {
          Keyboard.dismiss();
          setIsKeyboardOpen(false)
        });
        

        // Clean up the event listener on unmount
        return () => {
          hideKeyboardOnPress.remove();
        };
      }, [route.params]);

    const handleSignin= () => {
            setisLoading(true);
            signInWithEmailAndPassword(auth,email,password).then((userCred)=>{
            setisLoading(false);
            if(userCred && userCred.user && userCred.user.uid) {
                setLoggedIn(true);
            }
        }
            ).catch(error => {
                setisLoading(false);
                let error_msg = error.message.toString();
                if(error_msg.includes('wrong-password') || error_msg.includes('user-not-found')) {
                    error_msg = "Incorrect email address or password.";
                }
                setError(error_msg)})
        }
        const handleSignUpClick = () => {
            navigation.navigate('SignUp')
        }
    
      function validate(isSubmit) {
        error_des=''
        setisValid(false);
        if(!email && !password){
          error_des='Please provide email and password to continue.';
        }
        else if (!email) {
          error_des='Please input email address.';
        } else if (!email.match(/\S+@\S+\.\S+/)) {
          error_des='Please input a valid email address.';
        } else if (!password) {
            error_des='Please input the password to login.';
        } else {
            setisValid(true);
            if(isSubmit){
                handleSignin()
            }
        }
        if(isSubmit) {Keyboard.dismiss();
            setError(error_des)} else{
              setError('')
          }

      }
    return (loggedIn && auth.currentUser && auth.currentUser.uid ?
     <Home userToken={auth.currentUser} /> :
      (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginContainer}>
        <StatusBar translucent={true} style="light"></StatusBar> 
          <View style={styles.selfAuthContainer}>
            <Text style={styles.title}>Welcome!</Text>
          <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
          <TextInput placeholder='Email'  softwareKeyboardLayoutMode="pan" autoCapitalize="none" blurOnSubmit={true} onSubmitEditing={()=>validate(false)} value={email} onChangeText={email => setEmail(email)} style={styles.inputContainer} placeholderTextColor="#fff" />
          <TextInput placeholder='Password' value={password} onChangeText={password => setPassword(password)} secureTextEntry style={styles.inputContainer} placeholderTextColor="#fff"/>
          { (
            <Text style={error ? styles.error : styles.hidden_error}> {error} </Text>)}
          <TouchableOpacity style={[styles.loginButton, isLoading ? styles.disabledLogin : '']} onPress={() => validate(true)}>
          <View style={styles.loginImage}>
            {(isLoading) ? <ActivityIndicator size="small" color="#ffffff" /> :
            <Image source={require('../assets/images/white-right-arrow.png')} style={{width: 20, height: 20,resizeMode : 'contain' }}/>
             }
            </View>
            <Text style={styles.loginText}>Sign in</Text>
          </TouchableOpacity>
          </KeyboardAvoidingView>
          </View>
          {Platform.OS == 'android' && !isKeyboardOpen && (<View style={styles.fbAuthContainer}>
          </View> )}
          {Platform.OS == 'android' && !isKeyboardOpen && (
          <View style={styles.links}>
            <TouchableOpacity onPress={handleSignUpClick}><Text style={styles.registerLink}>Sign up</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('PasswordReset')}}><Text style={styles.forgotLink}>Forgot Password?</Text></TouchableOpacity>
        </View>)}

        {Platform.OS == 'ios' && (<View style={styles.fbAuthContainer}>
          </View> )}
          {Platform.OS == 'ios' && (
          <View style={styles.links}>
            <TouchableOpacity onPress={handleSignUpClick}><Text style={styles.registerLink}>Sign up</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('PasswordReset')}}><Text style={styles.forgotLink}>Forgot Password?</Text></TouchableOpacity>
        </View>)}
        </View></TouchableWithoutFeedback>)
      )
    }
    
    export default LoginScreen
    
    const styles = StyleSheet.create({
        loginContainer:{
            paddingTop:StatusBar.currentHeight,
            flex:1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            color:'gray',
            backgroundColor:'#673AB7',
            marginBottom:0
        },
        selfAuthContainer:{
            paddingTop:0,
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center'
        },
        fbAuthContainer:{
            flex:1,
            alignItems:'center',
            justifyContent:'space-around',
            backgroundColor:'#ffffff',
            width:windowWidth,
            transform : [ { scaleX : 2} ],
            borderTopStartRadius : 200,
            borderTopEndRadius : 200,
        },
        title:{
            color:'white',
            fontSize:45,
            paddingBottom:60,
            marginLeft:10,
            fontFamily:'Caveat',
            alignSelf:'flex-start'
        },links:{
            position:'absolute',
            bottom:70,
            minWidth:300,
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center',
            zIndex:0
        },
        inputContainer:{
            minWidth:300,
            minHeight:50,
            backgroundColor:'transparent',
            borderBottomWidth:StyleSheet.hairlineWidth,
            borderColor:'#B388FF',
            margin:15,
            padding:10,
            color:'white'
        },
        registerLink:{
            color:'#673AB7',
            textDecorationLine:'underline',
            fontWeight:'bold',
            marginTop:10,
            fontSize:18
        },forgotLink:{
            color:'#673AB7',
            textDecorationLine:'underline',
            fontWeight:'bold',
            marginTop:10,
            fontSize:18
        },loginButton:{
            alignSelf:'flex-end',
            marginTop:35,
            marginRight:15,
            backgroundColor:'#6200EA',
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center',
            padding:10,
            borderRadius:50,
        }, disabledLogin:{
            backgroundColor:'#B39DDB'
        }, loginText:{
            color:'white',
            fontSize:20,
            fontWeight:'600',
            marginLeft:10,
            marginRight:10
        }, loginImage: {
            marginLeft:5,
            width:20,
            height:20
        }, error:{
            color:'#F18F01',
            padding:15,
            fontSize:17,
            textAlign:'center',
            fontWeight:'500'
          }
    })