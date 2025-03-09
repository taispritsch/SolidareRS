import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from './styles';
import { FAB, Icon, Provider,  } from 'react-native-paper';
import DynamicCard from '@/components/DynamicCard ';
import axiosInstance from '@/services/axios';
import { useLocalSearchParams } from 'expo-router';

interface Volunteer {
    id: number;
    name: string;
    phone: string;
}

const VolunteerScreen = () => {
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/volunteers/${governmentId}/government-department`);
            setVolunteers(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Ocorreu um erro ao carregar os voluntários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Icon source="hand-heart" color={'#202020'} size={30} />
                        <Text style={styles.title}>Voluntários</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {loading ? (
                                <Text style={{ textAlign: 'center' }}>Carregando...</Text>
                            ) : volunteers.length === 0 ? (
                                <Text style={{ textAlign: 'center' }}>Nenhum voluntário cadastrado</Text>
                            ) : (
                                volunteers.map((volunteer, index) => (
                                    <DynamicCard
                                        key={index} 
                                        title={volunteer.name}
                                        description={volunteer.phone} 
                                        notShowButton
                                    />
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Provider>
    );
}

export default VolunteerScreen;