import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator
} from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import Popup from "./components/(feedback)/Popup";
import Toast from "react-native-toast-message";
import PerkGradient from "./components/icons/PerkGradient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePerkQr, redeemBonus, useBonus } from "./lib/service/mutationHelper";
import { restaurantKeys, userKeys } from "./lib/service/keysHelper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { useAuth } from "./context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { SERVER_SETTING } from "./constants/serverSettings";

const { width, height } = Dimensions.get("window");

const PowerUp = () => {



  const { authState } = useAuth();

  const socket = io(SERVER_SETTING.API_URL, { transports: ["websocket"] });
  const userId = authState.userId;

  // const showToast = () => {
  //   setTimeout(() => {
  //     Toast.show({
  //       type: "perkToast",
  //       text1: "Perk consumed"
  //     })
  //   }, 800)
  // }
  const { id, name, restaurantId } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrdata] = useState("")
  const queryClient = useQueryClient()

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("register", userId);
  });

  socket.on("bonus-scan", (data) => {
    console.log("Tapscan: ", data);
    if (data){
      handleNavigation();
    }
  });

  const {
    data,
    error,
    status,
    mutateAsync: createBonusQrMutation,
  } = useMutation({
    mutationFn: generatePerkQr,
    onError: (error) => {
    },
    onSuccess: (data, variables) => {
      try {
        setLoading(true)
        console.log("Successfully created");
        const newQrdata = data?.data?.data?.encryptedData;
        setQrdata(newQrdata);
        setLoading(false)
      } catch (error) {
        console.error("Bonus mutation failed:", error);
      }
    },
  });

  useEffect(() => {
    setLoading(true)
    createBonusQrMutation({
      id: id as string,
    });
   
  }, [])

  const handleNavigation = () => {
    queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    queryClient.invalidateQueries({ queryKey: userKeys.cards });
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    router.back()
  }

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1, marginTop: Platform.OS === 'ios' ? -10 : 0 }}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <View style={styles.container} key={id as string}>

        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={[styles.qrContainer]}
        >
          {loading ? <ActivityIndicator /> : <QRCode backgroundColor="transparent" color={Color.base.White} size={width / 1.3} value={`data:image/png;base64,${qrData}`} />}
        </LinearGradient>


        <Popup
          title="Perk consumed."
          isVisible={isPopupVisible}
          onClose={handleNavigation}
        />
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 24 }}
        >
          <View style={{ padding: 12, backgroundColor: Color.Gray.gray400, borderRadius: 12, width: 52, height: 52 }}>
            <PerkGradient />
          </View>

          <View style={{ gap: 12, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                lineHeight: 24,
                color: Color.base.White,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: Color.Gray.gray100,
                fontSize: 14,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Show this to your waiter to redeem.{"\n"} Do not worry, they are pros.

            </Text>
          </View>
        </View>
      </View>
    </View>
    // </SafeAreaView>
  );
};

export default PowerUp;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray300,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 12,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  container: {
    gap: 32,
    marginBottom: 50,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  powerUpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    width: width - 64,
    aspectRatio: 1,
  }
});
