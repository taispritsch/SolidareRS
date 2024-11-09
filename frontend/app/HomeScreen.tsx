import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, BackHandler } from 'react-native';
import { styles } from "./styles"
import { Header } from '@/components/Header';
import DynamicCard from '@/components/DynamicCard ';
import { FAB, Icon, Provider, Portal, Snackbar } from 'react-native-paper';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = () => {
  const [governmentDepartments, setGovernmentDepartments] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [open, setOpen] = useState(false);

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
    }

  }, [showSnackbar, action]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Sair',
          'Deseja realmente sair?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            { text: 'Sair', onPress: () => { BackHandler.exitApp(), router.replace({ pathname: '/AccessScreen' }) } }
          ]
        );
        return true;
      };

      getGovernmentDepartments();

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const router = useRouter();

  interface GovernmentDepartment {
    name: string;
    id: string;
  }

  const handlePress = (governmentDepartment: GovernmentDepartment) => {
    router.push({ pathname: '/WelcomeScreen', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: userName } });
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('logout');
      if (response.status === 200) {
        await SecureStore.deleteItemAsync('token');
        Alert.alert('Sucesso', 'Logout bem-sucedido');
        router.replace('/LoginScreen');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao fazer logout.');
    }
  };

  return (
    <Provider>
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
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? 'minus' : 'plus'}
              visible={true}
              color='#FFFFFF'
              actions={[
                {
                  icon: 'plus',
                  label: 'Adicionar',
                  onPress: () => router.push('/CityHallForm'),
                  style: {
                    backgroundColor: '#0041A3',
                  },
                },
                {
                  icon: 'logout',
                  label: 'Sair',
                  onPress: handleLogout,
                  style: {
                    backgroundColor: '#0041A3',
                  },
                },
              ]}
              onStateChange={({ open }) => setOpen(open)}
              onPress={() => {
                if (open) {
                  setOpen(false);
                }
              }}
              fabStyle={{ backgroundColor: '#133567' }}
            />
          </Portal>
        </View>
      </View>
    </Provider>
  );
};

export default HomeScreen;
