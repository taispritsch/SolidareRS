import { Colors } from '@/constants/Colors';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button, Card, DefaultTheme, Icon, IconButton, Menu, Provider } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  category?: string;
  icon?: string;
  description?: string;
  hasOptionMenu?: boolean;
  menuOptions?: string[];
  editTitle?: string;
  deleteTitle?: string;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletPress?: () => void;
  onViewSizesPress?: () => void; 
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  category,
  icon,
  description,
  hasOptionMenu,
  menuOptions = [],
  editTitle = 'Editar',
  deleteTitle = 'Excluir',
  onPress,
  onEditPress,
  onDeletPress,
  onViewSizesPress,
}) => {

  const [visible, setVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false); 

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const openViewSizesModal = () => {
    setModalVisible(true);
    closeMenu();
    onViewSizesPress && onViewSizesPress(); 
  };

  return (
    <Provider
      theme={{
        colors: {
          ...DefaultTheme.colors,
          onSurface: '#202020',
        },

        roundness: 8,
      }}
    >
      <Card style={styles.card} onPress={onPress} >
        <View style={styles.cardContent}>
          <View style={styles.cardContentTitle}>
            {icon && <Icon source={icon} color={'#000E19'} size={30} />}
            <View style={{ flexDirection: 'column' }}>
            {category && <Card style={styles.category}><Text style={styles.categoryName}>{category}</Text></Card>}
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
                    titleStyle={{ flexWrap: 'wrap', width: '100%' }}
                  />
                )}
                {menuOptions.includes('visualizar') && (
                  <Menu.Item
                    onPress={openViewSizesModal}
                    title="Visualizar Tamanhos"
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
  category: {
    backgroundColor: Colors.backgroundButton,
    padding: 5,
    borderRadius: 4,
    marginBottom: 8
  },
  categoryName: {
    color: Colors.text,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    marginBottom: 20,
  },
  modalSubtitle: {
    textAlign: 'left'
  },
  closeModal: {
  },
});

export default DynamicCard;
