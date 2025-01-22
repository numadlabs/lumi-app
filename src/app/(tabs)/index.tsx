import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Color from "@/constants/Color";
import Balance from "@/components/sections/Balance";
import QuickInfo from "@/components/sections/QuickInfo";
// import DiscoverFloatRestCard from "@/components/sections/DiscoverFloatRestCard";
import StackedCard from "@/components/sections/StackedCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById, getUserCard } from "@/lib/service/queryHelper";
import "@thirdweb-dev/react-native-adapter";
import "expo-router/entry";

import { RestaurantType } from "@/lib/types";
import { GetRestaurantsResponseType } from "@/lib/types/apiResponseType";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import { getRestaurants } from "@/lib/service/queryHelper";
import HomeRestList from "@/components/atom/cards/HomeRestList";
import { InfoCircle } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  SlideInLeft,
} from "react-native-reanimated";
import { height, width } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Close from "@/components/icons/Close";
import moment from "moment";
import {
  BODY_2_MEDIUM,
  BODY_2_REGULAR,
  BUTTON_40,
  H6,
} from "@/constants/typography";
import DiscoverFloatRestCard from "@/components/atom/cards/DiscoverFloatRestCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantListGrowing from "@/components/atom/cards/RestaurantListGrowing";

import BitcoinWithdrawals from "@/components/atom/cards/BitcoinWithdrawals";
import { updatePushToken } from "@/lib/service/mutationHelper";

