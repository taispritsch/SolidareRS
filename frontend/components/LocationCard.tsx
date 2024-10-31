import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const LocationCard = ({ name, distance, onPress  }: { name: string; distance?: number; onPress: any }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={style.card}>
                <View style={style.content}>
                    <View style={style.textContainer}>
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
        borderColor: Colors.backgroundButton, 
        padding: 15,
        backgroundColor: "transparent", 
        height: 90,
        marginBottom: 15,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    distance: {
        fontSize: 14,
        color: "#666",
    },
});


export default LocationCard;
