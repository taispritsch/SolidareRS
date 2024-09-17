// @ts-ignore
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { styles } from "./styles"
import Header from '@/components/Header';
import DynamicCard from '@/components/DynamicCard ';

const HomeScreen = () => {
  const handlePress = (city: string) => {
    console.log(`Clicou em ${city}`);
  };

  return (
    <View style={styles.container}>
      <Header title='Bem-vindo ao SolidareRS.'/>
        <Text style={styles.title}>Órgãos públicos</Text>
      <ScrollView>
      <View style={{ padding: 20 }}>
        <DynamicCard title="Lajeado" onPress={() => handlePress('Lajeado')} />
        <DynamicCard title="Estrela" onPress={() => handlePress('Estrela')} />
        <DynamicCard title="Arroio do Meio" onPress={() => handlePress('Arroio do Meio')} />
        <DynamicCard title="Porto Alegre" onPress={() => handlePress('Porto Alegre')} />
      </View>
    </ScrollView>
    </View>
  );
};

export default HomeScreen;
