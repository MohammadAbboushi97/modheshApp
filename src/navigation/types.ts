import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Offer} from '../api/types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Sector: {sectorKey: string};
  Merchant: {storeId: number; storeName: string};
  OfferDetail: {offer: Offer};
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ContactUs: undefined;
  Info: {title: string; body: string};
};

export type AppNavigation = NativeStackNavigationProp<RootStackParamList>;
