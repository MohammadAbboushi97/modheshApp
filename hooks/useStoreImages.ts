import { useState, useEffect } from 'react';
import { Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { fetchStoreImages } from '../services/api';

const useStoreImages = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeImages, setStoreImages] = useState<{ name: string; data: string }[]>([]);
  const [storeLoading, setStoreLoading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const loadImages = async () => {
    setStoreLoading(true);
    try {
      const data = await fetchStoreImages();
      setStoreImages(data);
    } catch {
      Alert.alert('Error', 'Failed to load store images');
    } finally {
      setStoreLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tab2' || activeTab === 'tab1') {
      loadImages();
    }
  }, [activeTab]);

  // Handler for FlatList/ScrollView onScroll event
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 100); // Show arrow if scrolled down 100px
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    storeImages,
    storeLoading,
    showScrollToTop,
    onScroll,
  };
};

export default useStoreImages;
