import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  onPress: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ title, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <IconButton
          icon="chevron-right"
          size={30} 
          onPress={onPress}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#0a52b5',
    borderRadius: 7,
    borderLeftWidth: 10,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default DynamicCard;
