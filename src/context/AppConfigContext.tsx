import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ImageSourcePropType} from 'react-native';
import {getAppConfig, resolveUrl} from '../api/client';
import {AppConfig} from '../api/types';
import {Sector} from '../data/content';

// Used only when the backend cannot be reached, so the app still looks right.
const fallbackSlides: ImageSourcePropType[] = [
  require('../assest/Profile-Banner.png'),
  require('../assest/Profile-Logo.png'),
  require('../assest/Profile-Banner.png'),
];

const fallbackConfig: AppConfig = {
  homeSlides: [],
  sponsor: null,
  sectorImages: {},
  adPopup: null,
  social: {
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    whatsapp: 'https://wa.me/962795041122',
  },
  serviceNumbers: ['065520002', '0795041122', '0775041122'],
};

type AppConfigValue = {
  config: AppConfig;
  // True once the request finished, whether it succeeded or not.
  isLoaded: boolean;
  slides: ImageSourcePropType[];
  sectorImage: (sector: Sector) => ImageSourcePropType;
  adPopupImage: ImageSourcePropType | null;
};

const AppConfigContext = createContext<AppConfigValue | undefined>(undefined);

const remote = (url?: string): ImageSourcePropType | null => {
  const uri = resolveUrl(url);
  return uri ? {uri} : null;
};

export const AppConfigProvider = ({children}: {children: React.ReactNode}) => {
  const [config, setConfig] = useState<AppConfig>(fallbackConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAppConfig()
      .then(setConfig)
      .catch(() => setConfig(fallbackConfig))
      .finally(() => setIsLoaded(true));
  }, []);

  const value = useMemo<AppConfigValue>(() => {
    const slides = config.homeSlides
      .map(url => remote(url))
      .filter((source): source is ImageSourcePropType => source !== null);
    return {
      config,
      isLoaded,
      slides: slides.length ? slides : fallbackSlides,
      sectorImage: sector =>
        remote(config.sectorImages[sector.storeType]) ?? sector.image,
      adPopupImage: remote(config.adPopup?.imageUrl),
    };
  }, [config, isLoaded]);

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const ctx = useContext(AppConfigContext);
  if (!ctx) {
    throw new Error('useAppConfig must be used within AppConfigProvider');
  }
  return ctx;
};
