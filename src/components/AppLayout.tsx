import React, {useState} from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {AppNavigation} from '../navigation/types';
import {useAppConfig} from '../context/AppConfigContext';
import {resolveUrl} from '../api/client';
import {colors} from '../theme/colors';
import SideMenu from './SideMenu';

type Props = {
  children: React.ReactNode;
  showBack?: boolean;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

// Shared shell for browsing screens: sponsor strip, header and search stay
// fixed while the content scrolls underneath.
const AppLayout: React.FC<Props> = ({
  children,
  showBack,
  onSearchChange,
  searchPlaceholder = 'Search stores, sectors or ads',
  contentStyle,
}) => {
  const navigation = useNavigation<AppNavigation>();
  const {user} = useAuth();
  const {sponsor} = useAppConfig().config;
  const sponsorLogo = resolveUrl(sponsor?.logoUrl);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearchChange?.(value);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {sponsor && (
        <TouchableOpacity
          style={styles.sponsorBar}
          disabled={!sponsor.url}
          onPress={() => sponsor.url && Linking.openURL(sponsor.url)}>
          <Text style={styles.sponsorLabel}>Official sponsor</Text>
          <View style={styles.sponsorBrand}>
            {sponsorLogo && (
              <Image source={{uri: sponsorLogo}} style={styles.sponsorLogo} />
            )}
            <Text style={styles.sponsorName}>{sponsor.name}</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.topBar}>
        <View style={styles.leftGroup}>
          {showBack && navigation.canGoBack() && (
            <TouchableOpacity
              accessibilityLabel="Go back"
              style={styles.iconButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.iconText}>‹</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            accessibilityLabel="Open menu"
            style={styles.iconButton}
            onPress={() => setMenuOpen(true)}>
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.brand}
          onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../assest/Profile-Logo.png')}
            style={styles.brandLogo}
          />
          <Text style={styles.brandText}>Modhesh</Text>
        </TouchableOpacity>

        {user ? (
          <TouchableOpacity
            style={styles.userChip}
            onPress={() => setMenuOpen(true)}>
            <Text style={styles.userChipText} numberOfLines={1}>
              {user.firstName || user.username} ▾
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login / Register</Text>
          </TouchableOpacity>
        )}
      </View>

      {onSearchChange && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={handleSearchChange}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                accessibilityLabel="Clear search"
                onPress={() => handleSearchChange('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={[styles.content, contentStyle]}>{children}</View>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sponsorBar: {
    backgroundColor: colors.dark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  sponsorLabel: {
    color: colors.onDark,
    fontSize: 11,
  },
  sponsorBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sponsorLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  sponsorName: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  topBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '700',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  brandText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  loginButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  loginText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  userChip: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    maxWidth: 120,
  },
  userChipText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.accent,
  },
  searchInputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    color: colors.text,
    fontSize: 15,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.muted,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.muted,
  },
  content: {
    flex: 1,
    backgroundColor: colors.accent,
  },
});

export default AppLayout;
