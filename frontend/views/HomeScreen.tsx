import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { styles } from "./styles"
import { Header } from '@/components/Header';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton, MD3Colors } from 'react-native-paper';

const HomeScreen = () => {
  const handlePress = (city: string) => {
    console.log(`Clicou em ${city}`);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.iconAndTextContainer}>
          <Icon
            source="map-outline"
            color={'#0041A3'}
            size={30}
          />
          <Text style={styles.title}>Órgãos públicos</Text>
        </View>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <DynamicCard title="Lajeado" onPress={() => handlePress('Lajeado')} />
            <DynamicCard title="Estrela" onPress={() => handlePress('Estrela')} />
            <DynamicCard title="Arroio do Meio" onPress={() => handlePress('Arroio do Meio')} />
            <DynamicCard title="Porto Alegre" onPress={() => handlePress('Porto Alegre')} />
          </View>
        </ScrollView>
        <IconButton
          style={styles.addButton}
          icon="plus"
          iconColor={'#FFFFFF'}
          size={40}
          onPress={() => console.log('Pressed')}
          mode='contained'
          containerColor='#0041A3'
        />
      </View>
    </View>
  );
};

export default HomeScreen;
