import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { auth, db } from "../firebase";
import * as ImagePicker from 'expo-image-picker';
import { groupProfileRef } from '../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import RNDateTimePicker from "@react-native-community/datetimepicker";

import {
  collection,
  doc,
  documentId,
  setDoc,
  getDoc,
  updateDoc,
  getFirestore,
  firestore,
  arrayUnion,
  where,
  getDocs,
  deleteDoc,
  query
} from "firebase/firestore";
import uuid from "uuid";
import { Firestore } from "firebase/app";
// import { doc, getDoc,  } from 'firebase/firestore';

import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  DatePickerIOS,
  ScrollView,
  Switch,
} from "react-native";
import MultiSelect from "react-native-multiple-select";

import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const NewGroupScreen = ({ userToken }) => {
  let navigation = useNavigation();
  // const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState(null);
  const [imageMetaData, setImageMetaData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState (null);
  const [profilePhotoURL, setProfilePhotoURL] =  useState('');
  const [isDisappearingGroup, setIsDisappearingGroup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addData, setAddData] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  // const [participants, setParticipants] = useState([]);


  useEffect (() => {
    (async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(galleryStatus.status ===
    'granted');
    })();
  },[])

  const pickImage = async () => {
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
    }
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
    const uploadTask = uploadBytesResumable(ref(groupProfileRef,generateUniqueFileName(imageMetaData.fileName)), bytes);

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
  // const [userData, setUserData] = useState(null);
  // const [docId, setDocId] = useState("");
  const [userDocs, setUserDocs] = useState([]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  
  const deleteDocsByDate = async (collectionName, date) => {
    // try {
    //   const collectionRef = collection(db,collectionName);
    //   const query = query(collectionRef,where("selectedDate", "==", date));
    //   const snapshot = await getDocs(query);
    //   snapshot.forEach((docu) => {
    //     deleteDoc(doc(db,collectionName,docu.Groupid));
    //   });
    //   return true; // Return true if the documents are successfully deleted
    // } catch (error) {
    //   console.error(error);
    //   return false; // Return false if there's an error
    // }
  };

  const handleCreateGroup = async () => {
    // handle creating a new group with the groupName and groupImage values
    console.log("creating grp");
    const uniqueId = uuid.v4();
    const docRef = await setDoc(doc(db, "Groups", uniqueId), {
      Creationtime: new Date(),
      Groupid: uniqueId,
      Admin: auth.currentUser.uid,
      Name: addData,
      // groupImage: "",
      participants: [auth.currentUser.uid],
      isDisappearingGroup,
      // admin: Auth.currentuser.uid,
      selectedDate: isDisappearingGroup ? selectedDate : null,
      groupPhotoUrl:profilePhotoURL
    }).then(() => {
      console.log("Group created");
      setAddData("");
      alert("Group Created");
    });
    let recors = selectedItems;
    recors.forEach((element) => {
      if (element !== auth.currentUser.uid) {
        // Check if element is not equal to logged in user ID
        const docRefer = updateDoc(doc(db, "users", element), {
          requests: arrayUnion(uniqueId),
        });
      }
    });
    const cuser = auth.currentUser.uid;
    const docRefer1 = updateDoc(doc(db, "users", cuser), {
      groups: arrayUnion(uniqueId),
    });
    setSelectedItems([]);
    setSelectedDate(null);
    setIsDisappearingGroup(false);
  };

  const fetchUserData = async () => {
    const usersCollection = collection(db, "users");
    const usersQuery = query(usersCollection, where("first_name", "!=", "")); // example query to filter documents
    const userDocSnapshots = await getDocs(usersQuery);
    if (!userDocSnapshots.empty) {
      const userIds = userDocSnapshots.docs.map((doc) => doc.id); // array of document IDs
      const userDocRefs = userIds.map((id) => doc(usersCollection, id));

      try {
        const userDocsData = await Promise.all(
          userDocRefs.map((ref) => getDoc(ref))
        );
        setUserDocs(userDocsData.map((doc) => doc.data()));
        console.log(userDocs);
      } catch (error) {
        console.log(
          `Error getting documents with IDs ${userIds.join(", ")}:`,
          error
        );
      }
    } else {
      console.log("No documents found");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const usersCollection = collection(db, "users");
      const usersQuery = query(usersCollection, where("first_name", "!=", "")); // example query to filter documents
      const userDocSnapshots = await getDocs(usersQuery);
      if (!userDocSnapshots.empty) {
        const userIds = userDocSnapshots.docs.map((doc) => doc.id); // array of document IDs
        const userDocRefs = userIds.map((id) => doc(usersCollection, id));

        try {
          const userDocsData = await Promise.all(
            userDocRefs.map((ref) => getDoc(ref))
          );
          setUserDocs(userDocsData.map((doc) => doc.data()));
          console.log(userDocs);
        } catch (error) {
          console.log(
            `Error getting documents with IDs ${userIds.join(", ")}:`,
            error
          );
        }
      } else {
        console.log("No documents found");
      }
    };

    fetchUserData();
    deleteDocsByDate("Groups", new Date());
  }, []);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems(selectedItems);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="black" />
        <View style={styles.header}>
          {/* <TouchableOpacity style={styles.backButton} onPress={navigation.goBack()}>
            <Icon name="chevron-back-outline" size={26} color="#673AB7"></Icon>
            <Text
              style={{
                fontSize: 20,
                color: "#673AB7",
              }}
            >
              Back
            </Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.body}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.groupImageContainer}
              onPress={()=> {pickImage()}}
            >
              
              {profilePhotoURL ? (
                <Image style={styles.groupImage} source={{ uri: profilePhotoURL }} />
              ) : (
                <>
                  <Icon name="image-outline" size={40} color="#919191" />
                </>
              )}
            </TouchableOpacity>
            {/* <Text style={{ marginBottom: 10, textAlign: "center" }}>
              Select Group Profile Image
            </Text> */}
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter group name"
              value={addData}
              onChangeText={(Name) => setAddData(Name)}
            />

            <MultiSelect
              items={userDocs}
              uniqueKey="userId"
              onSelectedItemsChange={setSelectedItems}
              selectedItems={selectedItems}
              selectText="Search participants to add"
              searchInputPlaceholderText="Search options..."
              searchInputStyle={{ borderRadius: 5 }}
              tagRemoveIconColor="#d3d3d3"
              tagBorderColor="#d3d3d3"
              tagTextColor="#d3d3d3"
              selectedItemTextColor="#d3d3d3"
              selectedItemIconColor="#d3d3d3"
              itemTextColor="black"
              displayKey="first_name"
              hideSubmitButton={true}
            />

            <View style={styles.disapper}>
              <Text style={styles.label}>Disappearing Group</Text>
              <Switch
                value={isDisappearingGroup}
                onValueChange={setIsDisappearingGroup}
              />
            </View>
            {isDisappearingGroup ? (
              <RNDateTimePicker
                value={new Date(selectedDate)}
                display={Platform.OS == "ios" ? "spinner" : "calendar"}
                mode="date"
                style={styles.rnd}
                minimumDate={new Date()}
                onChange={(event, date) => handleDateChange(date)}
              />
            ) : (
              ""
            )}

            <TouchableOpacity
              style={styles.createGroupButton}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createGroupButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  disapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  groupImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e5e5e5",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
    color: "#673AB7",
  },
  inputField: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#B388FF",
    backgroundColor: "transparent",
  },
  createGroupButton: {
    backgroundColor: "#673AB7",
    paddingVertical: 10,
    borderRadius: 13,
  },
  createGroupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  rnd: {
    marginBottom: 20,
    marginRight: "auto",
    marginLeft: "auto",
  },
});

export default NewGroupScreen;
