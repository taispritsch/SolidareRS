import { Colors } from '@/constants/Colors';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, DefaultTheme, Icon, IconButton, Menu, PaperProvider, Provider } from 'react-native-paper';

interface DynamicCardProps {
  title: string;
  category?: string;
  notShowButton?: boolean;
  icon?: string;
  description?: string;
  hasOptionMenu?: boolean;
  menuOptions?: string[];
  editTitle?: string;
  deleteTitle?: string;
  showButtonTopRight?: boolean;
  showButtonTopRightText?: string;
  showLocation?: boolean; 
  locationId?: number;
  locationName?: string;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletPress?: () => void;
  onViewSizesPress?: () => void;
  onEditUrgencyPress?: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  category,
  notShowButton,
  icon,
  description,
  hasOptionMenu,
  menuOptions = [],
  editTitle = 'Editar',
  deleteTitle = 'Excluir',
  showButtonTopRight,
  showButtonTopRightText,
  showLocation,
  locationId,
  locationName,
  onPress,
  onEditPress,
  onDeletPress,
  onViewSizesPress,
  onEditUrgencyPress,
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

      <Card style={styles.card} onPress={onPress} >
        <View style={styles.cardContent}>
          <View style={styles.cardContentTitle}>
              {category && 
              <Card style={styles.category}>
                <Text style={styles.categoryName}>{category}</Text>
              </Card>}
              <View style={{ flexDirection: 'row'}}>
                {icon && <Icon source={icon} color={'#000E19'} size={30} />}
                <View style={{ width: '100%', justifyContent: 'space-between'}}>
                  <Text style={[styles.title, icon ? { marginLeft: 10 } : {}]}>{title}</Text>
                  {description && 
                    <Text style={styles.description}>{description}</Text>}

                  {showLocation && locationName && (
                    <TouchableOpacity
                      style={styles.location} 
                      onPress={() => router.push({ pathname: '/Location', params: { title: locationName, id: locationId, initialTab: 'produtos' } })}
                    >
                      <Text style={styles.locationName}>{locationName}</Text>
                      <IconButton
                        icon="arrow-right"
                        size={15}
                        iconColor={'#202020'}
                        style={{ margin: 0, padding: 0 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
          </View>

          {!hasOptionMenu && !notShowButton && (
            <IconButton
              icon="chevron-right"
              size={35}
              iconColor={'#0041A3'}
              onPress={onPress}
            />
          )}

          {showButtonTopRight && (
            <Text style={{ fontSize: 12, color: '#000000', marginRight: 15, marginTop: 10, position: 'absolute', right: 0, top: 0 }}>{showButtonTopRightText}</Text>
          )}

          {hasOptionMenu && (
            <View style={{ zIndex: 999, elevation: 999 }}>
              <Menu
                contentStyle={{ backgroundColor: '#FFFFFF', zIndex: 999, elevation: 999, position: 'absolute' }}
                style={{ width: 150, height: 100, position: 'absolute' }}
                visible={visible}
                onDismiss={closeMenu}
                elevation={5}
                mode={'elevated'}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={30}
                    iconColor={'#0041A3'}
                    onPress={openMenu}
                    style={styles.menuButton}
                  />
                }
              >
                {menuOptions.includes('editar') && (
                  <Menu.Item
                    titleStyle={{ flexWrap: 'wrap', width: '100%', fontSize: 14, color: '#000000' }}
                    onPress={() => { closeMenu(); onEditPress && onEditPress(); }}
                    title={editTitle}
                    style={{ zIndex: 999, elevation: 999 }}
                  />
                )}
                {menuOptions.includes('editar urgência') && (
                  <Menu.Item
                  titleStyle={{ flexWrap: 'wrap', width: '100%', fontSize: 14, color: '#000000' }}
                    onPress={() => { closeMenu(); onEditUrgencyPress && onEditUrgencyPress(); }}
                    title="Editar urgência"
                    style={{ zIndex: 999, elevation: 999 }}
                    
                  />
                )}
                {menuOptions.includes('excluir') && (
                  <Menu.Item
                    titleStyle={{ flexWrap: 'wrap', width: '100%', fontSize: 14, color: '#000000' }}
                    onPress={() => { closeMenu(); onDeletPress && onDeletPress(); }}
                    title={deleteTitle}
                    style={{ zIndex: 999, elevation: 999 }}
                  />
                )}
                {menuOptions.includes('visualizar') && (
                  <Menu.Item
                    titleStyle={{ flexWrap: 'wrap', width: '100%', fontSize: 14, color: '#000000' }}
                    onPress={openViewSizesModal}
                    title="Visualizar Tamanhos"
                    style={{ zIndex: 999, elevation: 999 }}
                  />
                )}

              </Menu>
            </View>
          )}
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
    backgroundColor: '#FFFFFF',
    height: 85,
    zIndex: 1,
    elevation: 1,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
    paddingVertical: 10,
    zIndex: 1,
    elevation: 1,
  },
  cardContentTitle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 20,
    flex: 1,
  },
  category: {
    backgroundColor: Colors.backgroundButton,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  categoryName: {
    color: Colors.text,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
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
  location: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  locationName: {
    fontSize: 12,
    paddingRight: 0,
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
  menuButton: {
    zIndex: 10,
    position: 'relative',
  },
});

export default DynamicCard;
