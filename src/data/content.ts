import {ImageSourcePropType} from 'react-native';
import {sectorColors} from '../theme/colors';

export type Sector = {
  key: string;
  // Matches Stores.storeType on the backend.
  storeType: string;
  title: string;
  icon: string;
  color: string;
  image: ImageSourcePropType;
};

export const sectors: Sector[] = [
  {
    key: 'horeca',
    storeType: 'HoReCa',
    title: 'HoReCa',
    icon: '🍽️',
    color: sectorColors.blue,
    image: require('../assest/Profile-Banner.png'),
  },
  {
    key: 'retail',
    storeType: 'Retail',
    title: 'Retail',
    icon: '🛒',
    color: sectorColors.red,
    image: require('../assest/Profile-Logo.png'),
  },
  {
    key: 'wholesale',
    storeType: 'Wholesale',
    title: 'Wholesale',
    icon: '🏬',
    color: sectorColors.yellow,
    image: require('../assest/Profile-Banner.png'),
  },
];

// Short slogans the mascot shows between feed rows.
export const mascotSlogans = [
  'One trip and you are covered!',
  'We want to save you money.',
  'Relax — we have got your back.',
  'Browse more, save more.',
  'With us, your wallet saves more.',
];

export const onboardingSlides = [
  {
    title: 'Welcome to Modhesh',
    body: 'All the offers and discounts around you, gathered in one app.',
  },
  {
    title: 'Something for everyone',
    body: 'Visitors browse freely, subscribers collect points and perks, and merchants reach more customers.',
  },
  {
    title: 'Find it fast',
    body: 'Search by sector, store or ad, filter by photos or videos, and save the deals you love.',
  },
];

export const infoPages = {
  about: {
    title: 'About Modhesh',
    body: 'Modhesh gathers offers and discounts from merchants across Jordan so you can find the best deal in one place.',
  },
  terms: {
    title: 'Terms & Conditions',
    body: 'The full terms and conditions will be published here.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'The full privacy policy will be published here.',
  },
  faq: {
    title: 'FAQ',
    body: 'Answers to the most frequently asked questions will be published here.',
  },
  guide: {
    title: 'User Guide',
    body: 'Guides for visitors, subscribers and merchants will be published here.',
  },
  developer: {
    title: 'App Developer',
    body: 'Developer information will be published here.',
  },
};

export type InfoPageKey = keyof typeof infoPages;
