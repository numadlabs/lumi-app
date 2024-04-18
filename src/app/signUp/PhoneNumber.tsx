import { useRouter } from "expo-router";
import { ArrowDown2 } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Steps from "../components/atom/Steps";
import Button from "../components/ui/Button";
import Color from "../constants/Color";
import { useAuth } from "../context/AuthContext";
import { useSignUpStore } from "../lib/store/signUpStore";
import { height } from "../lib/utils";

const PhoneNumber = () => {
  const { prefix, setPrefix, phoneNumber, setPhoneNumber } = useSignUpStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonPosition, setButtonPosition] = useState("bottom");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { onRegister } = useAuth();

  const data = [
    {
      name: "UAE",
      prefix: "971",
    },
    {
      name: "Mongolia",
      prefix: "976",
    },
    {
      name: "United States",
      prefix: "1",
    },
    {
      name: "United Kingdom",
      prefix: "44",
    },
    {
      name: "Canada",
      prefix: "1",
    },
    {
      name: "Australia",
      prefix: "61",
    },
    {
      name: "Germany",
      prefix: "49",
    },
    {
      name: "France",
      prefix: "33",
    },
    {
      name: "Japan",
      prefix: "81",
    },
  ];

  const offset = useSharedValue(300);
  const togglePrefix = () => {
    setIsOpen(!isOpen);
    offset.value = withSpring(isOpen ? height / 3 : height / 3 + 10, {
      damping: 20,
      mass: 0.5,
    });
  };
  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const handlePrefixSelection = (selectedPrefix) => {
    setPrefix(selectedPrefix);
    togglePrefix();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setButtonPosition("top")
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setButtonPosition("bottom")
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNavigation = () => {
    router.push({
      pathname: "/signUp/Password",
      params: {
        prefix: prefix,
        phoneNumber: phoneNumber,
      },
    });
  };
  return (
    <>
      <Steps activeStep={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
            <View style={styles.body}>
              <View style={styles.textContainer}>
                <View style={{ gap: 8 }}>
                  <Text style={styles.topText}>Phone Number</Text>
                  <Text style={styles.bottomText}>
                    This will be kept private. No surprise DMs.
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    alignContent: "center",
                    borderColor: Color.Gray.gray300,
                    height: 48,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    marginTop: 10,
                    width: "100%",
                  }}
                >
                  <AnimatedPressable
                    entering={FadeIn}
                    exiting={FadeOut}
                    onPress={togglePrefix}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text style={{ color: Color.Gray.gray50 }}>+{!prefix ? data[0].prefix : prefix}</Text>
                      <ArrowDown2 color={Color.Gray.gray50} />
                    </View>
                  </AnimatedPressable>
                  <TextInput
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType="phone-pad"
                    placeholder="XXXXXXXX"
                    placeholderTextColor={Color.Gray.gray100}
                    value={phoneNumber}
                    style={styles.input}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={100}
              behavior={Platform.OS === "ios" ? "height" : "padding"}
            >
              <View
                style={[
                  styles.buttonContainer,
                  buttonPosition === "bottom"
                    ? styles.bottomPosition
                    : styles.topPosition,
                ]}
              >
                <Button
                  variant="tertiary"
                  textStyle="primary"
                  size="default"
                  onPress={handleNavigation}
                >
                  Send code
                </Button>
              </View>
            </KeyboardAvoidingView>

            {isOpen && (
              <Animated.View
                style={[
                  translateY,
                  {
                    position: "absolute",
                    zIndex: 100,
                    bottom: height / 1.45,
                    width: "80%",
                    height: height / 3.5,
                    backgroundColor: Color.base.White,
                    borderRadius: 16,
                    overflow: "hidden",
                    left: 20,
                    ...Platform.select({
                      ios: {
                        shadowColor: Color.Gray.gray500,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 12,
                      },
                      android: {
                        elevation: 12,
                      },
                    }),
                  },
                ]}
              >
                <ScrollView style={{}}>
                  {data.map((prefix, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePrefixSelection(prefix.prefix)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: 16,
                          paddingVertical: 15,
                          backgroundColor: Color.Gray.gray400,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "400",
                            lineHeight: 20,
                            color: Color.base.White
                          }}
                        >
                          {prefix.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "400",
                            lineHeight: 20,
                            color: Color.Gray.gray50
                          }}
                        >
                          +{prefix.prefix}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: Color.Gray.gray50,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    gap: 24,
    borderRadius: 32,
    backgroundColor: Color.Gray.gray500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  prefixContainer: {
    position: "absolute",
    zIndex: 100,
    bottom: height / 1.3,
    width: "80%",
    height: height / 4.5,
    backgroundColor: Color.base.White,
    borderRadius: 16,
    overflow: "hidden",
    left: 20,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomPosition: {
    justifyContent: "flex-end",
  },
  topPosition: {
    justifyContent: "flex-start",

    marginTop: "auto",
  },
  topText: {
    color: Color.base.White,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomText: {
    color: Color.Gray.gray100,
    fontSize: 12,
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: "normal",
  },
});
