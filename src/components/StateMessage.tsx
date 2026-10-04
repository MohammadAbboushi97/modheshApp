import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Empty / error placeholder with an optional action button.
const StateMessage: React.FC<Props> = ({message, actionLabel, onAction}) => (
  <View style={styles.box}>
    <Text style={styles.text}>{message}</Text>
    {actionLabel && onAction && (
      <TouchableOpacity style={styles.button} onPress={onAction}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.accent,
    fontWeight: '700',
  },
});

export default StateMessage;
