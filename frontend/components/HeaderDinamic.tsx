import * as React from 'react';
import { Appbar } from 'react-native-paper';

interface MyComponentProps {
    title: string;
}
  
  const HeaderDinamic: React.FC<MyComponentProps> = ({ title }) => {
    const _goBack = () => console.log('Went back');
  
    const _handleSearch = () => console.log('Searching');
    
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={title} />
        <Appbar.Action icon="magnify" onPress={_handleSearch} />
      </Appbar.Header>
    );
  };
export default HeaderDinamic;