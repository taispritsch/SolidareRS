import { Header } from '@/components/Header';
import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { Icon } from 'react-native-paper';

interface UserScreenProps {
    title: string;
}

const UserScreen = ({ title }: UserScreenProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconAndTextContainer}>
                    <Icon source="account-multiple" color={'#202020'} size={30} />
                    <Text style={styles.title}>Usuários</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <DynamicCard title="Gabrielli" description="gabrielli.sartori@universo.univates.br" onPress={() => console.log('Locais')} />
                        <DynamicCard title="Taís" description="gabrielli.sartori@universo.univates.br" onPress={() => console.log('Usuários')} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default UserScreen;