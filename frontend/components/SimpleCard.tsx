import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider, Switch } from 'react-native-paper';

interface SimpleCardProps {
    title: string;
    selected?: boolean;
    onPress?: () => void; 
    showSwitch?: boolean;
    disabled?: boolean;
    onSwitchChange?: (value: boolean) => void; 
}

const SimpleCard: React.FC<SimpleCardProps> = ({
    title,
    selected,
    onPress = () => {}, 
    showSwitch = false, 
    disabled = false,
    onSwitchChange,
}) => {

    const [visible, setVisible] = React.useState(false);
    const [switchValue, setSwitchValue] = React.useState(false); 

    const handleSwitchChange = (value: boolean) => {
        setSwitchValue(value);
        if (onSwitchChange) {
            onSwitchChange(value);
        }
    };

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
                    <View style={styles.switchContainer}>
                        <Text style={styles.subtitle}>Item</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {showSwitch && ( 
                        <View style={styles.switchContainer}>
                            <Text style={styles.subtitle}>Urgente</Text>
                            <Switch
                                value={switchValue}
                                onValueChange={handleSwitchChange}
                                disabled={disabled}
                                color={Colors.backgroundButton}
                            />
                        </View> 
                    )}
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
        
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
        alignContent: 'center',
        padding: 10,
    },
    switchContainer: {
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: 15,
    },
    subtitle: {
        fontSize: 12,
        color: '#666', 
    },
    title: {
        fontWeight: 'bold',
    },
});

export default SimpleCard;
