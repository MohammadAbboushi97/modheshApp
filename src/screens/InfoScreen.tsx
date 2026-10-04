import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import AppLayout from '../components/AppLayout';
import MascotBanner from '../components/MascotBanner';
import AppFooter from '../components/AppFooter';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

// Simple text page used for footer links and sections not built yet.
const InfoScreen: React.FC<Props> = ({route}) => {
  const {title, body} = route.params;

  return (
    <AppLayout showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
        <MascotBanner message="We are always happy to help!" />
        <AppFooter />
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
});

export default InfoScreen;
