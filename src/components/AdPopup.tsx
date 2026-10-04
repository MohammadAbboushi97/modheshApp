import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  visible: boolean;
  image: ImageSourcePropType;
  durationSeconds?: number;
  onClose: () => void;
};

// Timed ad shown on the home screen; closes itself after a few seconds.
const AdPopup: React.FC<Props> = ({
  visible,
  image,
  durationSeconds = 4,
  onClose,
}) => {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setRemaining(durationSeconds);
    const timer = setInterval(
      () => setRemaining(prev => Math.max(prev - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [visible, durationSeconds]);

  useEffect(() => {
    if (visible && remaining === 0) {
      onClose();
    }
  }, [visible, remaining, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={image} style={styles.image} />
          <TouchableOpacity
            accessibilityLabel="Close ad"
            style={styles.close}
            onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Ad · {remaining}s</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});

export default AdPopup;
