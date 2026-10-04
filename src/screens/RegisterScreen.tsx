import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type Gender = 'male' | 'female';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // On Android the dialog closes itself; hide our state either way.
    setShowPicker(false);
    if (event.type === 'set' && selected) {
      setBirthday(selected);
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!gender) {
      setError('Please select your gender.');
      return;
    }
    if (!birthday) {
      setError('Please select your birthday.');
      return;
    }

    setError(null);
    Alert.alert(
      'Account saved',
      `Welcome, ${firstName.trim()} ${lastName.trim()}!`,
      [{text: 'OK', onPress: () => navigation.replace('Login')}],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>

        <View style={styles.card}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {(['male', 'female'] as Gender[]).map(option => {
              const selected = gender === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    selected && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(option)}>
                  <Text
                    style={[
                      styles.genderText,
                      selected && styles.genderTextSelected,
                    ]}>
                    {option === 'male' ? 'Male' : 'Female'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}>
            <Text style={birthday ? styles.dateText : styles.datePlaceholder}>
              {birthday ? formatDate(birthday) : 'Select your birthday'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={birthday ?? new Date(2000, 0, 1)}
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={handleDateChange}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.replace('Login')}>
            <Text style={styles.backLinkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
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
    marginTop: 10,
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
  dateText: {
    color: colors.text,
    fontSize: 15,
  },
  datePlaceholder: {
    color: colors.muted,
    fontSize: 15,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f5d8a4',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  genderOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  genderText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  genderTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  errorText: {
    color: '#ffd7d2',
    marginTop: 12,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  backLinkText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default RegisterScreen;
