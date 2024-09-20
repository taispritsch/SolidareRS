import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';

interface UserScreenProps {
    title: string;
}

const UserScreen = ({ title }: UserScreenProps) => {
    const governmentName = useLocalSearchParams().title;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconAndTextContainer}>
                    <Icon source="account-multiple" color={'#202020'} size={30} />
                    <Text style={styles.title}>Usuários</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <DynamicCard title="Gabrielli" description="gabrielli.sartori@universo.univates.br" hasOptionMenu onPress={() => console.log('Locais')} />
                        <DynamicCard title="Taís" description="gabrielli.sartori@universo.univates.br" hasOptionMenu onPress={() => console.log('Usuários')} />
                    </View>
                </ScrollView>

                <IconButton
                    style={styles.addButton}
                    icon="plus"
                    iconColor={'#FFFFFF'}
                    size={40}
                    onPress={() => router.push({ pathname: '/UserForm', params: { title: governmentName }})}
                    mode='contained'
                    containerColor={Colors.backgroundButton}
                />
            </View>
        </View>
    );
}

export default UserScreen;