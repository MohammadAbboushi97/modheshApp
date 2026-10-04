import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  slides: ImageSourcePropType[];
  height?: number;
  intervalMs?: number;
};

const AdCarousel: React.FC<Props> = ({
  slides,
  height = 200,
  intervalMs = 3500,
}) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slideWidth || slides.length < 2) {
      return;
    }
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({x: next * slideWidth, animated: true});
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slideWidth, slides.length, intervalMs]);

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (!slideWidth) {
      return;
    }
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / slideWidth));
  };

  return (
    <View
      style={styles.carousel}
      onLayout={event => setSlideWidth(event.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}>
        {slides.map((source, index) => (
          <View
            key={index}
            style={[styles.slide, {width: slideWidth || '100%', height}]}>
            <Image source={source} style={styles.slideImage} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginBottom: 18,
  },
  slide: {
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
    backgroundColor: colors.dotInactive,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});

export default AdCarousel;
