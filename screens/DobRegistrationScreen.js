import { StyleSheet,Image, Text, View , TouchableOpacity, KeyboardAvoidingView, Dimensions, Platform} from 'react-native'
//import DatePicker from the package we installed
import React,{ useEffect, useState} from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker';
const windowWidth = Dimensions.get('window').width;
export default function DobRegistrationScreen({route,navigation}) {
  let today = new Date()
  const [date_of_birth, setDate_of_birth] = useState(today.toISOString());
  const [showDatePicker,setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [isValid,setisValid] =  useState(false)
  const {email,first_name,last_name} = route.params

  useEffect(()=>{
    validate(false);
  },[date_of_birth,showDatePicker])

  const validate = (isSubmit) => {
    let error_des=''
    let dob = new Date(date_of_birth)
    setisValid(false);
    if (dob >= today) {
      error_des='Please enter valid date of birth'; 
    } else if((today.getFullYear() -  dob.getFullYear()) < 16) {
      error_des='You must be atleast 16 years to signup for TopDeck';
    } else {
      setisValid(true);
      if(isSubmit) {
        navigation.navigate('ProfilePhoto',{email,first_name,last_name,date_of_birth})
        return
      }
    }
    if(isSubmit) {
      setError(error_des)
  } else{
    setError('')
  }
}

function formatDate(date) {
  // Define an array of shorthand month strings
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get month, day, and year from the date object
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date string with leading zeros
  const formattedDay = day.toString().padStart(2, '0');

  // Combine the formatted date components without hyphens
  return `${month}-${formattedDay}-${year}`;
}


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Enter your date of birth!</Text></View>
      <KeyboardAvoidingView style={styles.inputContainer} behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
      <View style={styles.datePickerStyle}>
      <TouchableOpacity style={styles.dateContainer} onPress={()=>{setShowDatePicker(!showDatePicker)}}>
      <Text style={styles.dateFormat} >{formatDate(new Date(date_of_birth))}
      </Text >
      </TouchableOpacity>
        {error && (
        <Text style={styles.error}> {error} </Text>
      )}</View>
      { showDatePicker &&
      <RNDateTimePicker style={styles.rnd} mode="date" display={Platform.OS == 'ios' ?  "spinner" : "calendar"}
       value={new Date(date_of_birth) || new Date()}
       onChange={(event,dates)=>{setDate_of_birth(dates.toISOString());}}
       maximumDate={new Date(today.getFullYear(), today.getMonth(), today.getDate())}
       minimumDate={new Date(1930, 1, 1)}
       dateFormat="month day year"
       positiveButton={{label: 'Confirm', textColor: 'blue'}} ></RNDateTimePicker>}
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
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    minWidth:250,
  },dateContainer:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'gray',
    paddingVertical:15,
    minWidth:250,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
  }, error:{
    color:'red',
    padding:15,
    fontSize:16,
    textAlign:'center',
  },dateFormat:{
    fontSize:24,
    color:'#424242',
  },
  rnd:{
    position:'absolute',
    bottom:0,
  width:windowWidth}
})