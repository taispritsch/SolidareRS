import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors'; 

export function Header(){
    return (
    <View style={[styles.header, { backgroundColor: Colors.backgroundHeader }]}>
      <Image source={require('@/assets/images/logo-header.png')} style={styles.logo} />
      <Text style={[styles.title, { color: Colors.text }]}>Bem-vindo ao SolidareRS.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row', 
    paddingBottom: 40,
    paddingTop: 80,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: 'center', 
    padding: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
  },
  logo: {
    width: 60, 
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

});

