import {  Alert, StyleSheet, View } from "react-native";
import {  IconButton, Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { useLocalSearchParams } from "expo-router";

interface PlaceData {
  phone: string;
  description: string;
  address_id?: number;
}

interface AddressData {
  street: string;
  number: number;
  neighborhood: string;
  zip_code: string;
}

const ContactAddress = () => {
  const { id: placeId } = useLocalSearchParams();
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  async function fetchPlaceData() {
    try {
      const response = await axiosInstance.get(`/donation-places/${placeId}`);
      setPlaceData(response.data);

      if (response.data.address_id) {
        fetchAddressData(response.data.address_id);
      }
    } catch (error) {
      console.error("Erro ao buscar o local de doação:", error);
      Alert.alert("Erro", "Não foi possível carregar as informações do local.");
    }
  }

  async function fetchAddressData(addressId: number) {
    try {
      const response = await axiosInstance.get(`/addresses/${addressId}`);
      setAddressData(response.data);
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      Alert.alert("Erro", "Não foi possível carregar as informações do endereço.");
    }
  }

  useEffect(() => {
    fetchPlaceData();
  }, []);

    return (
        <Provider>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={style.contact}>
                <IconButton
                  icon="phone"
                  size={35}
                  iconColor={'#0041A3'}
                />
                <Text style={style.contactTItle}>Contato</Text>
              </View>
              {placeData ? (
                <View>
                  <Text style={style.phone}>{placeData.phone || "Contato não disponível"}</Text>
                </View>
              ) : (
                <Text>Carregando...</Text>
              )}
              <View style={style.contact}>
                <IconButton
                  icon="map-marker-outline"
                  size={35}
                  iconColor={'#0041A3'}
                />
                <Text style={style.contactTItle}>Endereço</Text>
              </View>
              {addressData ? (
                <View>
                  <Text style={style.addressText}>
                    {`${addressData.street}, n°${addressData.number} - ${addressData.neighborhood}, ${addressData.zip_code}`}
                  </Text>
                </View>
              ) : (
                <Text>Carregando endereço...</Text>
              )}
            </View>
          </View>
        </Provider>
      );
};

const style = StyleSheet.create({
  contact: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactTItle: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#000E19',
  },
  phone: {
    color: '#585555',
    fontSize: 18,
    marginLeft: 20
  },
  addressText: {
    color: '#585555',
    fontSize: 18,
    marginLeft: 20
  }
});

export default ContactAddress;

