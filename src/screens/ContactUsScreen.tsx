import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
import {useAppConfig} from '../context/AppConfigContext';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactUs'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact page for complaints and suggestions, plus service numbers.
const ContactUsScreen: React.FC<Props> = ({navigation}) => {
  const {serviceNumbers, supportEmail} = useAppConfig().config;
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please write your message.');
      return;
    }
    setError(null);
    // TODO: post to a backend endpoint once one exists.
    Alert.alert(
      'Coming soon',
      'Sending messages from the app will be available soon. Meanwhile, please call one of our service numbers.',
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.titleRow}>
            <TouchableOpacity
              accessibilityLabel="Go back"
              onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>CONTACT US</Text>
            <View style={styles.backSpacer} />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.inputIcon}>✉️</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Subject"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <Text style={styles.inputIcon}>☰</Text>
          </View>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            placeholderTextColor={colors.muted}
            multiline
            textAlignVertical="top"
            style={[styles.inputRow, styles.messageInput]}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>

          {supportEmail && (
            <TouchableOpacity
              style={styles.numberRow}
              onPress={() => Linking.openURL('mailto:' + supportEmail)}>
              <Text style={styles.numberText}>✉️ {supportEmail}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Service Numbers</Text>
          {serviceNumbers.map(number => (
            <TouchableOpacity
              key={number}
              style={styles.numberRow}
              onPress={() => Linking.openURL(`tel:${number}`)}>
              <Text style={styles.numberText}>📞 {number}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  back: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: '700',
    width: 24,
  },
  backSpacer: {
    width: 24,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
  },
  inputIcon: {
    fontSize: 14,
    color: colors.muted,
  },
  messageInput: {
    minHeight: 120,
    color: colors.text,
    fontSize: 15,
    paddingTop: 10,
  },
  errorText: {
    color: '#ffd7d2',
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendText: {
    color: colors.dark,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionTitle: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 10,
  },
  numberRow: {
    backgroundColor: colors.dark,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  numberText: {
    color: colors.surface,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default ContactUsScreen;
