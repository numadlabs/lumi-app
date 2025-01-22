import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "@/components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "@/components/icons/Logo";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import useLocationStore from "@/lib/store/userLocation";
import * as Updates from "expo-updates";
import SplashScreenAnimated from "../SplashScreenAnimated";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { registerDeviceNotification } from "@/lib/service/mutationHelper";
import * as Location from "expo-location";
import ErrorBoundary from "../ErrorBoundary";
import * as Network from "expo-network";
import NoInternet from "../NoInternet";
import { axiosClient } from "@/lib/axios";

// Types
interface LayoutProps {
  navigation: any; // Consider using proper navigation typing from @react-navigation/native
}

interface LoadingStates {
  internet: boolean;
  updates: boolean;
  pushNotification: boolean;
  location: boolean;
  fonts: boolean;
}

interface TokenResponse {
  success: boolean;
  data?: {
    auth: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

const PUSH_TOKEN_KEY = "@PushToken";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const UPDATE_CHECK_TIMEOUT = 5000;
const NETWORK_CHECK_INTERVAL = 5000;

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    internet: false,
    updates: false,
    pushNotification: false,
    location: false,
    fonts: false,
  });
  const [isConnected, setIsConnected] = useState(true);

  const { getLocation } = useLocationStore();
  const { expoPushToken } = usePushNotifications();

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const updateLoadingState = useCallback(
    (key: keyof LoadingStates, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const checkInternetConnection = useCallback(async (): Promise<boolean> => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
      return networkState.isConnected;
    } catch (error) {
      console.error("Failed to check internet connection:", error);
      return false;
    }
  }, []);

  const handlePushNotifications = useCallback(async (): Promise<void> => {
    updateLoadingState("pushNotification", true);
    try {
      if (!expoPushToken?.data) {
        console.log("Push notifications not available or permission denied");
        return;
      }

      const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (storedToken === expoPushToken.data) return;

      await sendPushToken({ pushToken: expoPushToken.data });
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
      console.log("Push notifications enabled");
    } catch (error) {
      console.error("Error handling push notifications:", error);
    } finally {
      updateLoadingState("pushNotification", false);
    }
  }, [expoPushToken, sendPushToken, updateLoadingState]);

  const handleLocationPermission = useCallback(async (): Promise<void> => {
    updateLoadingState("location", true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        await getLocation();
        console.log("Location permission granted and location fetched");
      } else {
        console.log("Location permission denied");
      }
    } catch (error) {
      console.error("Error handling location permission:", error);
    } finally {
      updateLoadingState("location", false);
    }
  }, [getLocation, updateLoadingState]);

  // const checkAccessToken = async (): Promise<boolean> => {
  //   try {
  //     const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  //     if (!accessToken) return false;

  //     const response = await axiosClient.post<TokenResponse>(
  //       "/auth/access-token",
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       },
  //     );

  //     if (response.data.success) return true;

  //     const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  //     if (!refreshToken) return false;

  //     const refreshResponse = await axiosClient.post<TokenResponse>(
  //       "/auth/refresh-token",
  //       {
  //         refreshToken,
  //       },
  //     );

  //     if (!refreshResponse.data.success) return false;

  //     const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
  //       refreshResponse.data.data!.auth;

  //     await Promise.all([
  //       AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken),
  //       AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken),
  //     ]);

  //     return true;
  //   } catch (error) {
  //     console.error("Token check failed:", error);
  //     return false;
  //   }
  // };

  const checkForUpdates = async (): Promise<void> => {
    if (__DEV__) return;

    updateLoadingState("updates", true);
    try {
      const updateCheck = await Promise.race([
        Updates.checkForUpdateAsync(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Update check timed out")),
            UPDATE_CHECK_TIMEOUT,
          ),
        ),
      ]);

      if (
        updateCheck &&
        typeof updateCheck === "object" &&
        "isAvailable" in updateCheck
      ) {
        if (updateCheck.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } else {
        console.log("Update check returned an unexpected result");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      updateLoadingState("updates", false);
    }
  };

  const prepareApp = useCallback(async () => {
    try {
      const isOnline = await checkInternetConnection();
      if (!isOnline) {
        console.log("No internet connection. Skipping app preparation.");
        return;
      }

      await checkForUpdates();
      await handlePushNotifications();
      await handleLocationPermission();
    } catch (error) {
      console.error("Error preparing app:", error);
    } finally {
      setAppIsReady(true);
    }
  }, [
    checkInternetConnection,
    handlePushNotifications,
    handleLocationPermission,
  ]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    const intervalId = setInterval(
      checkInternetConnection,
      NETWORK_CHECK_INTERVAL,
    );
    return () => clearInterval(intervalId);
  }, [checkInternetConnection]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const isValid = await checkAccessToken();
  //     setIsAuthenticated(isValid);
  //     if (!isValid) {
  //       router.replace("/(auth)/Login");
  //     }
  //   };
  //   checkAuth();
  // }, []);

  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (isAuthenticated === false) {
    return <Redirect href="/(auth)/Login" />;
  }

  if (!isConnected) {
    return <NoInternet onPress={Updates.reloadAsync} />;
  }

  return (
    <ErrorBoundary>
      <Tabs tabBar={(props) => <Footer {...props} navigation={navigation} />}>
        <Tabs.Screen
          name="index"
          options={{
            headerStyle: {
              shadowOpacity: 0,
              backgroundColor: Color.Gray.gray600,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.push("/profileSection/Profile")}
              >
                <View style={{ paddingHorizontal: 20 }}>
                  <User color={Color.base.White} />
                </View>
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Logo />
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push("/Notification")}>
                <View style={{ paddingHorizontal: 20 }}>
                  <Notification color={Color.base.White} />
                </View>
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
          }}
        />
        <Tabs.Screen name="Acards" options={{ headerShown: false }} />
      </Tabs>
    </ErrorBoundary>
  );
};

export default Layout;
