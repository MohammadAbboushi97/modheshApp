import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SectorScreen from '../screens/SectorScreen';
import MerchantScreen from '../screens/MerchantScreen';
import OfferDetailScreen from '../screens/OfferDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import InfoScreen from '../screens/InfoScreen';
import {RootStackParamList} from './types';
import {colors} from '../theme/colors';

export type {RootStackParamList} from './types';

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

// Visitors can browse without an account; login/register are regular
// screens reachable from the splash box, header button or side menu.
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.accent},
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Sector" component={SectorScreen} />
      <Stack.Screen name="Merchant" component={MerchantScreen} />
      <Stack.Screen name="OfferDetail" component={OfferDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
