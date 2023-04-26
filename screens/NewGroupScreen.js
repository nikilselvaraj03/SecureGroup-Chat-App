import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import * as firebase from "../firebase";

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
  query,
  where,
  getDocs,
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

import { launchImageLibrary } from "react-native-image-picker";

import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const NewGroupScreen = ({ userToken }) => {
  let navigation = useNavigation();
  // const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [isDisappearingGroup, setIsDisappearingGroup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addData, setAddData] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  // const [participants, setParticipants] = useState([]);

  // const [userData, setUserData] = useState(null);
  // const [docId, setDocId] = useState("");
  const [userDocs, setUserDocs] = useState([]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

// 

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel && !response.error) {
          setGroupImage(response.uri);
        }
      }
    );
  };
  

   const deleteDocsByDate = async (collectionName, date) => {
    try {
      const collectionRef = db.collection(collectionName);
      const query = collectionRef.where('selectedDate', '==', date);
      const snapshot = await query.get();
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return true; // Return true if the documents are successfully deleted
    } catch (error) {
      console.error(error);
      return false; // Return false if there's an error
    }
  }

  const handleCreateGroup = async () => {
    // handle creating a new group with the groupName and groupImage values
    console.log("creating grp");
    const uniqueId = uuid.v4();
    const docRef = await setDoc(doc(db, "Groups", uniqueId), {
      Creationtime: new Date(),
      Groupid: uniqueId,
      Name: addData,
      // groupImage: "",
      // participants: selectedItems,
      admin: 34,
      isDisappearingGroup,
      // admin: Auth.currentuser.uid,
      selectedDate: isDisappearingGroup ? selectedDate : null,
    }).then(() => {
      console.log("Group created");
      setAddData("");
    });
    let recors = selectedItems;
    recors.forEach((element) => {
      const docRefer = updateDoc(doc(db, "users", element), {
        requests: arrayUnion(uniqueId),
      });
    });
    setSelectedItems([]);
    setSelectedDate(null);
    setIsDisappearingGroup(false);

    // isDisappearingGroup:false
  };

  // useEffect(() => {
  //   // setDocId(documentIdInput)
  //   const fetchUserData = async () => {
  //     // const userDocRef = doc(db, 'users');

  //     // const colRef = collection(db, "users");
  //     // const userDocRef = await getDocs(colRef);
  //     const snapshot = await firebase.firestore().collection('users').get()
  //     console.log("heyy",snapshot);
  //     // try {
  //     //   const docSnapshot = await getDoc(userDocRef);
  //     //   if (docSnapshot.exists()) {
  //     //     setUserData(docSnapshot.data());
  //     //     console.log(userData);
  //     //     // const arr =[userData.first_name];
  //     //   } else {
  //     //     console.log('No such document!');
  //     //   }
  //     // } catch (error) {
  //     //   console.log('Error getting document:', error);
  //     // }
  //   };
  //   fetchUserData();
  // }, []);

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
    deleteDocsByDate('Groups', new Date());
  }, []);

  // useEffect(() => {

  //   async function fetchUserInfo() {

  //     try {
  //       const snapshot = await firebase.firestore().collection('users').get()
  //       console.log(snapshot);
  //   } catch (error) {
  //       console.log(error);
  //   }
  //   }

  //   fetchUserInfo();
  // })

  // async function fetchParticipants(participantIds) {
  //   const participantNames = [];
  //   for (const userId of participantIds) {
  //     const docRef = doc(db, "users", userId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       const participant = docSnap.data();
  //       participantNames.push(participant.first_name);
  //     } else {
  //       console.log("No such document!");
  //     }
  //   }
  //   setParticipants(participantNames);
  // }

  // const options = [
  //   { id: 1, name: "Option 1" },
  //   { id: 2, name: "Option 2" },
  //   { id: 3, name: "Option 3" },
  //   { id: 4, name: "Option 4" },
  // ];

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems(selectedItems);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="black" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back-outline" size={26} color="#673AB7"></Icon>
          <Text
            style={{
              fontSize: 20,
              color: "#673AB7",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.groupImageContainer}
            onPress={handleImagePicker}
          >
            {groupImage ? (
              <Image style={styles.groupImage} source={{ uri: groupImage }} />
            ) : (
              <>
                <Icon name="image-outline" size={40} color="#919191" />
              </>
            )}
          </TouchableOpacity>
          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            Select Group Profile Image
          </Text>
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
    backgroundColor: "#d3d3d3",
  },
  header: {
    height: 50,
    backgroundColor: "#d3d3d3",
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
  },
  inputField: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
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
