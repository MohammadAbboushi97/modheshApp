import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  message: string;
};

// The Dahsheh mascot with a speech bubble, shown between feed rows.
const MascotBanner: React.FC<Props> = ({message}) => (
  <View style={styles.row}>
    <Image source={require('../assest/dahsheh.png')} style={styles.mascot} />
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 10,
  },
  mascot: {
    width: 64,
    height: 88,
    resizeMode: 'contain',
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default MascotBanner;
