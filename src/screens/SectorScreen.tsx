import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {getOffers, getStores} from '../api/client';
import {useApi} from '../hooks/useApi';
import {mascotSlogans, sectors} from '../data/content';
import {useAppConfig} from '../context/AppConfigContext';
import {buildFeedRows, FeedRow, matchesQuery} from '../utils/feed';
import AppLayout from '../components/AppLayout';
import AdCarousel from '../components/AdCarousel';
import SegmentedTabs from '../components/SegmentedTabs';
import OfferCard from '../components/OfferCard';
import StoreCard from '../components/StoreCard';
import MascotBanner from '../components/MascotBanner';
import StateMessage from '../components/StateMessage';
import LoadingScreen from '../components/LoadingScreen';
import AppFooter from '../components/AppFooter';
import {Store} from '../api/types';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Sector'>;

type Filter = 'ads' | 'merchants' | 'coupons';
type Media = 'photos' | 'videos';

const filterTabs: Array<{key: Filter; label: string}> = [
  {key: 'ads', label: 'Ads'},
  {key: 'merchants', label: 'Merchants'},
  {key: 'coupons', label: 'Coupons'},
];

const mediaTabs: Array<{key: Media; label: string}> = [
  {key: 'photos', label: 'Photos'},
  {key: 'videos', label: 'Videos'},
];

const chunkPairs = <T,>(items: T[]) => {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
};

// Sector sub-screen: featured ads plus a filter between ads, merchants and
// coupons for one sector.
const SectorScreen: React.FC<Props> = ({navigation, route}) => {
  const sector =
    sectors.find(s => s.key === route.params.sectorKey) ?? sectors[0];
  const {slides} = useAppConfig();
  const [filter, setFilter] = useState<Filter>('ads');
  const [media, setMedia] = useState<Media>('photos');
  const [query, setQuery] = useState('');

  const offersApi = useApi(
    () => getOffers({storeType: sector.storeType}),
    [sector.storeType],
  );
  const storesApi = useApi(
    () => getStores(sector.storeType),
    [sector.storeType],
  );

  const offerRows = useMemo(
    () =>
      buildFeedRows(
        (offersApi.data ?? []).filter(o => matchesQuery(o, query)),
        mascotSlogans,
      ),
    [offersApi.data, query],
  );
  const storeRows = useMemo(
    () =>
      chunkPairs(
        (storesApi.data ?? []).filter(s =>
          s.storeName.toLowerCase().includes(query.trim().toLowerCase()),
        ),
      ),
    [storesApi.data, query],
  );

  const active = filter === 'merchants' ? storesApi : offersApi;
  const error = active.error;

  const openStore = (store: Store) =>
    navigation.navigate('Merchant', {
      storeId: store.id,
      storeName: store.storeName,
    });

  const renderOfferRow = ({item}: {item: FeedRow}) =>
    item.type === 'mascot' ? (
      <MascotBanner message={item.message} />
    ) : (
      <View style={styles.pair}>
        {item.offers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onPress={() => navigation.navigate('OfferDetail', {offer})}
          />
        ))}
        {item.offers.length === 1 && <View style={styles.spacer} />}
      </View>
    );

  const renderStoreRow = ({item}: {item: Store[]}) => (
    <View style={styles.pair}>
      {item.map(store => (
        <StoreCard
          key={store.id}
          store={store}
          onPress={() => openStore(store)}
        />
      ))}
      {item.length === 1 && <View style={styles.spacer} />}
    </View>
  );

  let emptyMessage: string | null = null;
  if (filter === 'coupons') {
    emptyMessage = `No coupons in ${sector.title} yet. Check back soon!`;
  } else if (filter === 'ads' && media === 'videos') {
    emptyMessage = 'No video ads yet.';
  } else if (!error && active.data) {
    const empty =
      filter === 'merchants' ? storeRows.length === 0 : offerRows.length === 0;
    if (empty) {
      emptyMessage = query
        ? 'Nothing matches your search.'
        : `No ${filter === 'merchants' ? 'merchants' : 'ads'} in ${
            sector.title
          } yet.`;
    }
  }

  const header = (
    <View>
      <AdCarousel slides={slides} height={170} />
      <View style={[styles.sectorBadge, {backgroundColor: sector.color}]}>
        <Text style={styles.sectorBadgeText}>
          {sector.icon} {sector.title}
        </Text>
      </View>
      <SegmentedTabs tabs={filterTabs} active={filter} onChange={setFilter} />
      {filter === 'ads' && (
        <SegmentedTabs
          tabs={mediaTabs}
          active={media}
          onChange={setMedia}
          variant="underline"
        />
      )}
      {error && filter !== 'coupons' && (
        <StateMessage
          message={error}
          actionLabel="Try again"
          onAction={active.reload}
        />
      )}
      {emptyMessage && <StateMessage message={emptyMessage} />}
    </View>
  );

  const showList = !emptyMessage && !error;

  return (
    <AppLayout showBack onSearchChange={setQuery}>
      {active.isLoading && !active.data ? (
        <LoadingScreen />
      ) : filter === 'merchants' ? (
        <FlatList
          key="merchants"
          data={showList ? storeRows : []}
          keyExtractor={row => row.map(s => s.id).join('-')}
          renderItem={renderStoreRow}
          ListHeaderComponent={header}
          ListFooterComponent={<AppFooter />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          key="offers"
          data={showList ? offerRows : []}
          keyExtractor={row => row.key}
          renderItem={renderOfferRow}
          ListHeaderComponent={header}
          ListFooterComponent={<AppFooter />}
          contentContainerStyle={styles.listContent}
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
  sectorBadge: {
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 14,
  },
  sectorBadgeText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 16,
  },
  pair: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  spacer: {
    flex: 1,
  },
});

export default SectorScreen;
