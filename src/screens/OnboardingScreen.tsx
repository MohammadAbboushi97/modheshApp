import React, {useRef, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../navigation/types';
import {onboardingSlides} from '../data/content';
import {session} from '../data/session';
import {colors} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slideArt = [
  require('../assest/Profile-Logo.png'),
  require('../assest/dahsheh.png'),
  require('../assest/Profile-Banner.png'),
];

// First-visit intro slides: what the app is, who it is for, key features.
const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const isLast = index === onboardingSlides.length - 1;

  const finish = () => {
    session.onboardingSeen = true;
    navigation.replace('Home');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    scrollRef.current?.scrollTo({x: (index + 1) * width, animated: true});
    setIndex(index + 1);
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (width) {
      setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <View style={styles.dots}>
          {onboardingSlides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View
        style={styles.flex}
        onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}>
          {onboardingSlides.map((slide, i) => (
            <View key={slide.title} style={[styles.slide, {width}]}>
              <View style={styles.artFrame}>
                <Image source={slideArt[i]} style={styles.art} />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>{isLast ? 'Get started' : 'Next'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  flex: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.darkBorder,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accent,
  },
  skip: {
    color: colors.onDark,
    fontWeight: '600',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  artFrame: {
    width: 220,
    height: 300,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: colors.surface,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 32,
  },
  art: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  title: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.onDark,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default OnboardingScreen;
