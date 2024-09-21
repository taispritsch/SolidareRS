import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { styles } from "./styles"
import { Header } from '@/components/Header';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton, MD3Colors, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const HomeScreen = () => {
  const [governmentDepartments, setGovernmentDepartments] = React.useState([]);

  const governmentName = useLocalSearchParams().title;

  const showSnackbar = useLocalSearchParams().showSnackbar;

  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  async function getGovernmentDepartments() {
    const response = await fetch(`http://192.168.0.106:8000/api/government-departments`, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => {

      const array = data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
        }
      });

      setGovernmentDepartments(array);

    }).catch(error => console.error(error));
  }


  React.useEffect(() => {
    getGovernmentDepartments();

    if (showSnackbar) {
      setVisible(true);
      getGovernmentDepartments();
    }

  }, [showSnackbar]);
  const router = useRouter();

  const handlePress = (city: string) => {
    router.push({ pathname: '/WelcomeScreen', params: { title: city } });
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
            {governmentDepartments.map((governmentDepartment: any, index) => (
              <DynamicCard 
              key={index} 
              title={governmentDepartment.name}
              hasOptionMenu 
              menuOptions={['editar']}
              onPress={() => handlePress('Lajeado')}
              onEditPress={() => router.push(`/CityHallForm?id=${governmentDepartment.id}&mode=edit`)}
              />
            ))}
          </View>
        </ScrollView>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={1500}
          action={{
            label: 'Fechar',
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          Prefeitura criada com sucesso!
        </Snackbar>
        <IconButton
          style={styles.addButton}
          icon="plus"
          iconColor={'#FFFFFF'}
          size={40}
          onPress={() => router.push('/CityHallForm')}
          mode='contained'
          containerColor={Colors.backgroundButton}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
