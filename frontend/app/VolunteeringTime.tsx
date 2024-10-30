import { View } from "react-native";
import {  Provider, Text } from "react-native-paper";
import { styles } from "./styles"
import React, { useEffect } from "react";

const VolunteeringTime = () => {

    return (
        <Provider>
          <View style={styles.container}>
            <View style={styles.content}>
                <Text>Horário de voluntariado</Text>
            </View>
          </View>
        </Provider>
      );
};

export default VolunteeringTime;

