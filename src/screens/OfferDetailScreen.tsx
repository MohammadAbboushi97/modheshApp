import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {resolveUrl} from '../api/client';
import {useAuth} from '../hooks/useAuth';
import AppLayout from '../components/AppLayout';
import StarRating from '../components/StarRating';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'OfferDetail'>;

// Ad detail: the full image plus interaction icons (like, comment, share,
// rate). Interactions are local only until the backend supports them.
const OfferDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {offer} = route.params;
  const {user} = useAuth();
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const uri = resolveUrl(offer.imageUrl);

  const requireLogin = (action: () => void) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    action();
  };

  const share = () =>
    Share.share({
      message: `${offer.storeName}: ${offer.offerDescription} — found on Modhesh`,
    });

  return (
    <AppLayout showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageCard}>
          <Image
            source={uri ? {uri} : require('../assest/Profile-Logo.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.action}
            onPress={() => requireLogin(() => setLiked(l => !l))}>
            <Text style={[styles.actionIcon, liked && styles.actionActive]}>
              {liked ? '♥' : '♡'}
            </Text>
            <Text style={styles.actionLabel}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.action}
            onPress={() =>
              requireLogin(() =>
                navigation.navigate('Info', {
                  title: 'Comments',
                  body: 'Comments are coming soon.',
                }),
              )
            }>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={share}>
            <Text style={styles.actionIcon}>↗</Text>
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {offer.storeId ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Merchant', {
                  storeId: offer.storeId as number,
                  storeName: offer.storeName,
                })
              }>
              <Text style={styles.store}>{offer.storeName} ›</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.store}>{offer.storeName}</Text>
          )}
          <Text style={styles.description}>{offer.offerDescription}</Text>
          <View style={styles.metaRow}>
            {offer.creationDate && (
              <Text style={styles.meta}>Posted {offer.creationDate}</Text>
            )}
            {offer.expireDate && (
              <Text style={styles.expiry}>Ends {offer.expireDate}</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.rateTitle}>Rate this offer</Text>
          <StarRating
            value={rating}
            size={28}
            onChange={value => requireLogin(() => setRating(value))}
          />
          {!user && (
            <Text style={styles.meta}>Log in to like, comment and rate.</Text>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.dark,
    borderRadius: 14,
    paddingVertical: 10,
  },
  action: {
    alignItems: 'center',
    minWidth: 70,
  },
  actionIcon: {
    fontSize: 22,
    color: colors.surface,
  },
  actionActive: {
    color: colors.accent,
  },
  actionLabel: {
    color: colors.onDark,
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  store: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  expiry: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  rateTitle: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
});

export default OfferDetailScreen;
