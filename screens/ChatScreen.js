import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import GroupProfileScreen from "./GroupProfileScreen";
import uuid from "uuid";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [userInfo, setuserinfo] = useState("");
  const [text, setText] = useState("");
  const { groupId, groupName } = route.params;

  const getMessages = async () => {
    const docRef = doc(db, "chats", groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messagesData = docSnap.data();
      setMessages(messagesData);
      console.log("checking messages.group_id",groupId)
    } else {
      console.log("no msg data found");
    }
  };

  useEffect(() => {
    // alert(auth.currentUser.uid);
    // alert(groupId);
    // alert(groupName);
    getMessages();
    userInfromation();
  }, [groupId]);
//
const userInfromation = async () => {
  const currentuser=auth.currentUser.uid;
  const docRefer = doc(db, "users",currentuser);
  const docSnap = await getDoc(docRefer);
  const userInfo = docSnap.data();
  setuserinfo(userInfo);
};



  const sendMessage = async () => {
    const uniqueId = uuid.v4();
    const useri = auth.currentUser.uid;
    const chatDocRef = doc(db, "chats", groupId);
    const chatDocSnapshot = await getDoc(chatDocRef);
    const chatDocData = chatDocSnapshot.data();
    if (!chatDocData) {
      const docRef = await setDoc(doc(db, "chats", groupId), {
        group_id: groupId,
        group_name: groupName,
        message: [
          {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            message_id: uniqueId,
            message_text: text,
            user_id: auth.currentUser.uid,
          },
        ],
      }).then(async () => {
        setText("");
        await getMessages();
      });
    } else {
      let newData = {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        message_id: uniqueId,
        message_text: text,
        user_id: auth.currentUser.uid,
      };
      await updateDoc(chatDocRef, {
        message: arrayUnion(newData),
      }).then(async () => {
        console.log("data updated");
        setText("");
        await getMessages();
      });
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // set behavior prop to "padding"
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="#616161" translucent={false}  />
          <View style={styles.header}>
            {/* Your header content */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="chevron-back-outline"
                size={20}
                color="#616161"
              ></Icon>
              <Text
                style={{
                  fontSize: 18,
                  color: "#616161",
                  fontWeight:'400'
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#616161",
                  marginRight: "10%",
                }}
              >
                {groupName}
              </Text>
            </View>
            <TouchableOpacity>
              <Icon
                name="information-circle-outline"
                size={24}
                color="#616161"
                onPress={() => navigation.navigate('GroupProfileScreen', { groupId:groupId, groupName:groupName})
                }
              ></Icon>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <ScrollView
              style={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            >{messages.message &&
  messages.message.map((item) => {
    return (
      <React.Fragment key={item.message_id}>
        {item.user_id != auth.currentUser.uid ? (
          <Text
            style={{
              fontSize: 15,
              color: "purple",
              paddingBottom: 1,
            }}
          >
            <Text>
              {item.first_name.charAt(0).toUpperCase()}
              {item.last_name.charAt(0).toUpperCase()}
            </Text>
          </Text>
        ) : (
          null
        )}
        <View
          style={[
            styles.message,
            item.user_id == auth.currentUser.uid
              ? styles.myMessage
              : styles.otherUserMessage,
          ]}
        >
          <Text style={styles.messageBody}>{item.message_text}</Text>
        </View>
      </React.Fragment>
    );
  })}

              {/* {messages.message &&
                messages.message.map((item) => {
                  return (
                    <>
                      {item.user_id != auth.currentUser.uid ? (
                        <Text key={item.message_id + " _name"}
                          style={{
                            fontSize: 15,
                            color: "purple",
                            paddingBottom: 1,
                          }}
                        >
                          <Text>
                            {item.first_name.charAt(0).toUpperCase()}
                            {item.last_name.charAt(0).toUpperCase()}
                          </Text>
                        </Text>
                      ) : (
                        ""
                      )}
                      <View
                        key={item.message_id}
                        style={[
                          styles.message,
                          item.user_id == auth.currentUser.uid
                            ? styles.myMessage
                            : styles.otherUserMessage,
                        ]}
                      >
                        <Text style={styles.messageBody}>
                          {item.message_text}
                        </Text>
                      </View>
                    </>
                  );
                })} */}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message here"
                placeholderTextColor="#d3d3d3"
                value={text}
                onChangeText={(message_text) => setText(message_text)}
              />

              <TouchableOpacity style={styles.button} onPress={sendMessage}>
                <Icon name="paper-plane-outline" size={15} color="white"></Icon>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 50,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'#616161'
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    maxWidth: "70%",
    backgroundColor: "#d3d3d3",
    borderRadius: 16,
    marginBottom: 10,
    padding: 10,
  },
  messageBody: {
    fontSize: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E8EAF6",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#d3d3d3",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#673AB7",
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  initialsBody: {
    position: "absolute",
    bottom: 2,
    left: -27,
    width: 32,
    height: 32,
    borderRadius: 14,
    backgroundColor: "#E8EAF6",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#673AB7",
  },
});

export default ChatScreen;
