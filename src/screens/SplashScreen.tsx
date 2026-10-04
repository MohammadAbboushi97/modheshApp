import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../hooks/useAuth';
import {session} from '../data/session';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// Intro page: logo (1st quarter), slogan (2nd), sign-in box (3rd) and the
// mascot welcoming visitors (4th, bottom left).
const SplashScreen: React.FC<Props> = ({navigation}) => {
  const {user, login, isLoading, authError} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const continueIntoApp = useCallback(() => {
    navigation.replace(session.onboardingSeen ? 'Home' : 'Onboarding');
  }, [navigation]);

  // Signed in here or via the Register/Login screens: move on.
  useEffect(() => {
    if (user) {
      continueIntoApp();
    }
  }, [user, continueIntoApp]);

  const handleLogin = () => {
    setLocalError(null);
    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password.');
      return;
    }
    login(username, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Image
            source={require('../assest/Profile-Logo.png')}
            style={styles.logo}
          />
          <Image
            source={require('../assest/Profile-Banner.png')}
            style={styles.slogan}
          />

          <View style={styles.card}>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="👤  Username"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="🔒  Password"
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
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>
            <View style={styles.linksRow}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Create account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={continueIntoApp}>
                <Text style={styles.link}>Continue as guest ›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mascotRow}>
            <Image
              source={require('../assest/dahsheh.png')}
              style={styles.mascot}
            />
            <Text style={styles.welcome}>Dahsheh welcomes you!</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  slogan: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginTop: 8,
  },
  card: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  input: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    marginBottom: 10,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: '#ffd7d2',
    marginBottom: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  link: {
    color: colors.accent,
    fontWeight: '700',
  },
  mascotRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  mascot: {
    width: 80,
    height: 110,
    resizeMode: 'contain',
  },
  welcome: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 24,
  },
});

export default SplashScreen;
