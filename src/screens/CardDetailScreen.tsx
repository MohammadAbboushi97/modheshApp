import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import {colors} from '../theme/colors';
import {RootStackParamList} from '../navigation/AppNavigator';

const slides = [
  require('../assest/Profile-Banner.png'),
  require('../assest/dahsheh.png'),
  require('../assest/Profile-Logo.png'),
];

const infoCards = [
  {
    image: require('../assest/Profile-Banner.png'),
    description: 'Featured banner',
    bgColor: '#e74c3c',
  },
  {
    image: require('../assest/dahsheh.png'),
    description: 'Brand showcase',
    bgColor: '#3498db',
  },
  {
    image: require('../assest/Profile-Logo.png'),
    description: 'Company logo',
    bgColor: '#27ae60',
  },
  {
    image: require('../assest/Profile-Banner.png'),
    description: 'Seasonal highlight',
    bgColor: '#f1c40f',
  },
];

const CardDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CardDetail'>>();
  const {title} = route.params;
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (!slideWidth) {
      return;
    }
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({x: next * slideWidth, animated: true});
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [slideWidth]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!slideWidth) {
      return;
    }
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / slideWidth,
    );
    setActiveIndex(nextIndex);
  };

  return (
    <AuthenticatedLayout title={title} contentStyle={styles.pageContent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View
          style={styles.carousel}
          onLayout={event => setSlideWidth(event.nativeEvent.layout.width)}>
          <ScrollView
            horizontal
            pagingEnabled
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            contentContainerStyle={styles.carouselScroll}>
            {slides.map((source, index) => (
              <View
                key={index}
                style={[styles.slide, {width: slideWidth || '100%'}]}>
                <Image source={source} style={styles.slideImage} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.cardsGrid}>
          {infoCards.map((card, index) => (
            <View key={index} style={styles.infoCard}>
              <Image source={card.image} style={styles.infoImage} />
              <Text
                style={[styles.infoText, {backgroundColor: card.bgColor}]}>
                {card.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    backgroundColor: colors.accent,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  carousel: {
    marginBottom: 18,
  },
  carouselScroll: {
    alignItems: 'center',
  },
  slide: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d7ccba',
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  infoCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2d8c5',
    overflow: 'hidden',
  },
  infoImage: {
    width: '100%',
    aspectRatio: 1.2,
    height: undefined,
    resizeMode: 'cover',
  },
  infoText: {
    padding: 10,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default CardDetailScreen;
