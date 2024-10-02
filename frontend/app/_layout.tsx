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

            <Stack.Screen name="LoginScreen" options={
                {
                    headerShown: false
                }
            } />

            <Stack.Screen name="WelcomeScreen" options={
                {
                    headerShown: false
                }
            } />

            <Stack.Screen name="HomeScreen" options={
                {
                    headerShown: false,
                }
            } />

            <Stack.Screen
                name="UserScreen"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: route.params.title,
                    headerBackTitleVisible: false,
                })}
            />

            <Stack.Screen
                name="UserForm"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: route.params.title,
                    headerBackTitleVisible: false,
                })}
            />


            <Stack.Screen
                name="CityHallForm"
                options={({ route }) => ({
                    ...sharedHeaderStyle,
                    headerTitle: 'Novo órgão público',
                    headerBackTitleVisible: false,
                })}
            />

            <Stack.Screen name="ResetPasswordForm" options={
                {
                    headerShown: false
                }
            } />

            <Stack.Screen name="PlaceScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="PlaceForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="PlaceOptionsScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />
        </Stack>
    );
};

export default RootLayout;
