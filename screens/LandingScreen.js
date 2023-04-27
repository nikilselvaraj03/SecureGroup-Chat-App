import React, { useState, useEffect } from "react";
import ChatScreen from "./ChatScreen";
import GroupProfileScreen from "./GroupProfileScreen";
import NewGroupScreen from "./NewGroupScreen";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
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
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import COLORS from "../consts/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
const width = Dimensions.get("window").width / 2 - 30;

const LandingScreen = ({ navigationParam, userinfo }) => {
  const navigation = useNavigation();
  // console.log(userinfo);

  const [groups, setGroups] = useState([]);
  const todoRef = collection(db, "Groups");

  const [likedGroups, setLikedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [delgrp, setDelgrp] = useState();
  const LandingScreenValue = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
        }}
      >
        <StatusBar barStyle="dark-content" />
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
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
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
                userinfo={userinfo.groups}
              />
            );
          }}
        />
      </SafeAreaView>
    );
  };
  useEffect(() => {
    const getGroupInfo = async () => {
      const currentUser = auth.currentUser.uid;
      const docRef = doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef);
      const currentUserData = docSnap.data();
      setDelgrp(currentUserData);
      const disappearedGroup = delgrp.groups.filter((groupId) => groupId);

      const currentDate = new Date().toLocaleDateString("en-GB"); // format the current date as 'DD/MM/YYYY'

      disappearedGroup.forEach(async (groupId) => {
        const groupRef = doc(db, "Groups", groupId);
        const groupSnap = await getDoc(groupRef);
        const groupData = groupSnap.data();
        console.log("see group data here", groupData.selectedDate);
        console.log("see current date here", currentDate);
        const groupDate = formatDate(groupData.selectedDate);
        if (
          typeof groupDate === "string" &&
          typeof currentDate === "string" &&
          groupDate === currentDate
        ) {
          console.log("Date", formatDate(groupData.selectedDate));
          await deleteDoc(doc(db, "Groups", groupId));
          console.log("group deleted");
        }
      });
    };

    const formatDate = (dateStr) => {
      const dateObj = new Date(dateStr);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    async function fetchData() {
      if (userinfo && userinfo.groups) {
        let q = query(todoRef, where("Groupid", "in", userinfo.groups));
        let rtrgroups = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          rtrgroups.push(doc.data());
          console.log(doc.id, " => ", doc.data());
        });
        setGroups(rtrgroups);
        console.log(groups["Groupid"]);
        // console.log("checking for grpid:",groups)
      }
    }

    fetchData();
    getGroupInfo();
    // deleteGroup();
  }, [userinfo]);

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

  const handleLike = (group) => {
    const likedGroupIndex = likedGroups.findIndex(
      (likedGroup) => likedGroup.id === group
    );

    if (likedGroupIndex !== -1) {
      const updatedLikedGroups = [...likedGroups];
      updatedLikedGroups.splice(likedGroupIndex, 1);
      setLikedGroups(updatedLikedGroups);
    } else {
      setLikedGroups([...likedGroups, group]);
    }
  };

  const Card = ({ groups, groupid, userinfo }) => {
    const isLiked =
      likedGroups.findIndex((likedGroup) => likedGroup.id === groupid) !== -1;
    return (
      <TouchableOpacity
        style={{ padding: 10 }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("ChatScreen", {
            groupId: groupid,
            groupName: groups,
          });
        }}
      >
        <View style={style.card}>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => handleLike(groupid)}>
              <Icon
                name="favorite"
                size={20}
                color={isLiked ? "red" : "#b2b2b2"}
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
              source={require("../assets/images/group-chat.webp")}
              style={{ flex: 1, resizeMode: "contain" }}
            />
          </View>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 17,
              marginTop: 10,
              textAlign: "center",
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
            <TouchableOpacity onPress={togglePopup}>
              <Icon name="message" size={25} color="#b2b2b2" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="people" size={25} color="#b2b2b2" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
};

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
  card: {
    height: 225,
    backgroundColor: COLORS.light,
    width,
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
});
export default LandingScreen;
