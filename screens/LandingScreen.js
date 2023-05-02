import React, { useState, useEffect } from "react";
import ChatScreen from "./ChatScreen";
import GroupProfileScreen from "./GroupProfileScreen";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import COLORS from "../consts/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function LandingScreen({ userinfo }) {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const todoRef = collection(db, "Groups");
  const [likedGroups, setLikedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [isLoading, setisLoading] = useState(true);
  const isEmptyGroups = () => {
    return (
      !(groups && groups.length > 0) ||
      (filteredGroups && filteredGroups.length)
    );
  };
  const LandingScreenValue = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
        }}
      >
        <StatusBar translucent={false} barStyle="dark-content"></StatusBar>
        <View style={style.header}>
          <View>
            <Text
              style={{
                fontSize: 25,
                color: "#673AB7",
                justifyContent: "center",
                fontWeight: "bold",
                paddingLeft: 10,
              }}
            >
              TOPDECK
            </Text>
          </View>
        </View>
        <View
          style={{ marginTop: 30, flexDirection: "row", paddingHorizontal: 20 }}
        >
          <View style={style.searchContainer}>
            <Icon name="search" size={25} style={{ marginLeft: 20 }} />
            <TextInput
              placeholder="Search"
              style={style.input}
              value={searchQuery}
              onChangeText={(text) => {
                handleSearch(text);
              }}
            />
          </View>
          <View style={style.sortBtn}>
            <Icon name="sort" size={30} color="white" />
          </View>
        </View>
        {!isEmptyGroups() ? (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-around" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 10,
              paddingBottom: 50,
            }}
            numColumns={2}
            data={searchQuery ? filteredGroups : groups}
            renderItem={({ item }) => {
              return (
                <Card
                  groups={item.Name}
                  groupid={item.Groupid}
                  groupInfo={item}
                  userinfo={userinfo.groups}
                />
              );
            }}
          />
        ) : (
          <></>
        )}
        {isEmptyGroups() && !isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                letterSpacing: 1.0,
                color: "grey",
                paddingBottom: 20,
              }}
            >
              Seems like you are'nt in any groups.{"\n\n"} Go ahead and create
              one
            </Text>
          </View>
        ) : (
          <></>
        )}
      </SafeAreaView>
    );
  };
  const fetchData = async () => {
    setisLoading(true);
    if (userinfo && userinfo.groups) {
      const docRef = doc(db, "users", userinfo.userId);
      const groups = await (await getDoc(docRef)).data().groups;
      console.log(groups);
      if (groups && groups.length > 0) {
        let q = query(todoRef, where("Groupid", "in", groups));
        let rtrgroups = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          rtrgroups.push(doc.data());
        });
        setGroups(rtrgroups);
        deleteDisappearedGroups();
      }
    }
    setisLoading(false);
  };

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      fetchData();
    });
    fetchData();
  }, [userinfo]);

  const deleteDisappearedGroups = () => {
    console.log("in dissapearing groups:", JSON.stringify(groups));
    const currentDate = new Date(); // format the current date as 'DD/MM/YYYY'
    groups.forEach(async (group) => {
      if (group.isDisappearingGroup) {
        console.log("in dissapearing groups");
        const milliseconds =
          group.selectedDate.seconds * 1000 +
          Math.floor(group.selectedDate.nanoseconds / 1000000);
        console.log("see current date here", currentDate);
        let selectedDate = new Date();
        selectedDate.setTime(milliseconds);
        console.log("see selected formatted", selectedDate);
        if (
          selectedDate.getDate() === currentDate.getDate() &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        ) {
          await deleteDoc(doc(db, "Groups", group.Groupid));
          console.log("group deleted");
        }
      }
    });
  };

  const handleSearch = (query) => {
    if (!query || query == "") {
      setSearchQuery("");
      return;
    } else {
      setSearchQuery(query);
      const filteredGroups = groups.filter((group) => {
        return (group["Name"] || "")
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase());
      });
      setFilteredGroups(filteredGroups);
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  function generateRandomNumber() {
    // Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
    var randomDecimal = Math.random();

    // Scale the random decimal to a number between 1 and 20
    var randomNumber = Math.floor(randomDecimal * 20) + 1;

    return randomNumber;
  }

  let random = generateRandomNumber();

  const Card = ({ groups, groupid, groupInfo, userinfo }) => {
    const isLiked =
      likedGroups.findIndex((likedGroup) => likedGroup.id === groupid) !== -1;
    return (
      <>
        <View style={style.card}>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChatScreen", {
                groupId: groupid,
                groupName: groups,
              });
            }}
          > */}
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => {}}>
              <Icon
                name="favorite"
                size={20}
                color={isLiked ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 118,
              alignItems: "center",
            }}
          >
            <Image
              source={
                groupInfo && groupInfo.groupPhotoUrl
                  ? { uri: groupInfo.groupPhotoUrl }
                  : require("../assets/images/output.png")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 60,
                borderWidth: groupInfo.groupPhotoUrl ? 3 : 0,
                borderColor: "#ffffff",
              }}
            />
          </View>

          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 10,
              textAlign: "center",
            }}
            onPress={() => {
              navigation.navigate("ChatScreen", {
                groupId: groupid,
                groupName: groups,
              });
            }}
          >
            {groups}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <View>
              <TouchableOpacity onPress={togglePopup}>
                <Icon name="message" size={25} color="#b2b2b2" />
              </TouchableOpacity>
              <Modal
                visible={isPopupVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={togglePopup}
              >
                {/* Render the custom popup screen */}
                <View style={style.popupContainer}>
                  <View>
                    <Text style={style.title}>Messages</Text>
                  </View>
                  {/* Customize the content of the popup screen */}
                  <View style={{ flexDirection: "row" }}>
                    <Text style={style.popupText}>Group Name:</Text>
                    <Text style={style.popupText}>{groups}</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={style.popupText}>Unread Messages:</Text>
                    <Text style={style.popupText}>{random} messages</Text>
                  </View>

                  <TouchableOpacity onPress={togglePopup}>
                    <Text style={style.popupCloseButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            <TouchableOpacity>
              <Icon name="people" size={25} color="#b2b2b2" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Landing"
        component={LandingScreenValue}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GroupProfileScreen"
        component={GroupProfileScreen}
      />
    </Stack.Navigator>
  );
}

const style = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  categoryText: { fontSize: 16, color: "grey", fontWeight: "bold" },
  categoryTextSelected: {
    color: "#673AB7",
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: "#673AB7",
  },
  title: {
    fontSize: 30,
    fontFamily: "Caveat-Bold",
    minWidth: 250,
    color: "#673AB7",
    marginLeft: 120,
    paddingBottom: 20,
  },
  card: {
    height: 225,
    backgroundColor: COLORS.light,
    width: 150,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  header: {
    marginTop: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    height: 50,
    marginBottom: 15,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: "#673AB7",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  popupContentContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    padding: 6,
  },
  popupCloseButton: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});
