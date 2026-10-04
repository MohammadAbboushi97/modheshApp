import React from 'react';
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppNavigation} from '../navigation/types';
import {InfoPageKey, infoPages} from '../data/content';
import {useAppConfig} from '../context/AppConfigContext';
import {colors} from '../theme/colors';

const socialIcons = {
  facebook: {label: 'Facebook', icon: require('../assest/facebook.png')},
  instagram: {label: 'Instagram', icon: require('../assest/instagram.png')},
  whatsapp: {label: 'WhatsApp', icon: require('../assest/whatsapp.png')},
};

const pageLinks: Array<{key: InfoPageKey; label: string}> = [
  {key: 'about', label: 'About'},
  {key: 'terms', label: 'Terms'},
  {key: 'privacy', label: 'Privacy'},
  {key: 'faq', label: 'FAQ'},
  {key: 'guide', label: 'User Guide'},
  {key: 'developer', label: 'Developer'},
];

// App footer shown at the bottom of home, sector and settings pages.
const AppFooter: React.FC = () => {
  const navigation = useNavigation<AppNavigation>();
  const {social} = useAppConfig().config;
  // Only networks configured on the server are shown.
  const socialLinks = (
    Object.keys(socialIcons) as Array<keyof typeof socialIcons>
  )
    .filter(key => social[key])
    .map(key => ({...socialIcons[key], url: social[key] as string}));

  const shareApp = () =>
    Share.share({
      message: 'Discover the best offers and discounts with Modhesh!',
    });

  return (
    <View style={styles.footer}>
      <Text style={styles.followText}>Follow us on</Text>
      <View style={styles.socialRow}>
        {socialLinks.map(link => (
          <TouchableOpacity
            key={link.label}
            accessibilityLabel={link.label}
            onPress={() => Linking.openURL(link.url)}>
            <Image source={link.icon} style={styles.socialIcon} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.linksRow}>
        {pageLinks.map(link => (
          <TouchableOpacity
            key={link.key}
            onPress={() => navigation.navigate('Info', infoPages[link.key])}>
            <Text style={styles.link}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.action} onPress={shareApp}>
          <Text style={styles.actionText}>↗ Share app</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action}
          onPress={() =>
            navigation.navigate('Info', {
              title: 'Rate us',
              body: 'Store rating links will be added once the app is published. Thank you for helping us grow!',
            })
          }>
          <Text style={styles.actionText}>★ Rate us</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🇯🇴 Jordan</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🌐 English</Text>
        </View>
      </View>

      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Modhesh. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.darkSurface,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  followText: {
    color: colors.onDark,
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 8,
  },
  socialIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
    gap: 14,
  },
  link: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  action: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  pill: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: {
    color: colors.onDark,
    fontSize: 13,
  },
  copyright: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 14,
  },
});

export default AppFooter;
