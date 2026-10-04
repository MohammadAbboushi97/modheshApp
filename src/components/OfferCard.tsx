import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Offer} from '../api/types';
import {resolveUrl} from '../api/client';
import {colors} from '../theme/colors';

type Props = {
  offer: Offer;
  onPress: () => void;
};

const OfferCard: React.FC<Props> = ({offer, onPress}) => {
  const uri = resolveUrl(offer.imageUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}>
      <Image
        source={uri ? {uri} : require('../assest/Profile-Logo.png')}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.store} numberOfLines={1}>
          {offer.storeName}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {offer.offerDescription}
        </Text>
        {offer.expireDate && (
          <Text style={styles.expiry}>Ends {offer.expireDate}</Text>
        )}
      </View>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
    height: undefined,
    resizeMode: 'contain',
    backgroundColor: colors.surface,
  },
  body: {
    padding: 10,
    backgroundColor: colors.primary,
    flexGrow: 1,
  },
  store: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  description: {
    color: colors.surface,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  expiry: {
    color: colors.onDark,
    fontSize: 11,
    marginTop: 6,
  },
});

export default OfferCard;
