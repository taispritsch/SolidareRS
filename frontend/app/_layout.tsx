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
    headerBackTitleVisible: false, 
    headerBackTitle: '-',
    headerBackTitleStyle: { fontSize: 1 },
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

            <Stack.Screen name="HomeScreenCommunity" options={
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
                name="VolunteerScreen"
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

            <Stack.Screen name="BusinessHourScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationCategoryForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationItemForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationItemUrgentForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="UrgentDonationScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationProductScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="DonationClothesForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="ClothingDonationScreen" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="CityLocations" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
                headerBackTitle: '-',
                headerBackTitleStyle: { fontSize: 1 },
            })}
            />

            <Stack.Screen name="Location" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
                headerBackTitle: '-',
                headerBackTitleStyle: { fontSize: 1 },
            })}
            />

            <Stack.Screen name="DonationTime" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="VolunteeringTime" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="ContactAddress" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
            })}
            />

            <Stack.Screen name="VoluntaryForm" options={({ route }) => ({
                ...sharedHeaderStyle,
                headerTitle: route.params.title,
                headerBackTitleVisible: false,
                headerBackImage: () => null
            })}
            />

            <Stack.Screen name="AccessScreen" options={
                {
                    headerShown: false
                }
            } />

        </Stack>
    );
};

export default RootLayout;
