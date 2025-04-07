import {  Alert, StyleSheet, View } from "react-native";
import {  IconButton, Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axiosInstance from "@/services/axios";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

interface Hour {
  start: string;
  end: string;
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
      const response = await axiosInstance.get(`/community/${placeId}/business-hours`);
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

    return (
      <Provider>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={style.contact}>
              <IconButton icon="clock-outline" size={35} iconColor="#000000" />
              <Text style={style.contactTitle}>Horário para doações</Text>
            </View>
            {businessHours ? (
              businessHours
                .filter(day => day.hours.length > 0) 
                .map((day, index) => (
                  <View key={index} style={style.dayContainer}>
                    <Text style={style.dayOfWeek}>{day.day_of_week}</Text>
                    <View style={style.hoursContainer}>
                      {day.hours.map((hour, idx) => (
                        <Text key={idx} style={style.hourText}>
                          {hour.start} às {hour.end}
                          {idx < day.hours.length - 1 ? " | " : ""}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))
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
    padding: 12,
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 10
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hourText: {
    fontSize: 16,
    color: '#585555',
    fontWeight: 'semibold',
    marginTop: 10,
  },
});

export default DonationTime;

