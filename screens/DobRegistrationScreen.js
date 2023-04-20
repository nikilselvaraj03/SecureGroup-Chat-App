import { StyleSheet,Image, Text, View , TouchableOpacity, KeyboardAvoidingView, Dimensions} from 'react-native'
//import DatePicker from the package we installed
import DatePicker from 'react-native-datepicker';
import React,{useState} from 'react'

export default function DobRegistrationScreen({route,navigation}) {
  let today = new Date()
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
  today = (dd + '-' + mm + '-' + yyyy);
  const [date_of_birth, setdate_of_birth] = useState(today.toString());
  const [error, setError] = useState('');
  const [isValid,setisValid] =  useState(false)
  const {email,first_name,last_name} = route.params
  const validate = (isSubmit) => {
    error_des=''
    if (new Date(date_of_birth) >= new Date(today)) {
      error_des='Please enter valid date of birth';
      setisValid(false);
    } else if((new Date(today).getFullYear() - new Date(date_of_birth).getFullYear()) < 16) {
      error_des='You must be atleast 16 years to signup for TopDeck';
      setisValid(false);
    } else {
      setisValid(true);
      if(isSubmit) {
        navigation.navigate('PasswordRegistration',{email,first_name,last_name,date_of_birth})
        return
      }
    }
    if(isSubmit) {
      setError(error_des)
  } else{
    setError('')
  }
}
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Enter your date of birth!</Text></View>
      <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View><DatePicker
          style={styles.datePickerStyle}
          date={date_of_birth} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD-MM-YYYY"
          minDate="01-01-1900"
          maxDate="01-01-2090"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              display: 'none',
            },
            dateInput: {
              borderWidth:0,
              borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor:'grey'
            },
          }}
          onDateChange={(date) => {
            setdate_of_birth(date);
            validate(false)
          }}
        />
        {error && (
        <Text style={styles.error}> {error} </Text>
      )}</View>
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
    justifyContent:'center',
    alignItems:'center'
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    width:Dimensions.get('window').width - 90
  },title:{
    fontSize:29,
    fontFamily:'Caveat-Bold',
    minWidth:250,
    color:'#673AB7'
  }, inputContainer: {
    flex:2,
    justifyContent:'flex-start',
    alignItems:'center'
  }, nxtBtn:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginVertical:90,
    padding:10,
    minWidth:150,
    borderWidth:2,
    borderColor:'#673AB7',
    borderRadius:25
  },
  nxtTxt:{
    fontSize:17,
    color:'#673AB7'
  }, datePickerStyle:{
    alignSelf:'center',
    minWidth:250,
    fontSize:28
  }, error:{
    color:'red',
    padding:15,
    fontSize:16,
    textAlign:'center'
  }
})