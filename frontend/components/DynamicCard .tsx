import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  icon?: string;
  description?: string;
  hasOptionMenu?: boolean;
  menuOptions?: string[];
  editTitle?: string; 
  deleteTitle?: string;
  onPress: () => void;
  onEditPress?: () => void;
  onDeletPress?: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  icon,
  description,
  hasOptionMenu,
  menuOptions = [],
  editTitle = 'Editar',
  deleteTitle = 'Excluir',
  onPress,
  onEditPress,
  onDeletPress,
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
      <Card style={styles.card} onPress={onPress} >
        <View style={styles.cardContent}>
          <View style={styles.cardContentTitle}>
            {icon && <Icon source={icon} color={'#000E19'} size={30} />}
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
                }
              >
                {menuOptions.includes('editar') && (
                  <Menu.Item
                    onPress={() => { closeMenu(); onEditPress && onEditPress(); }}
                    title={editTitle}
                  />
                )}
                {menuOptions.includes('excluir') && (
                  <Menu.Item
                    onPress={() => { closeMenu(); onDeletPress && onDeletPress(); }}
                    title={deleteTitle}
                    titleStyle={{ flexWrap: 'wrap', width: '100%'}} 
                  />
                )}
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
    backgroundColor: '#FFFFFF',
    height: 80,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
  },
  cardContentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 12,
    color: '#000',
  },
});

export default DynamicCard;
