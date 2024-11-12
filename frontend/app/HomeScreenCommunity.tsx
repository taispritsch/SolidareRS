import { Header } from "@/components/Header";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import { Icon, Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import React, { useEffect } from "react";
import DynamicCard from "@/components/DynamicCard ";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";


const HomeScreenCommunity = () => {
  const [governmentDepartments, setGovernmentDepartments] = React.useState([]);
  const { userName } = useLocalSearchParams();

  interface GovernmentDepartment {
    name: string;
    id: string;
  }

  async function getGovernmentDepartments() {
    try {
      const response = await axiosInstance.get('community/government-departments');

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

  useEffect(() => {
    getGovernmentDepartments();
  }, []);

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


  const handlePress = (governmentDepartment: GovernmentDepartment) => {
    router.push({ pathname: '/CityLocations', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: userName } });
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
                  onPress={() => handlePress(governmentDepartment)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Provider>
  );
};

export default HomeScreenCommunity;
