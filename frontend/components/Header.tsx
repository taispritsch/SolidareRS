import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors'; 

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
    <View style={[styles.header, { backgroundColor: Colors.backgroundHeader }]}>
      <Image source={require('@/assets/images/logo-header.png')} style={styles.logo} />
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
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
    alignItems: 'center', // Centraliza verticalmente
    padding: 10,
    elevation: 3, // Sombra (opcional, no Android)
    shadowColor: '#000', // Sombra (opcional, no iOS)
    shadowOffset: { width: 0, height: 2 }, // Sombra (opcional, no iOS)
    shadowOpacity: 0.1, // Sombra (opcional, no iOS)
    shadowRadius: 2, // Sombra (opcional, no iOS)
  },
  logo: {
    width: 60, // Ajuste o tamanho do logo conforme necessário
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Header;
