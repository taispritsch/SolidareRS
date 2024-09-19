import { Stack } from "expo-router"

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={
                {
                    headerShown: false
                }
            } />
            <Stack.Screen name="WelcomeScreen" />
        </Stack>
    );
};

export default RootLayout;
