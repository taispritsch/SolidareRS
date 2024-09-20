import { router, Stack } from "expo-router"
import { Colors } from '../constants/Colors';

const sharedHeaderStyle = {
    headerShown: true,
    headerTintColor: '#FFFFFF',
    headerStyle: {
        backgroundColor: Colors.backgroundHeader,

    },
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    headerTitleAlign: 'center',
};

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={
                {
                    headerShown: false
                }
            } />

            <Stack.Screen name="WelcomeScreen" options={
                {
                    headerShown: false
                }
            } />

            <Stack.Screen
                name="UserScreen"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: route.params.title,
                })}
            />

            <Stack.Screen
                name="UserForm"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: route.params.title,
                })}
            />


            <Stack.Screen
                name="CityHallForm"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: 'Novo órgão público',
                })}
            />
        </Stack>
    );
};

export default RootLayout;