const Page = () => {
  const router = useRouter();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenBalance, setIsOpenBalance] = useState<boolean>(false);
  const [isQuickInfoVisible, setIsQuickInfoVisible] = useState(true);
  const pressed = useSharedValue(false);
  const { authState } = useAuth();
  const profilePictureSetting = AsyncStorage.getItem("showProfilePicture");
  const currentTime = moment().format("HH:mm:ss");
  const { data: user } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => {
      return getUserById(authState.userId);
    },
    enabled: !!authState.userId,
  });

  const { mutateAsync: updatePushTokenMutation } = useMutation({
    mutationFn: updatePushToken,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard();
    },
  });

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };
  const toggleBalanceBottomSheet = () => {
    setIsOpenBalance(!isOpenBalance);
  };
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));
  const currentDayOfWeek = moment().isoWeekday();

  const { data: restaurantsData } = useQuery<GetRestaurantsResponseType>({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      });
    },
  });

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: `/restaurants/${restaurant.id}`,
      params: {
        cardId: restaurant.cardId,
      },
    });
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant) => !restaurant.isOwned,
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={SlideOutDown.withInitialValues({ originY: 0 })}
        >
          {user && (
            <TouchableOpacity onPress={() => router.push("/Wallet")}>
              <Balance
                amount={user?.user?.balance}
                convertedAmount={user?.convertedBalance}
                currencyName="EUR"
                handleToggle={() => toggleBalanceBottomSheet()}
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={{ marginTop: 16, gap: 12 }}>
          <Text
            style={{
              ...BODY_2_MEDIUM,
              color: Color.Gray.gray100,
              paddingHorizontal: 16,
            }}
          >
            Featured
          </Text>

          {restaurantsArray?.length > 0 && (
            <View style={{ alignItems: "center", gap: 16, width }}>
              {restaurantsArray?.length > 0 && (
                <Animated.ScrollView
                  snapToAlignment="center"
                  entering={SlideInLeft}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width - 16}
                  decelerationRate="fast"
                >
                  <Animated.View
                    entering={SlideInLeft.springify().damping(15)}
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      left: 16,
                      paddingRight: 32,
                    }}
                  >
                    {user?.user?.dateOfBirth &&
                    user?.user?.location &&
                    profilePictureSetting
                      ? null
                      : isQuickInfoVisible && null}

                    <FlatList
                      style={{ gap: 10, flex: 1 }}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 16 }} />
                      )}
                      data={filteredRestaurantsArray}
                      horizontal
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <HomeRestList
                          isClaimLoading={true}
                          marker={item}
                          onPress={() => handleNavigation(item)}
                        />
                      )}
                    />
                    <RestaurantListGrowing />
                    <BitcoinWithdrawals />
                    {/* <DiscoverFloatRestCard
                      onPress={() => setIsQuickInfoVisible(false)}
                    /> */}
                  </Animated.View>
                </Animated.ScrollView>
              )}
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 12,
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              ...BODY_2_MEDIUM,
              color: Color.Gray.gray100,
            }}
          >
            Memberships
          </Text>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <InfoCircle size={18} color={Color.Gray.gray100} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <StackedCard />
        </View>
        {cards?.data?.cards.length === 0 ? (
          ""
        ) : (
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 120 }}
          >
            <TouchableOpacity onPress={() => router.push("/MyAcards")}>
              <View
                style={{
                  backgroundColor: Color.Gray.gray300,
                  marginTop: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 32,
                }}
              >
                <Text
                  style={{
                    color: Color.base.White,
                    ...BUTTON_40,
                  }}
                >
                  See all
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {isOpenBalance && (
        <Modal transparent={true}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={toggleBalanceBottomSheet}
          >
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                {
                  position: "absolute",
                  backgroundColor: "rgba(0, 0, 0, 0.25)",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 98,
                },
                animatedStyles,
              ]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[
                {
                  backgroundColor: Color.Gray.gray600,
                  height: height / 2.38,
                  bottom: 0,
                  width: width,
                  zIndex: 99,
                  position: "absolute",
                  borderTopStartRadius: 32,
                  borderTopEndRadius: 32,
                  gap: 24,
                  padding: 16,
                  alignItems: "center",
                },
                animatedStyles,
              ]}
            >
              <View
                style={{
                  paddingVertical: 8,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    ...H6,
                    color: Color.base.White,
                  }}
                >
                  About your Balance
                </Text>
                <TouchableOpacity onPress={toggleBalanceBottomSheet}>
                  <View
                    style={{
                      backgroundColor: Color.Gray.gray400,
                      borderRadius: 48,
                      padding: 8,
                      width: 32,
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      aspectRatio: 1,
                      position: "absolute",
                      left: 55,
                      top: -18,
                    }}
                  >
                    <Close />
                  </View>
                </TouchableOpacity>
              </View>
              <Image
                source={require("../../public/images/balanceInfo.png")}
                style={{ height: 64, width: 204 }}
              />
              <Text
                style={{
                  ...BODY_2_REGULAR,
                  textAlign: "center",
                  color: Color.Gray.gray50,
                }}
              >
                You earned ALYS Bitcoin, which is faster and cheaper to use but
                still pegged 1:1 with mainchain Bitcoin. Use your balance to
                redeem perks at restaurants. Withdrawals to external crypto
                wallets coming soon.
              </Text>
              <Button
                variant="primary"
                textStyle="primary"
                onPress={toggleBalanceBottomSheet}
                style={{ width: "100%" }}
              >
                <Text>Got it</Text>
              </Button>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
      {isOpen && (
        <Modal transparent={true}>
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleBottomSheet}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                {
                  position: "absolute",
                  backgroundColor: "rgba(0, 0, 0, 0.25)",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 98,
                },
                animatedStyles,
              ]}
            />
            <Animated.View
              entering={SlideInDown.springify().damping(18)}
              exiting={SlideOutDown.springify()}
              style={[
                {
                  backgroundColor: Color.Gray.gray600,
                  height: height / 2,
                  bottom: 0,
                  width: width,
                  zIndex: 99,
                  position: "absolute",
                  borderTopStartRadius: 32,
                  borderTopEndRadius: 32,
                  gap: 24,
                  padding: 16,
                },
                animatedStyles,
              ]}
            >
              <View
                style={{
                  paddingVertical: 8,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    ...H6,
                    color: Color.base.White,
                  }}
                >
                  Membership
                </Text>
                <TouchableOpacity onPress={toggleBottomSheet}>
                  <View
                    style={{
                      backgroundColor: Color.Gray.gray400,
                      borderRadius: 48,
                      padding: 8,
                      width: 32,
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      aspectRatio: 1,
                      position: "absolute",
                      left: 85,
                      top: -18,
                    }}
                  >
                    <Close />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", gap: 16 }}>
                <Image
                  source={require("../../public/images/membership.png")}
                  style={{ width: width / 1.8, height: 166 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    ...BODY_2_REGULAR,
                    color: Color.Gray.gray50,
                    textAlign: "center",
                  }}
                >
                  Earn Bitcoin and other rewards simply by using our membership
                  cards when you visit your favorite restaurants.
                </Text>
              </View>
              <Button
                variant="primary"
                textStyle="primary"
                onPress={toggleBottomSheet}
              >
                <Text>Got it</Text>
              </Button>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
});
