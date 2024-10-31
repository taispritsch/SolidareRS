import { CategoriesIcons } from '@/constants/CategoriesIcons';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider } from 'react-native-paper';

interface CategoriesFiltersProps {
    category: { id: number, description: keyof typeof CategoriesIcons, selected: boolean };
    onPress: () => void;
}

const CategoriesFilters: React.FC<CategoriesFiltersProps> = ({
    category,
    onPress,
}) => {

    return (
        <Card style={[styles.card, category.selected ? { backgroundColor: '#0041A3', borderWidth: 2, borderColor: '#0041A3'} : {}]} onPress={onPress} >
            <View style={styles.cardContent}>
                <View style={[
                    styles.cardContentTitle
                ]}>
                    <Icon source={CategoriesIcons[category.description]} color={category.selected ? '#FFFFFF' : '#000E19'} size={30} />
                    <View style={[
                        { flexDirection: 'column', marginTop: 10 }
                    ]}>
                        <Text 
                            style={[
                                styles.title,
                                category.selected ? { color: '#FFFFFF' } : { color: '#000E19' }
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {category.description}
                        </Text>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 7,
        margin: 5,
        width: 110,
        height: 90,
        padding: 10,
        display: 'flex',
        backgroundColor: '#fff',
    },
    cardContent: {
        display: 'flex',
        height: '100%',
    },
    cardContentTitle: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        color: '#000',
        flexWrap: 'wrap',

    },
});


export default CategoriesFilters;
