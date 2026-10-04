import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {colors} from '../theme/colors';

type Props = {
  title?: string;
  children: React.ReactNode;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

const AuthenticatedLayout: React.FC<Props> = ({
  title = 'Home',
  children,
  onSearchChange,
  searchPlaceholder = 'Search',
  contentStyle,
}) => {
  const {user, logout} = useAuth();
  const [query, setQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearchChange?.(value);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>{title}</Text>
          <Text style={styles.userText}>
            {user ? `Signed in as ${user.username}` : 'Welcome'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={handleSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
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

      <View style={[styles.content, contentStyle]}>{children}</View>

      <View style={styles.bottomBar}>
        <Image
          source={require('../assest/facebook.png')}
          style={styles.socialIcon}
        />
        <Image
          source={require('../assest/instagram.png')}
          style={styles.socialIcon}
        />
        <Image
          source={require('../assest/whatsapp.png')}
          style={styles.socialIcon}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  topBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  appTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
  },
  userText: {
    marginTop: 4,
    color: '#f3e8da',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: colors.text,
    fontSize: 15,
  },
  searchInputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2d8c5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 70, // leave room for bottom bar
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#2c2c2c',
    borderTopColor: '#1a1a1a',
    borderTopWidth: 1,
  },
  socialIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});

export default AuthenticatedLayout;
