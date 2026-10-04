import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {AppNavigation} from '../navigation/types';
import {infoPages} from '../data/content';
import {colors} from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type MenuItem = {
  icon: string;
  label: string;
  requiresLogin?: boolean;
  onPress: () => void;
};

const comingSoon = (title: string) => ({
  title,
  body: 'This section is coming soon. Stay tuned!',
});

// Dark slide-in menu from the profile design.
const SideMenu: React.FC<Props> = ({visible, onClose}) => {
  const navigation = useNavigation<AppNavigation>();
  const {user, logout} = useAuth();

  const go = (action: () => void, requiresLogin?: boolean) => {
    onClose();
    if (requiresLogin && !user) {
      navigation.navigate('Login');
      return;
    }
    action();
  };

  const items: MenuItem[] = [
    {icon: '🏠', label: 'Home', onPress: () => navigation.navigate('Home')},
    {
      icon: '👤',
      label: 'Profile',
      requiresLogin: true,
      onPress: () => navigation.navigate('Profile'),
    },
    {
      icon: '⭐',
      label: 'My Points',
      requiresLogin: true,
      onPress: () => navigation.navigate('Info', comingSoon('My Points')),
    },
    {
      icon: '📋',
      label: 'My Orders',
      requiresLogin: true,
      onPress: () => navigation.navigate('Info', comingSoon('My Orders')),
    },
    {
      icon: '🗺️',
      label: 'My Address',
      requiresLogin: true,
      onPress: () => navigation.navigate('Info', comingSoon('My Address')),
    },
    {
      icon: '📍',
      label: 'Branches',
      onPress: () => navigation.navigate('Info', comingSoon('Branches')),
    },
    {
      icon: '✉️',
      label: 'Contact Us',
      onPress: () => navigation.navigate('ContactUs'),
    },
    {
      icon: '🛡️',
      label: 'Privacy and Policy',
      onPress: () => navigation.navigate('Info', infoPages.privacy),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.panel} edges={['top', 'bottom', 'left']}>
          <View style={styles.topRow}>
            <Text style={styles.topIcon}>🔔</Text>
            <TouchableOpacity accessibilityLabel="Close menu" onPress={onClose}>
              <Text style={styles.topIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrap}>
            <Image
              source={require('../assest/dahsheh.png')}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>
            {user ? user.firstName || user.username : 'Guest'}
          </Text>
          <Text style={styles.country}>Jordan</Text>

          <ScrollView style={styles.list}>
            {items.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.item}
                onPress={() => go(item.onPress, item.requiresLogin)}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <Text style={styles.itemText}>{item.label.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                go(() => (user ? logout() : navigation.navigate('Login')))
              }>
              <Text style={styles.itemIcon}>{user ? '🚪' : '🔑'}</Text>
              <Text style={styles.itemText}>
                {user ? 'SIGN OUT' : 'SIGN IN / REGISTER'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        <Pressable
          style={styles.backdrop}
          accessibilityLabel="Close menu"
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    width: '75%',
    maxWidth: 320,
    backgroundColor: colors.dark,
    paddingHorizontal: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  topIcon: {
    fontSize: 20,
    color: colors.surface,
  },
  avatarWrap: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.darkSurface,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 64,
    height: 84,
    resizeMode: 'contain',
  },
  name: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  country: {
    color: colors.onDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBorder,
  },
  itemIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  itemText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default SideMenu;
