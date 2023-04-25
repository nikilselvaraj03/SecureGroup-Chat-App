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

const GroupProfileScreen = ({ navigation }) => {
  const [groupinfo, setGroupinfo] = useState({});
  const [participant, setParticipant] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  // const [groupinfo, setGroupinfo] = useState({});
  const [participantsData, setParticipantsData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // const getGroupInfo = async () => {
  //   const docRef = doc(db, "Groups", "6fc5bc75-ab9e-4db8-b10e-5e4a6b517e91");
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const GroupData = docSnap.data();
  //     setGroupinfo(GroupData);
  //     console.log("doc data", GroupData);
  //   } else {
  //     console.log("no data found");
  //   }
  // };
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

    const chatDocRef = doc(
      db,
      "Groups",
      "6fc5bc75-ab9e-4db8-b10e-5e4a6b517e91"
    );
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
    const docRef = doc(db, "Groups", "6fc5bc75-ab9e-4db8-b10e-5e4a6b517e91");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const groupData = docSnap.data();
      setGroupinfo(groupData);
      console.log("doc data", groupData);

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
      console.log("no data found");
    }
  };

  const handleDeleteParticipant = async (userId) => {
    const chatDocRef = doc(
      db,
      "Groups",
      "6fc5bc75-ab9e-4db8-b10e-5e4a6b517e91"
    );
    await updateDoc(chatDocRef, {
      participants: arrayRemove(userId),
    }).then(async () => {
      console.log("participant deleted");
      setParticipantsData((prevData) =>
        prevData.filter((item) => item.userId !== userId)
      );
    });
  };

  const handleDeleteGroup = async () => {
    const groupDocRef = doc(
      db,
      "Groups",
      "6fc5bc75-ab9e-4db8-b10e-5e4a6b517e91"
    );
    await deleteDoc(groupDocRef);
    console.log("Group deleted");
    navigation.goBack(); // or navigate to another screen
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
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back-outline" size={26} color="black" />
            <Text
              style={{
                fontSize: 20,
                color: "black",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {/* <Image
            source={require("../assets/images/profileImage2.jpg")}
            style={styles.icon}
          /> */}
          <Text
            style={{
              marginTop: "3%",
              textAlign: "center",
              fontSize: 24,
              fontWeight: "500",

              color: "black",
            }}
          >
            {groupinfo.Name}
          </Text>
          <Text
            style={{
              marginTop: "1%",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "300",

              color: "black",
            }}
          >
            4 Members
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
                color: "purple",
                fontFamily: "Times New Roman",
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
                  <Icon name="trash-outline" size={20} color="#FF4500" />
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
                color: "#FF4500",
                fontFamily: "Times New Roman",
              }}
              onPress={handleDeleteGroup}
            >
              Delete Group
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shareGroup}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: "blue",
                fontFamily: "Times New Roman",
              }}
            >
              Share Group Link
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default GroupProfileScreen;

const styles = StyleSheet.create({
  loginContainer: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#d3d3d3",
    marginBottom: 0,
  },
  divider: {
    height: 0.6,
    backgroundColor: "#d3d3d3",
    marginVertical: 2,
  },
  backButton: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 110,
    height: 110,
    borderRadius: 75,
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
    margin: 20,
    backgroundColor: "whitesmoke",
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  shareGroup: {
    marginLeft: 20,
    marginRight: 14,
    backgroundColor: "whitesmoke",
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  multiselect: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 14,
  },
});
