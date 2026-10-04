import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Store} from '../api/types';
import {resolveUrl} from '../api/client';
import StarRating from './StarRating';
import {colors} from '../theme/colors';

type Props = {
  store: Store;
  onPress: () => void;
};

// Merchant tile: round logo, name, rating and active offers count.
const StoreCard: React.FC<Props> = ({store, onPress}) => {
  const uri = resolveUrl(store.logoUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}>
      <View style={styles.logoWrap}>
        <Image
          source={uri ? {uri} : require('../assest/Profile-Logo.png')}
          style={styles.logo}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {store.storeName}
      </Text>
      <StarRating value={store.storeRate ?? 0} size={13} />
      <Text style={styles.offers}>{store.activeOffers ?? 0} active offers</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: 4,
  },
  logo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  name: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  offers: {
    color: colors.muted,
    fontSize: 12,
  },
});

export default StoreCard;
