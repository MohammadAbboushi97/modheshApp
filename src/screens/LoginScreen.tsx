import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../hooks/useAuth';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login, isLoading, authError} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password.');
      return;
    }
    if (await login(username, password)) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('Home');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('../assest/Profile-Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require('../assest/Profile-Banner.png')}
            style={styles.banner}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
          />

          {(localError || authError) && (
            <Text style={styles.errorText}>{localError || authError}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Not registered yet?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.guestLink}
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.replace('Home')
            }>
            <Text style={styles.footerLink}>Continue as guest ›</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Backend integration is coming soon — login is mocked locally for
            now.
          </Text>
        </View>

        <View style={styles.promo}>
          <Image
            source={require('../assest/dahsheh.png')}
            style={styles.promoImage}
            resizeMode="contain"
          />
          <Text style={styles.promoText}>دهشة يرحب بكم</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  hero: {
    marginBottom: 12,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
  banner: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 3.2,
    height: undefined,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  label: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f5d8a4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    marginTop: 5,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: '#c0392b',
    marginTop: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  footerText: {
    color: colors.surface,
  },
  footerLink: {
    color: colors.accent,
    fontWeight: '700',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: 12,
  },
  helperText: {
    marginTop: 12,
    color: colors.surface,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  promo: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoImage: {
    width: 200,
    height: 120,
  },
  promoText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default LoginScreen;
