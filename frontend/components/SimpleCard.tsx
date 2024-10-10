import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider } from 'react-native-paper';

interface SimpleCardProps {
    title: string;
    selected: boolean;
    onPress: () => void;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
    title,
    selected,
    onPress,
}) => {

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    return (
        <Provider
            theme={{
                colors: {
                    ...DefaultTheme.colors,
                    onSurface: '#202020',
                },
                fonts: {
                    bodyLarge: {
                        fontFamily: 'Roboto',
                        fontSize: 14,
                    },
                },
                roundness: 8,
            }}
        >
            <Card style={[styles.card, selected ? { borderColor: '#0041A3', borderWidth: 2 } : {}]} onPress={onPress} >
                <View style={styles.cardContent}>
                    <Text style={[styles.title]}>{title}</Text>
                </View>
            </Card >
        </Provider>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 7,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
        height: 45,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
        padding: 10,
    },
    title: {
        fontWeight: 'bold',
    },
});

export default SimpleCard;
