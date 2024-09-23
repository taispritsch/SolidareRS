import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { styles } from "./styles"
import { Header } from '@/components/Header';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton, MD3Colors, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import axiosInstance from '@/services/axios';

const HomeScreen = () => {
  const [governmentDepartments, setGovernmentDepartments] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { userName, showSnackbar, action } = useLocalSearchParams();

  const onDismissSnackBar = () => setVisible(false);

  async function getGovernmentDepartments() {
    try {
      const response = await axiosInstance.get('government-departments');

      const array = response.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
        }
      });

      setGovernmentDepartments(array);
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      Alert.alert('Erro', 'Não foi possível carregar os órgãos públicos.');
    }

  }


  React.useEffect(() => {
    getGovernmentDepartments();

    if (showSnackbar) {
      if (action === 'create') {
        setSnackbarMessage('Órgão público criado com sucesso!');
      } else if (action === 'edit') {
        setSnackbarMessage('Órgão público editado com sucesso!');
      }
      setVisible(true);
      getGovernmentDepartments();
    }

  }, [showSnackbar, action]);

  const router = useRouter();

  interface GovernmentDepartment {
    name: string;
    id: string;
  }

  const handlePress = (governmentDepartment: GovernmentDepartment) => {
    router.push({ pathname: '/WelcomeScreen', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: userName } });
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
                onPress={() => handlePress(governmentDepartment)}
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
          }}
        >
          {snackbarMessage}
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
