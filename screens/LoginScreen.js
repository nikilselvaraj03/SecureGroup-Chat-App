import { Image,StatusBar, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
// import { auth } from './Firebase';
// import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {
    // const navigation = useNavigation();
    const [email,setEmail] = useState('');
    const [password,setPassword] =  useState('')
    // const handleSignin= () => {
    //     auth.signInWithEmailAndPassword(email,password).then(
            
    //     ).catch(error => {alert(error.message)})
    // }
    // useEffect(() =>{
    //    const unsubscribe = auth.onAuthStateChanged(user => {
    //         if(user) {
    //             navigation.navigate('Home')
    //         }
    //     })
    //     return unsubscribe
    // })
  return (
    <View style={styles.loginContainer}>
     <StatusBar barStyle="light-content" /> 
      <View style={styles.selfAuthContainer}>
        <Text style={styles.title}>Welcome!</Text>
      <KeyboardAvoidingView behavior='padding'>
      <TextInput placeholder='Email' value={email} onChangeText={email => setEmail(email)} style={styles.inputContainer} placeholderTextColor="#fff" />
      <TextInput placeholder='Password' value={password} onChangeText={password => setPassword(password)} secureTextEntry style={styles.inputContainer} placeholderTextColor="#fff"/>
      <TouchableOpacity style={styles.loginButton} onPress={handleSignin}>
        <Text style={styles.loginText}>Sign in</Text>
        <View style={styles.loginImage}>
            <Image source={require('../assets/images/white-right-arrow.png')} style={{width: 20, height: 20,resizeMode : 'contain' }}/>
        </View>
      </TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
      <View style={styles.fbAuthContainer}>
      </View>
      <View style={styles.links}>
        <Text style={styles.registerLink}>Sign up</Text>
        <Text style={styles.forgotLink}>Forgot Password?</Text>
    </View>
    </View>
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
        fontWeight:'bold',
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
        zIndex:10
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
    }, loginText:{
        color:'white',
        fontSize:20,
        fontWeight:'600',
        marginLeft:5
    }, loginImage: {
        backgroundColor:'#6200EA',
        marginLeft:10
    }
})