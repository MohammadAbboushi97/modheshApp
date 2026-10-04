import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
};

const StarRating: React.FC<Props> = ({value, size = 14, onChange}) => (
  <View style={styles.row}>
    {[1, 2, 3, 4, 5].map(star => {
      const glyph = (
        <Text
          style={[
            {fontSize: size},
            star <= value ? styles.filled : styles.empty,
          ]}>
          ★
        </Text>
      );
      return onChange ? (
        <TouchableOpacity
          key={star}
          accessibilityLabel={`Rate ${star} out of 5`}
          onPress={() => onChange(star)}>
          {glyph}
        </TouchableOpacity>
      ) : (
        <View key={star}>{glyph}</View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  filled: {
    color: colors.star,
  },
  empty: {
    color: colors.dotInactive,
  },
});

export default StarRating;
