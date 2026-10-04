import React, {useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {getOffers, getStore, resolveUrl} from '../api/client';
import {useApi} from '../hooks/useApi';
import {mascotSlogans} from '../data/content';
import {buildFeedRows, FeedRow} from '../utils/feed';
import AppLayout from '../components/AppLayout';
import SegmentedTabs from '../components/SegmentedTabs';
import OfferCard from '../components/OfferCard';
import MascotBanner from '../components/MascotBanner';
import StarRating from '../components/StarRating';
import StateMessage from '../components/StateMessage';
import LoadingScreen from '../components/LoadingScreen';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Merchant'>;

type Media = 'photos' | 'videos';

const mediaTabs: Array<{key: Media; label: string}> = [
  {key: 'photos', label: 'Photos'},
  {key: 'videos', label: 'Videos'},
];

// Merchant profile: logo, details and rating on top, their ads below.
const MerchantScreen: React.FC<Props> = ({navigation, route}) => {
  const {storeId, storeName} = route.params;
  const storeApi = useApi(() => getStore(storeId), [storeId]);
  const offersApi = useApi(() => getOffers({storeId}), [storeId]);
  const [media, setMedia] = useState<Media>('photos');

  const store = storeApi.data;
  const logo = resolveUrl(store?.logoUrl);
  const rows =
    media === 'photos'
      ? buildFeedRows(offersApi.data ?? [], mascotSlogans)
      : [];
  const error = storeApi.error || offersApi.error;

  const renderRow = ({item}: {item: FeedRow}) =>
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

  const header = (
    <View>
      <View style={styles.profileCard}>
        <View style={styles.logoWrap}>
          <Image
            source={logo ? {uri: logo} : require('../assest/Profile-Logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{store?.storeName ?? storeName}</Text>
          {store?.storeType && (
            <Text style={styles.detail}>🏷️ {store.storeType}</Text>
          )}
          {store?.address && (
            <Text style={styles.detail}>📍 {store.address}</Text>
          )}
          <View style={styles.ratingRow}>
            <StarRating value={store?.storeRate ?? 0} size={15} />
            <Text style={styles.detail}>
              {store?.activeOffers ?? offersApi.data?.length ?? 0} offers
            </Text>
          </View>
        </View>
      </View>

      <SegmentedTabs
        tabs={mediaTabs}
        active={media}
        onChange={setMedia}
        variant="underline"
      />

      {error && (
        <StateMessage
          message={error}
          actionLabel="Try again"
          onAction={() => {
            storeApi.reload();
            offersApi.reload();
          }}
        />
      )}
      {!error && media === 'videos' && (
        <StateMessage message="No video ads yet." />
      )}
      {!error && media === 'photos' && offersApi.data?.length === 0 && (
        <StateMessage message="This merchant has no active offers right now." />
      )}
    </View>
  );

  return (
    <AppLayout showBack>
      {storeApi.isLoading && !store ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={row => row.key}
          renderItem={renderRow}
          ListHeaderComponent={header}
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
  profileCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 14,
    marginBottom: 16,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 68,
    height: 68,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  detail: {
    color: colors.text,
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
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

export default MerchantScreen;
