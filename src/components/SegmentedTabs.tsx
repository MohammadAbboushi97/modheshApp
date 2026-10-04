import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';

type Props<T extends string> = {
  tabs: Array<{key: T; label: string}>;
  active: T;
  onChange: (key: T) => void;
  variant?: 'solid' | 'underline';
};

const SegmentedTabs = <T extends string>({
  tabs,
  active,
  onChange,
  variant = 'solid',
}: Props<T>) => (
  <View style={variant === 'solid' ? styles.solidRow : styles.underlineRow}>
    {tabs.map(tab => {
      const selected = tab.key === active;
      return (
        <TouchableOpacity
          key={tab.key}
          style={[
            variant === 'solid' ? styles.solidTab : styles.underlineTab,
            selected &&
              (variant === 'solid'
                ? styles.solidTabActive
                : styles.underlineTabActive),
          ]}
          onPress={() => onChange(tab.key)}>
          <Text
            style={[
              variant === 'solid' ? styles.solidText : styles.underlineText,
              selected &&
                (variant === 'solid'
                  ? styles.solidTextActive
                  : styles.underlineTextActive),
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  solidRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  solidTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  solidTabActive: {
    backgroundColor: colors.primary,
  },
  solidText: {
    color: colors.primary,
    fontWeight: '700',
  },
  solidTextActive: {
    color: colors.accent,
  },
  underlineRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginBottom: 12,
  },
  underlineTab: {
    paddingVertical: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  underlineTabActive: {
    borderBottomColor: colors.primary,
  },
  underlineText: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 15,
  },
  underlineTextActive: {
    color: colors.primary,
  },
});

export default SegmentedTabs;
