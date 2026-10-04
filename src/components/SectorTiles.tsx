import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Sector, sectors} from '../data/content';
import {useAppConfig} from '../context/AppConfigContext';
import {colors} from '../theme/colors';

type Props = {
  onSelect: (sector: Sector) => void;
};

// Sector tiles: picture on top, colored label strip with icon below.
const SectorTiles: React.FC<Props> = ({onSelect}) => {
  const {sectorImage} = useAppConfig();
  return (
    <View style={styles.row}>
      {sectors.map(sector => (
        <TouchableOpacity
          key={sector.key}
          activeOpacity={0.85}
          style={styles.tile}
          onPress={() => onSelect(sector)}>
          <Image source={sectorImage(sector)} style={styles.image} />
          <View style={[styles.label, {backgroundColor: sector.color}]}>
            <Text style={styles.icon}>{sector.icon}</Text>
            <Text style={styles.title}>{sector.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  tile: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  label: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 13,
    marginTop: 2,
  },
});

export default SectorTiles;
