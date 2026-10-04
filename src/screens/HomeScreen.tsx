import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {getOffers} from '../api/client';
import {Offer} from '../api/types';
import {useApi} from '../hooks/useApi';
import {mascotSlogans} from '../data/content';
import {useAppConfig} from '../context/AppConfigContext';
import {session} from '../data/session';
import {buildFeedRows, FeedRow, matchesQuery} from '../utils/feed';
import AppLayout from '../components/AppLayout';
import AdCarousel from '../components/AdCarousel';
import SectorTiles from '../components/SectorTiles';
import OfferCard from '../components/OfferCard';
import MascotBanner from '../components/MascotBanner';
import AppFooter from '../components/AppFooter';
import StateMessage from '../components/StateMessage';
import LoadingScreen from '../components/LoadingScreen';
import AdPopup from '../components/AdPopup';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PAGE_SIZE = 8;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {data: offers, isLoading, error, reload} = useApi(() => getOffers());
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const {config, isLoaded, slides, adPopupImage} = useAppConfig();
  const [adClosed, setAdClosed] = useState(session.adPopupShown);
  const showAd = isLoaded && !adClosed && adPopupImage !== null;

  const closeAd = useCallback(() => {
    session.adPopupShown = true;
    setAdClosed(true);
  }, []);

  const filtered = useMemo(
    () => (offers ?? []).filter(offer => matchesQuery(offer, query)),
    [offers, query],
  );
  const rows = useMemo(
    () => buildFeedRows(filtered.slice(0, visibleCount), mascotSlogans),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const openOffer = (offer: Offer) =>
    navigation.navigate('OfferDetail', {offer});

  const renderRow = ({item}: {item: FeedRow}) =>
    item.type === 'mascot' ? (
      <MascotBanner message={item.message} />
    ) : (
      <View style={styles.pair}>
        {item.offers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onPress={() => openOffer(offer)}
          />
        ))}
        {item.offers.length === 1 && <View style={styles.spacer} />}
      </View>
    );

  const header = (
    <View>
      <AdCarousel slides={slides} />
      <SectorTiles
        onSelect={sector =>
          navigation.navigate('Sector', {sectorKey: sector.key})
        }
      />
      <Text style={styles.sectionTitle}>
        {query ? `Results for "${query}"` : 'Latest offers'}
      </Text>
      {error && (
        <StateMessage
          message={error}
          actionLabel="Try again"
          onAction={reload}
        />
      )}
      {!error && offers && filtered.length === 0 && (
        <StateMessage
          message={query ? 'No offers match your search.' : 'No offers yet.'}
        />
      )}
    </View>
  );

  const footer = hasMore ? (
    <ActivityIndicator color={colors.primary} style={styles.moreLoader} />
  ) : (
    <AppFooter />
  );

  return (
    <AppLayout onSearchChange={handleSearch}>
      {isLoading && !offers ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={row => row.key}
          renderItem={renderRow}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          contentContainerStyle={styles.listContent}
          onEndReached={() => hasMore && setVisibleCount(c => c + PAGE_SIZE)}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={reload}
          showsVerticalScrollIndicator={false}
        />
      )}
      {adPopupImage && (
        <AdPopup
          visible={showAd}
          image={adPopupImage}
          durationSeconds={config.adPopup?.durationSeconds}
          onClose={closeAd}
        />
      )}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
  },
  pair: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  spacer: {
    flex: 1,
  },
  moreLoader: {
    marginVertical: 16,
  },
});

export default HomeScreen;
