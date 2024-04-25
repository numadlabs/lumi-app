import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import Color from "@/app/constants/Color";
import { height, scaleHeight } from "@/app/lib/utils";
import { Flash, TicketStar } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import APassStripes from "../../icons/APassStripes";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// highlight-start
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

// In the APassCard component
interface ApassProp {
  name: string;
  image: string;
  onPress: () => void;
  category: string;
  hasBonus: boolean;
  visitCount: number;
}
const APassCard: React.FC<ApassProp> = ({ name, category, image, onPress, hasBonus, visitCount }) => {
  const animatedValue = useSharedValue(visitCount)
  const pressed = useSharedValue(false);


  const AnimatedText = Animated.createAnimatedComponent(Text)


  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) }],
  }));




  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
          <Animated.View style={[animatedStyles]}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={[styles.aCardContainer]}
            >
              {/* in case old design returns : Turn below view into blurview and intensity was 24
              also remove background color */}
              <View style={styles.blurContainer}>
                <View style={{ position: 'absolute', top: 0, right: -20, width: '50%' }}>
                  <APassStripes />
                </View>
                <View style={{ flexDirection: 'row', width: '100%', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}`,
                      }}
                    />
                    <View>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleText}>{name}</Text>
                      <Text style={[styles.buttonText, { bottom: 5 }]}>{category}</Text>
                    </View>
                  </View>
                  {hasBonus ?
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Color.Gray.gray400,
                        padding: 8,
                        borderRadius: 12,
                      }}
                    >
                      <TicketStar size={24} color={Color.base.White} />
                    </View> : null}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, rowGap: 12 }}>
                  <Image style={{ minWidth: 164, minHeight: 164, borderRadius: 12 }} source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}` }} />
                  <View style={{ borderWidth: 1, backgroundColor: Color.Gray.gray500, borderColor: Color.Gray.gray400, borderRadius: 12, overflow: 'hidden', }}>
                    {/* <LinearGradient
                      colors={[Color.Brand.main.start, Color.Brand.main.end]}
                      style={{ borderRadius: 0, padding: 1 }}> */}
                    <BlurView>
                      <LinearGradient
                        colors={[Color.Brand.card.start, Color.Brand.card.end]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 2, y: 1 }}
                        style={{ borderTopStartRadius: 12, borderTopEndRadius: 12 }}>
                        <View style={{ padding: 33, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                          <AnimatedText entering={FadeIn} exiting={FadeOut} style={{ fontSize: 32, lineHeight: 40, fontWeight: '700', color: Color.base.White }}>
                            {visitCount < 10 ? `0${visitCount}` : visitCount}
                          </AnimatedText>
                          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '600', color: Color.base.White }}>
                            Check-ins
                          </Text>
                        </View>
                      </LinearGradient>
                    </BlurView>
                    {/* </LinearGradient> */}
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6, borderTopWidth: 1, borderColor: Color.Gray.gray400 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10 }}>

                        {/*Todo:  find some better counting shit you fucker */}
                        <AnimatedText entering={FadeIn} exiting={FadeOut} style={[{ fontWeight: '700', fontSize: 14, lineHeight: 18, color: Color.base.White }, animatedStyles]}>{Math.max(1, 3 - (visitCount % 3))}</AnimatedText>

                        <Text style={{ fontWeight: '400', fontSize: 10, lineHeight: 12, color: Color.base.White }}>
                          Until next perk
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </GestureDetector>

    </GestureHandlerRootView>

  );
};

export default APassCard;

const styles = StyleSheet.create({
  aCardContainer: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 32,
    alignItems: "center",
    borderColor: Color.Gray.gray400,
    overflow: "hidden",
    height: 264,
  },
  blurContainer: {
    backgroundColor: Color.Gray.gray500,
    columnGap: 20,
    width: "100%",
    flex: 1,
    padding: 20,
  },
  titleText: {
    color: Color.base.White,
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    width: 210

  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
