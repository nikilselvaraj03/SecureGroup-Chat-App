import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { auth} from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import Toast from 'react-native-root-toast';
export default function EmailRegistrationScreen() {
    navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [error, setError] = useState('');
    const [isValid, setisValid] = useState(false)

    const validate = async (isSubmit) => {
        error_des = ''
        setisValid(false);
        if (!email) {
            error_des = 'Please input email address.';
        } else if (!email.match(/\S+@\S+\.\S+/)) {
            error_des = 'Please input a valid email address.';
        } else {
            setisValid(true);
            if (isSubmit) {
                sendPasswordResetEmail(auth,email).then(() => {
                    Toast.show('Sent email to reset your password. Please check your inbox.', {
                        duration: Toast.durations.LONG,
                        backgroundColor: '#defabb',
                        textColor: '#008b00',
                        position: -120
                      });
                  })
                  .catch((error) => {
                    error_des = error.message;
                  })
            }
        }
        if(isSubmit) {
            setError(error_des)
        } else{
            setError('')
        }
    }
    useEffect(() => {
        validate(false);
    }, [email])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.signupTitleContainer}><Text style={styles.signupTitle}>Forgot Password?</Text></View>
            <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } style={styles.inputContainer}>
                <View>
                    <Text style={styles.inputTitle}>E-MAIL ADDRESS</Text>
                    <TextInput value={email} autoCapitalize="none" onChangeText={(email) => { setEmail(email); }} style={styles.emailInput}></TextInput>
                    {error && (
                        <Text style={styles.error}> {error} </Text>
                    )}
                </View>
                <TouchableOpacity style={[styles.nxtBtn, { opacity: isValid ? 1 : .6 }]} onPress={() => { validate(true) }}>
                    <Text style={styles.nextBtntTxt}>Send Email</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <View style={styles.linkContainer}>

                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Text style={styles.loginLink}> Click here to Login.</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    signupTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 320
    },
    signupTitle: {
        fontSize: 35,
        fontFamily: 'Caveat-Bold',
        color: '#673AB7',
    },
    inputContainer: {
        flex: 2,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        minWidth: 300
    }, linkContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    inputTitle: {
        color: 'grey'
    }, emailInput: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'grey',
        minWidth: 300,
        minHeight: 50
    },
    nxtBtn: {
        borderWidth: 2,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderColor: '#673AB7',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        minWidth: 130
    }, nextBtntTxt: {
        fontSize: 20,
        color: '#673AB7'
    }, loginLink: {
        color: '#673AB7',
        fontWeight: 'bold'
    }, circle1: {
        height: 250,
        width: 250,
        backgroundColor: '#E8EAF6',
        position: 'absolute',
        top: -60,
        right: -80,
        zIndex: -1,
        transform: [{ rotate: '45deg' }]
    },
    circle2: {
        height: 250,
        width: 250,
        backgroundColor: '#E8EAF6',
        position: 'absolute',
        bottom: -60,
        left: -50,
        borderRadius: 180,
        zIndex: -1,
    }, error: {
        color: 'red',
        paddingTop: 25,
        fontSize: 16,
        alignSelf: 'flex-start'
    }

})