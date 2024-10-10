import React, { useState } from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';
import { Provider, Snackbar } from 'react-native-paper';

const PlaceOptionsScreen = () => {
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { placeName, showSnackbar, action, placeId } = useLocalSearchParams();
    const [visible, setVisible] = React.useState(false);

    const onDismissSnackBar = () => setVisible(false);

    React.useEffect(() => {
        if (showSnackbar) {
            if (action === 'edit') {
                setSnackbarMessage('Horário atualizado com sucesso!');
            }
            setVisible(true);
        }

    }, [showSnackbar, action]);

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Text style={styles.title}>{placeName}</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            <DynamicCard
                                title="Horários"
                                icon="clock-time-three-outline"
                                onPress={() => router.push({ pathname: '/BusinessHourScreen', params: { title: placeName, donationPlaceId: placeId } })}
                            />
                            <DynamicCard
                                title="Itens"
                                icon="archive-outline"
                                onPress={() => router.push({ pathname: '/DonationScreen', params: { title: placeName, donationPlaceId: placeId, placeName: placeName } })}
                            />
                            <DynamicCard
                                title="Itens urgentes"
                                icon="alert-outline"
                                onPress={() => console.log('Press')}
                            />
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
                </View>
            </View>
        </Provider>
    );
}

export default PlaceOptionsScreen;