import { StyleSheet, Text, View,TouchableOpacity,Image,SafeAreaView,ActivityIndicator,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
import * as ImagePicker from 'expo-image-picker';
export default function ProfilePhoto({route,navigation}) {
  const [image, setImage] = useState(null);
  const [imageMetaData, setImageMetaData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState (null);
  const [profilePhotoURL, setProfilePhotoURL] =  useState('');
  const {email,first_name,last_name,date_of_birth} = route.params
  useEffect (() => {
    (async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(galleryStatus.status ===
    'granted');
    })();
  },[])
  const pickImage = async () => {
    if(hasGalleryPermission) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageMetaData(result.assets[0])
      uploadImage()
    }}
  };
  
  const uniqueName = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }
  
    function generateUniqueFileName(filename) {
      // Get the file extension.
      const extension = filename.split('.')[1];
    
      // Generate a UUID.
      const uuid = uniqueName();
    
      // Return the file name with the UUID and extension.
      return `${uuid}.${extension}`;
    }
  
    const uploadImage = async () => {
      if(profilePhotoURL) {
        // await deleteObject(profilePhotoURL)
      }
      if (!image) {
        return;
      } 
      const img = await fetch(image)
      const bytes = await img.blob();
      setUploading(true);
      const uploadTask = uploadBytesResumable(ref(userProfileRef,generateUniqueFileName(imageMetaData.fileName)), bytes);
  
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          setUploading(false)
          console.log(error)
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setProfilePhotoURL(downloadURL)
          });
          setUploading(false)
        }
      );
      
    };
    
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.heading}>
      <Text style={styles.headingText}>Set your profile picture!</Text>
    </View>
    <View style={styles.uploadButton}>
    <TouchableOpacity style={uploading? styles.uploadingImage : styles.profileImage} onPress={()=> {pickImage()}}>
       <ActivityIndicator size="small" color="#ffffff"  style={uploading ? styles.loadingIndicator : styles.loadingIndicatorHidden}/>
    <Image source={profilePhotoURL ? {uri: profilePhotoURL } : require('../assets/images/uploadprofphoto.png')} style={[{ width:200, height:200}, profilePhotoURL ? styles.roundBorderRadius :  styles.noBorderRadius]}/>
    </TouchableOpacity>
    { <Text style={ profilePhotoURL ? styles.profileText : styles.emptyText}>Looking Good {first_name}</Text>}
    </View>
    <View style={styles.nextContainer}>
    <TouchableOpacity  style={styles.nxtBtn} onPress={()=> {navigation.navigate('PasswordRegistration',{email,first_name,last_name,date_of_birth,profilePhotoURL});}}>
        <Image source={require('../assets/images/purple-right-arrow.png')} style={{width: 20, height: 20,resizeMode : 'contain'}}/>
        <Text style={styles.nxtTxt}>Next</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'

  },
  heading:{
    flex:1,
    justifyContent:'space-around',
    alignItems:'flex-start',
    width:Dimensions.get('window').width - 90
  },
  headingText:{
    fontSize:29,
    fontFamily:'Caveat-Bold',
    minWidth:250,
    color:'#673AB7'
  },
  uploadButton:{
    flex:2,
    justifyContent:'space-around',
    alignItems:'center'
  },
  profileImage:{
    
  },uploadingImage:{
    
    opacity:.0
  }, loadingIndicator:{
    position:'relative',
    zIndex:10,
    right:0,
    bottom:-100,
    opacity:1
  },loadingIndicatorHidden:{
    position:'relative',
    zIndex:10,
    right:0,
    bottom:-100,
    opacity:0
  },nextContainer:{
    flex:1,
    justifyContent:'flex-start'
  },  nxtBtn:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginVertical:90,
    padding:10,
    minWidth:120,
    borderWidth:2,
    borderColor:'#673AB7',
    borderRadius:25
  },
  nxtTxt:{
    fontSize:17,
    color:'#673AB7'
  },profileText:{
    fontSize:29,
    fontFamily:'Caveat-Bold',
    minWidth:250,
    color:'#424242',
    textAlign:'center'
  },
  emptyText:{
    minHeight:30,
    minWidth:250,
    opacity:0
  },
  roundBorderRadius:{
    borderRadius:150
  },
  noBorderRadius:{
    borderRadius:0
  }
})