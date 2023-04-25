import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function HamburgerMenu({ navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  function toggleMenu() {
    setMenuOpen(!menuOpen);
    Animated.timing(animation, {
      toValue: menuOpen ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  function closeMenu() {
    setMenuOpen(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  function navigateToScreen(screenName) {
    navigation.navigate(screenName);
    closeMenu();
  }

  function Menu() {
    return (
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigateToScreen('Screen1')}>
          <Text style={styles.menuItem}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Screen2')}>
          <Text style={styles.menuItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Screen3')}>
          <Text style={styles.menuItem}>Screen 3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Screen3')}>
          <Text style={styles.menuItem}>Screen 3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Screen3')}>
          <Text style={styles.menuItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iconRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
          <Ionicons name={menuOpen ? 'close' : 'menu'} size={32} color="black" />
        </Animated.View>
      </TouchableOpacity>
      {menuOpen && <Menu />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 75,
    paddingVertical: 8,
    backgroundColor: '#eee',
    width: '100%',

  },
  menu: {
    
    position: 'absolute',
    top: 60,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
  },
  closeButton: {
    color: '#666',
    marginBottom: 16,
  },
  menuItem: {
    color: '#000',
    marginVertical: 8,
  },
});

export default HamburgerMenu;