import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../consts/colors';

const width = Dimensions.get('window').width / 2 - 30;

const LandingScreen = ({ navigation, userinfo }) => {
  // console.log(userinfo);
navigation = useNavigation()
const [groups, setGroups] = useState([]);
const todoRef = collection(db,'Groups');

const [likedGroups, setLikedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState(groups);
    
  useEffect(() => {
    const fetchData = async () => {
      if (userinfo && userinfo.groups) {
        const docRef = doc(db, 'users', userinfo.userId);
        const groups = await (await getDoc(docRef)).data().groups;
        console.log(groups);
        if (groups) {
          let q = query(todoRef, where('Groupid', 'in', groups));
          let rtrgroups = [];
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            rtrgroups.push(doc.data());
          });
          setGroups(rtrgroups);
        }
      }
    };
    fetchData();
  }, [userinfo]);

    
  const handleSearch = (query) => {
    if(!query || query == ''){
      setSearchQuery('')
      return;
    } else{
      setSearchQuery(query);
      const filteredGroups = groups.filter(group => {
         return (group['Name'] || '').toString().toLowerCase().includes(query.toLowerCase())
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

  const Card = ({groups, groupid, userinfo}) => {
    const isLiked = likedGroups.findIndex((likedGroup) => likedGroup.id === groupid) !== -1;
    return (
      <TouchableOpacity style={{ padding:10}} activeOpacity={0.8}>
        <StatusBar barStyle="dark-content" />
        <View style={style.card}>
          <View style={{alignItems: 'flex-end'}}>
           <TouchableOpacity onPress={() => {}}>
            <Icon name="favorite" size={20}  color={isLiked ?  'red' : 'black'}/>
          </TouchableOpacity>
            </View>

          <View
            style={{
              height:118,
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/output.png')}
              style={{flex: 1, resizeMode: 'contain'}}
            />
          </View>

          <Text ellipsizeMode='tail' numberOfLines={1} style={{fontWeight: 'bold', fontSize: 17, marginTop: 10, textAlign: 'center'}}>
            {groups}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}> 
        <View>
          <TouchableOpacity onPress={togglePopup}>      
          <Icon name="message" size={25} color= '#b2b2b2'/>
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
        <View style={{flexDirection: 'row'}}>
        <Text style={style.popupText}>Group Name:</Text>
        <Text style={style.popupText}>{groups}</Text>
        </View> 

        <View style={{flexDirection: 'row'}}>
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
          <Icon name="people" size={25} color='#b2b2b2' />
          </TouchableOpacity>
        </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <View>
          <Text style={{fontSize:25, color: '#673AB7', justifyContent:'center', fontWeight: 'bold', paddingLeft: 10}}>
            TOPDECK
          </Text>
        </View>
      </View>
      <View style={{marginTop: 30, flexDirection: 'row',paddingHorizontal:20}}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={{marginLeft: 20}} />
          <TextInput placeholder="Search" style={style.input} value={searchQuery}  onChangeText={(text)=>{handleSearch(text)}}/>
        </View>
        <View style={style.sortBtn}>
          <Icon name="sort" size={30} color='white'/>
        </View>
      </View>
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={2}
        data={searchQuery ? filteredGroups : groups}
        renderItem={({item}) => {
          return <Card groups={item.Name} groupid={item.Groupid} userinfo={userinfo.groups} />;
        }}

      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
  categoryTextSelected: {
    color: '#673AB7',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: '#673AB7',
  },
  title:{
    fontSize:30,
    fontFamily:'Caveat-Bold',
    minWidth:250,
    color:'#673AB7',
    marginLeft: 120,
    paddingBottom: 20,
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
    paddingHorizontal:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 50,
    marginBottom: 15,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: '#673AB7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  popupContentContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    padding:6,
  },
  popupCloseButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
export default LandingScreen;

