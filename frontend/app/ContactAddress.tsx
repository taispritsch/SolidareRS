import { Alert, StyleSheet, View } from "react-native";
import { IconButton, Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { useLocalSearchParams } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

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
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapError, setMapError] = useState(false);

  async function fetchPlaceData() {
    try {
      const response = await axiosInstance.get(`/community/${placeId}`);
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
      const response = await axiosInstance.get(`/community/addresses/${addressId}`);
      setAddressData(response.data);
  
      const fullAddress = `${response.data.street}, ${response.data.number}, ${response.data.neighborhood}, ${response.data.zip_code}, Brasil`;
      const encoded = encodeURIComponent(fullAddress);
      const googleApiKey = "AIzaSyBgme7TN9CCSkA3cUmE1SspvWHJSMvU2Fc";
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${googleApiKey}`;
  
      const googleRes = await fetch(googleUrl);
      const googleData = await googleRes.json();
  
      if (googleData.status === "OK" && googleData.results.length > 0) {
        const location = googleData.results[0].geometry.location;
        setPosition({
          latitude: location.lat,
          longitude: location.lng
        });
      } else {
        throw new Error("Google Maps não retornou coordenadas");
      }
  
    } catch (error) {
      console.error("Erro ao buscar o endereço ou coordenadas:", error);
      setMapError(true);
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
            <View style={{ alignItems: 'flex-start', marginVertical: 20 }}>
                <ShimmerPlaceholder
                  style={{ 
                    height: 40,
                    width: "50%", 
                    marginBottom: 10, 
                    borderRadius: 8 
                  }} />
                <ShimmerPlaceholder 
                  style={{ 
                    height: 20,
                    width: "80%", 
                    marginBottom: 10, 
                    borderRadius: 8 
                  }} />
                </View>
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

              {!mapError && position ? (
                <View style={{ flex: 1, marginTop: 20 }}>
                    < MapView
                      style={{ height: 300, width: '100%' }}
                      initialRegion={{
                        latitude: position.latitude,
                        longitude: position.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: position.latitude,
                          longitude: position.longitude
                        }}
                        title={placeData?.description}
                        description="Local de doação"
                      />
                    </MapView>
                  </View>
              ) : (
                <Text style={{ marginTop: 20, color: "#999", fontStyle: "italic" }}>
                  Não foi possível carregar o mapa com o endereço indicado.
                </Text>
              )}
            </View>
          ) : (
            <View style={{ alignItems: 'flex-start', marginVertical: 20 }}>
                <ShimmerPlaceholder 
                  style={{ 
                    height: 40,
                    width: "50%", 
                    marginBottom: 10, 
                    borderRadius: 8 
                  }} />
                <ShimmerPlaceholder 
                  style={{ 
                    height: 20,
                    width: "80%", 
                    marginBottom: 10, 
                    borderRadius: 8 
                  }} />
                </View>
          )}
        </View>
      </View>
    </Provider >
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

