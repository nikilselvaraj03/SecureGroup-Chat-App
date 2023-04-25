import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Avatar, Title, Caption,TouchableRipple} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Contacts() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ionicons name='person-circle' size={40} color='#673AB7' />
            <Title style={{paddingLeft: 15, color: 'white', fontWeight: 'bold', fontSize: 20}} >Pooja Srinivasan</Title>
            </View>
        </View>
        <View>
            <Title style={{paddingLeft: '33%', color: '#673AB7', fontWeight: 'bold', fontSize: 20}} >CONTACTS</Title>
        </View>
        <View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        {/* <Ionicons name='person-circle' size={25} color='#673AB7' /> */}
        <Text  style={{paddingLeft: 10, color: 'black', fontWeight: 'bold', fontSize: 17}}>Nikil Nandha Kumar</Text>
        <View style={styles.actions}>
        <Ionicons name='checkmark-outline' size={30} color='white' backgroundColor='green' padding={10}  />
        <Ionicons name='close-circle-outline' size={30} color='white' backgroundColor='tomato' marginLeft={30} padding={10} />
        </View>
        </View>
        </View>



        <View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        {/* <Ionicons name='person-circle' size={25} color='#673AB7' /> */}
        <Text  style={{paddingLeft: 10, color: 'black', fontWeight: 'bold', fontSize: 17}}>Nikil Nandha Kumar</Text>
        <View style={styles.actions}>
        <Ionicons name='checkmark-outline' size={30} color='white' backgroundColor='green' padding={10}  />
        <Ionicons name='close-circle-outline' size={30} color='white' backgroundColor='tomato' marginLeft={30} padding={10} />
        </View>
        </View>
        </View>




        <View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        {/* <Ionicons name='person-circle' size={25} color='#673AB7' /> */}
        <Text  style={{paddingLeft: 10, color: 'black', fontWeight: 'bold', fontSize: 17}}>Nikil Nandha Kumar</Text>
        <View style={styles.actions}>
        <Ionicons name='checkmark-outline' size={30} color='white' backgroundColor='green' padding={10}  />
        <Ionicons name='close-circle-outline' size={30} color='white' backgroundColor='tomato' marginLeft={30} padding={10} />
        </View>
        </View>
        </View>


        <View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        {/* <Ionicons name='person-circle' size={25} color='#673AB7' /> */}
        <Text  style={{paddingLeft: 10, color: 'black', fontWeight: 'bold', fontSize: 17}}>Nikil Nandha Kumar</Text>
        <View style={styles.actions}>
        <Ionicons name='checkmark-outline' size={30} color='white' backgroundColor='green' padding={10}  />
        <Ionicons name='close-circle-outline' size={30} color='white' backgroundColor='tomato' marginLeft={30} padding={10} />
        </View>
        </View>
        </View>

        <View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        {/* <Ionicons name='person-circle' size={25} color='#673AB7' /> */}
        <Text  style={{paddingLeft: 10, color: 'black', fontWeight: 'bold', fontSize: 17}}>Nikil Nandha Kumar</Text>
        <View style={styles.actions}>
        <Ionicons name='checkmark-outline' size={30} color='white' backgroundColor='green' padding={10}  />
        <Ionicons name='close-circle-outline' size={30} color='white' backgroundColor='tomato' marginLeft={30} padding={10} />
        </View>
        </View>
        </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      backgroundColor: '#d5c8ed',
      paddingHorizontal: 30,
      marginBottom: 25,
      paddingBottom:20,
      paddingTop:20,
  
    },
    actions: {
        flexDirection: 'row',
        paddingLeft: 40,
        paddingRight: 20,
        justifyContent: 'space-between'
    }
});