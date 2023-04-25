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
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import COLORS from '../consts/colors';
import {firebase} from '../config';


const width = Dimensions.get('window').width / 2 - 30;

const LandingScreen = ({navigation}) => {

const [groups, setGroups] = useState([]);
const todoRef = firebase.firestore().collection('Groups');

const [likedGroups, setLikedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState(groups);
  


  useEffect(async () => {
    todoRef
    .onSnapshot(
      QuerySnapshot => {
        const groups = [];
        QuerySnapshot.forEach((doc) => {
          const { Name, Groupid } = doc.data();
          groups.push({
            id: doc.id,
            Name,
            Groupid,
          })
        })
        setGroups(groups);
      }
    )
  },[])

  const handleSearch = (query) => {
    if(!query || query == ''){
      setSearchQuery(false)
      return;
    } else{
      setSearchQuery(query);
      const filteredGroups = groups.filter(group => {
         return (group['Name'] || '').toString().toLowerCase().includes(query.toLowerCase())
      });
      setFilteredGroups(filteredGroups);
    }
  };
  
  const handleLike = (group) => {
    const likedGroupIndex = likedGroups.findIndex((likedGroup) => likedGroup.id === group.id);

    if (likedGroupIndex !== -1) {
      const updatedLikedGroups = [...likedGroups];
      updatedLikedGroups.splice(likedGroupIndex, 1);
      setLikedGroups(updatedLikedGroups);
    } else {
      setLikedGroups([...likedGroups, group]);
    }
  };



  const Card = ({groups}) => {
    const isLiked = likedGroups.findIndex((likedGroup) => likedGroup.id === groups.id) !== -1;

    return (
      <TouchableOpacity style={{ padding:10}}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Details', plant)}>
        <StatusBar barStyle="dark-content" />
        <View style={style.card}>
          <View style={{alignItems: 'flex-end'}}>
           <TouchableOpacity onPress={() => handleLike(groups)}>
            <Icon name="favorite" size={20} color={isLiked ? 'red' : 'black'} />
          </TouchableOpacity>
            </View>

          <View
            style={{
              height:118,
              alignItems: 'center',
            }}>
            {/* <Image
              source={plant.img}
              style={{flex: 1, resizeMode: 'contain'}}
            /> */}
          </View>

          <Text style={{fontWeight: 'bold', fontSize: 17, marginTop: 10, textAlign: 'center'}}>
            {groups}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>        
          <Icon name="message" size={25} color='#673AB7'/>
          <Icon name="people" size={25} color='#673AB7' />
          <Icon name="flag" size={25} color='#673AB7' />
          <Icon name="settings" size={25} color='#673AB7' />
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
          <Text style={{fontSize:30, color: '#673AB7', justifyContent:'center', fontWeight: 'bold', paddingLeft: 10}}>
            TOPDECK
          </Text>
        </View>
      </View>
      <View style={{marginTop: 30, flexDirection: 'row'}}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={{marginLeft: 20}} />
          <TextInput placeholder="Search" style={style.input} value={groups} onChangeText={(text)=>{handleSearch(text)}}/>
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
          return <Card groups={item.Name} />;
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
});
export default LandingScreen;