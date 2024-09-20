import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  icon?: string;
  description?: string;
  hasOptionMenu?: boolean;
  onPress: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ title, icon, description, hasOptionMenu, onPress }) => {

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
      <Card style={styles.card} onPress={onPress} >
        <View style={styles.cardContent}>
          <View style={styles.cardContentTitle}>
            {icon && <Icon source={icon} color={'#0041A3'} size={30} />}
            <View style={{ flexDirection: 'column' }}>
              <Text style={[styles.title, icon ? { marginLeft: 10 } : {}]}>{title}</Text>
              {description && <Text style={styles.description}>{description}</Text>}
            </View>
          </View>

          {!hasOptionMenu && (
            <IconButton
              icon="chevron-right"
              size={35}
              iconColor={'#0041A3'}
              onPress={onPress}
            />
          )}

          {hasOptionMenu && (
            <View>
              <Menu
                contentStyle={{ backgroundColor: '#FFFFFF' }}
                style={{ top: -20 }}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={30}
                    iconColor={'#0041A3'}
                    onPress={openMenu}
                  />
                }>
                <Menu.Item
                  onPress={() => { }} title="Editar" />
                <Menu.Item onPress={() => { }} title="Excluir" />
              </Menu>
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
