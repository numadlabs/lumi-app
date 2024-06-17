import React, { useEffect } from 'react';
import Color from './constants/Color';
import { BlurView } from 'expo-blur';
import AmuseBoucheLogo from './components/icons/A';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { height, width } from './lib/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const INITIAL_TRANSLATE_X = -63;
const INITIAL_TRANSLATE_Y = 20;
const INITIAL_TRANSLATE_X2 = 120;
const INITIAL_TRANSLATE_Y2 = 40;
const ANIMATION_DURATION =600;

const Test = () => {
  const translateX = useSharedValue(INITIAL_TRANSLATE_X);
  const translateY = useSharedValue(INITIAL_TRANSLATE_Y);
  const translateX2 = useSharedValue(INITIAL_TRANSLATE_X2);
  const translateY2 = useSharedValue(INITIAL_TRANSLATE_Y2);
  
  const animated = () => {
    translateX.value = INITIAL_TRANSLATE_X;
    translateY.value = INITIAL_TRANSLATE_Y;
    translateX2.value = INITIAL_TRANSLATE_X2;
    translateY2.value = INITIAL_TRANSLATE_Y2;
    
    translateX.value = withRepeat(
      withSequence(
        withTiming(width / 3, { duration: ANIMATION_DURATION })
      ),
      -1,
      true
    );
    translateX2.value = withRepeat(
      withSequence(
        withTiming(-width / 6, { duration: ANIMATION_DURATION })
      ),
      -1,
      true
    );
    translateY.value = withSequence(
      withTiming(0, { duration: ANIMATION_DURATION }),
      withTiming(168, { duration: ANIMATION_DURATION })
    );
    translateY2.value = withSequence(
      withTiming(40, { duration: ANIMATION_DURATION }),
      withTiming(-120, { duration: ANIMATION_DURATION })
    );
  };

  useEffect(() => {
    animated();
    const intervalId = setInterval(play, 1800);
    return () => clearInterval(intervalId);
  }, []);

  const play = () => {

      animated();
 
  };

  const restart = () => {
    translateX.value = INITIAL_TRANSLATE_X;
    translateY.value = INITIAL_TRANSLATE_Y;
    translateX2.value = INITIAL_TRANSLATE_X2;
    translateY2.value = INITIAL_TRANSLATE_Y2;
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX2.value },
      { translateY: translateY2.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.animationContainer}>
        <View style={styles.animatedViewWrapper}>
          <Animated.View style={[styles.animatedView, styles.topPosition, animatedStyle1]}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={[Color.Brand.main.start, Color.Brand.main.end]}
              style={styles.gradientBall}
            />
          </Animated.View>
          <Animated.View style={[styles.animatedView, styles.bottomPosition, animatedStyle2]}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={[Color.Brand.main.start, Color.Brand.main.end]}
              style={styles.gradientBall}
            />
          </Animated.View>
          <BlurView intensity={64} style={styles.blurView}>
            <AmuseBoucheLogo />
          </BlurView>
        </View>
      </View>

    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedViewWrapper: {
    overflow: 'hidden',
    borderRadius: 32,
    backgroundColor: Color.Gray.gray500,
  },
  animatedView: {
    width: 160,
    height: 160,
    position: 'absolute',
  },
  gradientBall: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: Color.base.White,
  },
  blurView: {
    width: width / 4,
    height: height / 4,
    aspectRatio: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 35, 40, 0.1)',
    overflow: 'hidden',
    borderRadius: 32,
    alignItems: 'center',
  },
  topPosition: {
    top: -60,
  },
  bottomPosition: {
    bottom: -60,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
  },
});

export default Test;
