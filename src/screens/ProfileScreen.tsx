import React, {useState} from 'react';
import {
  Alert,
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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../hooks/useAuth';
import {Gender} from '../context/AuthContext';
import StateMessage from '../components/StateMessage';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const parseDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Subscriber profile (dark design): avatar, name and editable details.
const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const {user, updateProfile} = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [gender, setGender] = useState<Gender | undefined>(user?.gender);
  const [birthday, setBirthday] = useState<Date | null>(
    parseDate(user?.birthday),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <StateMessage
          message="Log in to view and edit your profile."
          actionLabel="Login / Register"
          onAction={() => navigation.replace('Login')}
        />
      </SafeAreaView>
    );
  }

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
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
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      gender,
      birthday: birthday ? formatDate(birthday) : undefined,
    });
    Alert.alert('Profile saved', 'Your details have been updated.');
  };

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topRow}>
          <TouchableOpacity
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.avatarWrap}>
            <Image
              source={require('../assest/dahsheh.png')}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.country}>Jordan</Text>

          <View style={styles.card}>
            <Field
              icon="👤"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
            />
            <Field
              icon="👤"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
            />
            <Field
              icon="✉️"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />

            <View style={styles.genderRow}>
              {(['male', 'female'] as Gender[]).map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.radio}
                  onPress={() => setGender(option)}>
                  <View
                    style={[
                      styles.radioDot,
                      gender === option && styles.radioDotActive,
                    ]}
                  />
                  <Text style={styles.radioText}>
                    {option === 'male' ? 'Male' : 'Female'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.fieldRow}
              onPress={() => setShowPicker(true)}>
              <Text style={styles.birthdayText}>
                {birthday ? formatDate(birthday) : 'Enter birthday'}
              </Text>
              <Text style={styles.fieldIcon}>📅</Text>
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
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type FieldProps = React.ComponentProps<typeof TextInput> & {icon: string};

const Field: React.FC<FieldProps> = ({icon, ...inputProps}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldIcon}>{icon}</Text>
    <TextInput
      {...inputProps}
      placeholderTextColor={colors.muted}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.fieldInput}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  centered: {
    justifyContent: 'center',
    padding: 24,
  },
  flex: {
    flex: 1,
  },
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  back: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  avatarWrap: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.darkSurface,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 72,
    height: 96,
    resizeMode: 'contain',
  },
  name: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  country: {
    color: colors.onDark,
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.darkSurface,
    borderRadius: 18,
    padding: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
    paddingVertical: 4,
    marginBottom: 12,
    gap: 10,
  },
  fieldIcon: {
    fontSize: 16,
  },
  fieldInput: {
    flex: 1,
    color: colors.surface,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  birthdayText: {
    flex: 1,
    color: colors.onDark,
    fontSize: 16,
    paddingVertical: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 28,
    marginVertical: 8,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  radioDotActive: {
    backgroundColor: colors.primary,
  },
  radioText: {
    color: colors.surface,
    fontSize: 15,
  },
  errorText: {
    color: '#ffd7d2',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {
    color: colors.dark,
    fontWeight: '800',
    fontSize: 16,
  },
});

export default ProfileScreen;
