import {  Alert, StyleSheet, View } from "react-native";
import {  IconButton, Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axiosInstance from "@/services/axios";

interface Hour {
  opening: string;
  closing: string;
}

interface BusinessHour {
  day_of_week: string;
  hours: Hour[];
  type: string;
}

const DonationTime = () => {
  const { id: placeId } = useLocalSearchParams();
  const [businessHours, setBusinessHours] = useState<BusinessHour[] | null>(null);

  async function fetchDonationHours() {
    try {
      const response = await axiosInstance.get(`/donation-places/${placeId}/business-hours`);
      const donationHours = response.data.donation.filter((item: BusinessHour) => item.type === "donation");
      setBusinessHours(donationHours);
    } catch (error) {
      console.error("Erro ao buscar horários de doação:", error);
      Alert.alert("Erro", "Não foi possível carregar os horários de doação.");
    }
  }

  useEffect(() => {
    fetchDonationHours();
  }, []);

  console.log('HORAS', businessHours)
    return (
      <Provider>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={style.contact}>
              <IconButton icon="clock-outline" size={35} iconColor="#000000" />
              <Text style={style.contactTitle}>Horário para doações</Text>
            </View>
            {businessHours ? (
              businessHours.map((day, index) => (
                <View key={index} style={style.dayContainer}>
                  <Text style={style.dayOfWeek}>{day.day_of_week}</Text>
                  <Text style={style.hours}>
                    {day.hours.map((hour, idx) => (
                      <Text key={idx}>
                        aaa
                        {hour.opening} às {hour.closing}
                        {idx < day.hours.length - 1 ? " | " : ""}
                      </Text>
                    ))}
                  </Text>
                </View>
              ))
            ) : (
              <Text>Carregando...</Text>
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
  contactTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#000E19',
  },
  addressText: {
    color: '#585555',
    fontSize: 18,
    marginLeft: 20
  },
  dayContainer: {
    marginBottom: 12,
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  hours: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 16,
  },
});

export default DonationTime;

