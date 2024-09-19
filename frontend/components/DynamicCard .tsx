import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon, IconButton } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  icon?: string;
  description?: string;
  onPress: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ title, icon, description, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardContentTitle}>
          {icon && <Icon source={icon} color={'#0041A3'} size={30} />}
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.title, icon ? { marginLeft: 10 } : {}]}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
        <IconButton
          icon="chevron-right"
          size={35}
          iconColor={'#0041A3'}
          onPress={onPress}
        />
      </View>
    </Card >
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
    height: 80,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#000',
  }
});

export default DynamicCard;
