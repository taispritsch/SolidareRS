import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton, Card } from 'react-native-paper';

const LocationCard = ({ name, distance, onPress  }: { name: string; distance?: number; onPress: any }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={style.card} elevation={0}>
                <View style={style.content}>
                    <View>
                        <Text style={style.name}>{name}</Text>
                        {distance !== undefined && (
                            <Text style={style.distance}>{distance} km</Text>
                        )}
                    </View>
                    <IconButton
                        icon="map-marker-outline"
                        iconColor={'#0041A3'}
                        size={30}
                    />
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        backgroundColor: "transparent", 
        height: 90,
        marginBottom: 15,
        borderColor: Colors.backgroundButton
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    distance: {
        
    }
});


export default LocationCard;
