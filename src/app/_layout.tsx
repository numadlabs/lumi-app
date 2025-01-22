import React, { useCallback, useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { AuthProvider } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/ToasterConfig";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import * as Network from "expo-network";
import NoInternet from "./NoInternet";
import * as Sentry from "@sentry/react-native";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { View, StyleSheet } from "react-native";
import ErrorBoundary from "./ErrorBoundary";
import axios from "axios";
import SplashScreenAnimated from "./SplashScreenAnimated";

interface LoadingStates {
  internet: boolean;
  updates: boolean;
  pushNotification: boolean;
  location: boolean;
  fonts: boolean;
}

// Initialize Sentry
Sentry.init({
  dsn: SERVER_SETTING.SENTRY_DSN_LINK,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

// Create QueryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Axios client setup with interceptors
const axiosClient = axios.create({
  baseURL: SERVER_SETTING.API_URL,
  timeout: 5000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  },
);

// Main Layout Component
const Layout = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    internet: false,
    updates: false,
    pushNotification: false,
    location: false,
    fonts: false,
  });

  // Load fonts
  const [fontsLoaded] = useFonts({
    Sora: require("@/public/fonts/Sora-Regular.otf"),
    SoraBold: require("@/public/fonts/Sora-Bold.otf"),
    SoraMedium: require("@/public/fonts/Sora-Medium.otf"),
    SoraSemiBold: require("@/public/fonts/Sora-SemiBold.otf"),
  });

  // Check internet connection
  const checkInternetConnection = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
      setLoadingStates((prev) => ({
        ...prev,
        internet: networkState.isConnected,
      }));
      return networkState.isConnected;
    } catch (error) {
      Sentry.captureException(error);
      setIsConnected(false);
      return false;
    }
  }, []);

  // Handle root view layout
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      try {
        await SplashScreen.hideAsync();
        return <SplashScreenAnimated loadingStates={loadingStates} />;
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }, [fontsLoaded, loadingStates]);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkInternetConnection();

        // Update fonts loading state
        if (fontsLoaded) {
          setLoadingStates((prev) => ({ ...prev, fonts: true }));
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    initializeApp();
  }, [fontsLoaded]);

  // Set up internet connection checker
  useEffect(() => {
    const intervalId = setInterval(checkInternetConnection, 5000);
    return () => clearInterval(intervalId);
  }, [checkInternetConnection]);

  if (!fontsLoaded) {
    return null;
  }

  if (!isConnected) {
    return <NoInternet onPress={Updates.reloadAsync} />;
  }

  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <View onLayout={onLayoutRootView} style={styles.container}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="restaurants/[id]" />
                <Stack.Screen
                  name="Menu/[id]"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="(modals)/MyQrModal"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="PrivacyPolicy" />
                <Stack.Screen name="profileSection/UpdateScreen" />
                <Stack.Screen name="MyAcards" />
                <Stack.Screen name="Wallet" />
                <Stack.Screen name="TermsAndCondo" />
                <Stack.Screen name="BugReport" />
                <Stack.Screen name="Faq" />
                <Stack.Screen name="Tier" />
                <Stack.Screen name="Cart" />
                <Stack.Screen name="PerkScreen" />
                <Stack.Screen name="NoInternet" />
                <Stack.Screen
                  name="PerkMarket"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="AlreadyCheckedIn"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="PowerUp"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="FollowingPerk"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="PerkBuy"
                  options={{ presentation: "modal" }}
                />
              </Stack>
              <Toast config={toastConfig} />
            </View>
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(Layout);
