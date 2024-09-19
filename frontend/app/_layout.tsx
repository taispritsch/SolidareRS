import { router, Stack } from "expo-router"
import { Colors } from '../constants/Colors';

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

            <Stack.Screen name="UserScreen" options={({ route }) => ({
                headerTitle: route.params.title,
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
            })} />
        </Stack>
    );
};

export default RootLayout;
