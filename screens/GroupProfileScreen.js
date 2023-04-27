import {
  ActivityIndicator,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Divider,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  collection,
  doc,
  documentId,
  setDoc,
  getDoc,
  getFirestore,
  firestore,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import MultiSelect from "react-native-multiple-select";

const GroupProfileScreen = ({ route, navigation }) => {
  const [groupinfo, setGroupinfo] = useState({});
  const [participant, setParticipant] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  // const [groupinfo, setGroupinfo] = useState({});
  const [participantsData, setParticipantsData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { groupId, groupName } = route.params;

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
        console.log("user data", userDocs);
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

  const addParticipants = () => {
    let data = selectedItems;

    const chatDocRef = doc(db, "Groups", groupId);
    data.forEach((element) => {
      updateDoc(chatDocRef, {
        participants: arrayUnion(element),
      }).then(async () => {
        console.log("data updated");
        await getGroupInfo();
        setSelectedItems([]);
      });
    });
  };

  const getGroupInfo = async () => {
    const docRef = doc(db, "Groups", groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      
      const groupData = docSnap.data();
      setGroupinfo(groupData);
      console.log("doc data", groupinfo);

      const participantIds = groupData.participants;

      const participantDataPromises = participantIds.map(
        async (participantId) => {
          const userRef = doc(db, "users", participantId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            return {
              userId: participantId,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
            };
          } else {
            console.log(`User with ID ${participantId} not found`);
            return { id: participantId, name: "Unknown" };
          }
        }
      );

      Promise.all(participantDataPromises)
        .then((participantData) => {
          setParticipantsData(participantData);
          console.log("Participants data:", participantData);
        })
        .catch((error) => {
          console.log("Error fetching participant data:", error);
        });
    } else {
      console.log("no participant data found");
    }
  };

  const handleDeleteParticipant = async (userId) => {
    const chatDocRef = doc(db, "Groups", groupId);
    await updateDoc(chatDocRef, {
      participants: arrayRemove(userId),
    }).then(async () => {
      console.log("participant deleted");
      alert("Participant Removed");
      setParticipantsData((prevData) =>
        prevData.filter((item) => item.userId !== userId)
      );
    });
  };

  const handleDeleteGroup = async () => {
    const groupDocRef = doc(db, "Groups", groupId);
    await deleteDoc(groupDocRef);
    console.log("Group deleted");
    alert("Group Deleted");
    navigation.popToTop();
    // or navigate to another screen
  };

  useEffect(() => {
    getGroupInfo();
    fetchUserData();
  }, []);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
      <ScrollView>
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back-outline" size={22} color="#424242" />
            <Text
              style={{
                fontSize: 18,
                fontWeight:400,
                color: "#424242",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={groupinfo && groupinfo.groupPhotoUrl ? {uri: groupinfo.groupPhotoUrl } : require("../assets/images/output.png")}
            style={styles.icon}
          />
          <Text
            style={{
              marginTop: "3%",
              textAlign: "center",
              fontSize: 26,
              fontWeight: "400",

              color: "#616161",
            }}
          >
            {groupName}
          </Text>
          <Text
            style={{
              marginTop: "1%",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "400",

              color: "#424242",
            }}
          >
            {participantsData.length} members
          </Text>
        </View>
        <View style={styles.multiselect}>
          <MultiSelect
            items={userDocs}
            uniqueKey="userId"
            onSelectedItemsChange={setSelectedItems}
            selectedItems={selectedItems}
            selectText="Search participants to add"
            searchInputPlaceholderText="Search options..."
            searchInputStyle={{ borderRadius: 5 }}
            tagRemoveIconColor="black"
            tagBorderColor="black"
            tagTextColor="black"
            selectedItemTextColor="black"
            selectedItemIconColor="black"
            itemTextColor="black"
            displayKey="first_name"
            hideSubmitButton={true}
          />
        </View>
        <View style={styles.shareGroup}>
          <TouchableOpacity onPress={addParticipants}>
            <Text
              style={{
                fontSize: 18,
                color: "white",
               
              }}
            >
              Add Participants
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            marginLeft: 24,
            fontSize: 20,
            marginBottom: "-2%",
            marginTop: 20,

            color: "black",
          }}
        >
          Participants:
        </Text>
        <View style={styles.detailsContainer}>
          {participantsData.map((item) => {
            return (
              <View style={styles.details}>
                <Text key={item.userId} style={styles.Nametext}>
                  {item.first_name} {item.last_name}
                  {/* <Text style={{color: "purple", fontSize: 15, fontWeight: 300}}>Email: {item.email}</Text> */}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteParticipant(item.userId)}
                >
                  <Icon name="trash-outline" size={20} color="#DC143C" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.deleteGroup}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: "white",
               
              }}
              onPress={handleDeleteGroup}
            >
              Delete Group
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.shareGroup}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontFamily: "Times New Roman",
              }}
            >
              Share Group Link
            </Text>
          </TouchableOpacity>
        </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default GroupProfileScreen;

const styles = StyleSheet.create({
  loginContainer: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "white",
    marginBottom: 0,
  },
  divider: {
    height: 0.6,
    backgroundColor: "white",
    marginVertical: 2,
  },
  backButton: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 130,
    height: 130,
    borderRadius: 75,
    backgroundColor:'#e0e0e0',
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    marginBottom:10
  },
  imageContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  detailsContainer: {
    margin: 20,
    backgroundColor: "whitesmoke",
    height: "auto",
    borderRadius: 13,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.4,
    borderColor: "#d3d3d3",
  },
  Adddetails: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8,
  },
  Nametext: {
    fontSize: 17,
    fontWeight: 400,
    // fontWeight: 450,
    color: "black",
  },
  NameParticipants: {
    fontSize: 17,
    fontWeight: 400,

    paddingLeft: 10,
    color: "black",
  },
  deleteGroup: {
    width:180,
   minHeight:40,
   paddingVertical:8,
   backgroundColor: "#DC143C",
   height: 35,
   borderRadius: 30,
   justifyContent: "center",
   alignItems: "center",
   alignSelf:'center',
   marginVertical:30
 },
 shareGroup: {
   width:180,
   minHeight:40,
   paddingVertical:8,
   backgroundColor: "#673AB7",
   height: 35,
   borderRadius: 30,
   justifyContent: "center",
   alignItems: "center",
   alignSelf:'center',
   marginBottom:30,
   marginTop:10
 }
,
  multiselect: {
    margin:30,
  },
});
