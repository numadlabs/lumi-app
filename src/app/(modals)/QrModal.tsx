import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera/next";
import Color from "../constants/Color";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { generateTap, redeemTap } from "../lib/service/mutationHelper";
import Popup from "../components/(feedback)/Popup";
import QrPopup from "../components/(feedback)/QrPopup";
import PowerUp from "../components/(feedback)/PowerUp";
import { useAuth } from "../context/AuthContext";
import { getUserCard } from "../lib/service/queryHelper";
import useLocationStore from "../lib/store/userLocation";
import { Flash } from "iconsax-react-native";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const markerSize = 250;
const halfMarkerSize = markerSize / 2;

const overlayAdjusting = 5;

const QrModal = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isBtcPopupVisible, setBtcPopupVisible] = useState(false)
  const [isModalVisible, setModalVisible] = useState(true);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const showToast = () => {
    setTimeout(function () {
      Toast.show({
        type: 'perkToast',
        text1: 'Successfully used perk',
      });
    }, 1500)
  }

  const toggleBtcPopup = () => {
    setBtcPopupVisible(!isBtcPopupVisible)
  }

  const closeModal = () => {
    toggleBtcPopup()
    togglePopup()
    showToast()
  };

  const queryClient = useQueryClient()
  const closeBtcModal = () => {
    router.back();
  }
  const { currentLocation } = useLocationStore();

  const { data: cards = [] } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation,
  });

  console.log(cards)

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [powerUp, setPowerUp] = useState("")
  const [btcAmount, setBTCAmount] = useState("")
  const [encryptedTap, setEncryptedTap] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);


  const {
    data,
    error,
    isLoading,
    status,
    mutateAsync: createMapMutation,
  } = useMutation({
    mutationFn: generateTap,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data);
      try {
        const resp = createRedeemMutation(data.data.data);
        console.log("Redeem successful:", resp);

        setEncryptedTap(data.data.data);
        queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
        if ( visitCount % 10 === 0) {
          togglePopup();
        } else {
          toggleBtcPopup()
        }
      } catch (error) {
        console.error("Redeem mutation failed:", error);
      }
    },
  });
  const visitCount = cards?.data?.cards[0].visitCount;
  const { mutateAsync: createRedeemMutation } = useMutation({
    mutationFn: redeemTap,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ QrModal ~ data:", data.data.data);
      if (visitCount >= 10) {
        setPowerUp(data.data.data.bonus?.name)
      }

      setBTCAmount(data.data?.data?.increment)
    },
  });
  const handleScanButtonPress = async () => {
    try {
      const firstCardId = cards?.data?.cards[0].restaurantId;
      console.log("🚀 ~ handleScanButtonPress ~ firstCardId:", firstCardId);
      if (!firstCardId) {
        return console.log("no card id");
      }
      const data = await createMapMutation(firstCardId);
      console.log("Map mutation successful:", data);
    } catch (error) {
      console.log("Map mutation failed:", error);
    }
  };



  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function marker(
    color: string,
    size: number,
    borderLength: number,
    thickness: number = 2,
    borderRadius: number = 0
  ): JSX.Element {
    return (
      <View style={{ height: size, width: size }}>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            top: 0,
            left: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
            borderTopLeftRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            top: 0,
            right: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
            borderTopRightRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            bottom: 0,
            left: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
            borderBottomLeftRadius: borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            height: borderLength,
            width: borderLength,
            bottom: 0,
            right: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
            borderBottomRightRadius: borderRadius,
          }}
        ></View>
      </View>
    );
  }

  const overlayStyles = (
    overlayWidth,
    overlayHeight,
    marginTop = 0,
    marginLeft = 0
  ) => ({
    ...styles.overlay,
    width: overlayWidth,
    height: overlayHeight,
    marginTop,
    marginLeft,
  });

  return (
    <>
      {isModalVisible && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
              flash={flashMode == true ? "on" : "off"}
            // flash="on"
            />
            {/* Overlay for guiding user to place QR code within scan area */}
            <View
              style={[
                styles.overlay,
                {
                  height: (height - markerSize) / 2 - overlayAdjusting,
                  width: width,
                },
              ]}
            />
            <View
              style={[
                styles.overlay,
                {
                  height: (height - markerSize) / 2,
                  marginTop: (height + markerSize) / 2 - overlayAdjusting * 3,
                  width: width,
                },
              ]}
            />

            <View
              style={[
                styles.overlay,
                {
                  width: (width - markerSize) / 2,
                  height: markerSize - overlayAdjusting * 2,
                  marginTop: (height - markerSize) / 2 - overlayAdjusting,
                },
              ]}
            />
            <View
              style={[
                styles.overlay,
                {
                  width: (width - markerSize) / 2,
                  height: markerSize - overlayAdjusting * 2,
                  marginLeft: (width + markerSize) / 2,
                  marginTop: (height - markerSize) / 2 - overlayAdjusting,
                },
              ]}
            />
            {/* Marker for indicating QR code scanning area */}
            <View style={styles.markerContainer}>
              {marker("white", markerSize, 40, 4, 12)}
            </View>

            {/* Button for toggling flashlight */}
            <TouchableOpacity
              style={[styles.button, styles.flashButton]}
              onPress={handleScanButtonPress}
            >
              <Flash color={Color.Gray.gray600} />
            </TouchableOpacity>

            {/* Button for closing the modal */}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                router.back();
              }}
            >
              <Image source={require("@/public/icons/close.png")} />
            </TouchableOpacity>
          </View>
          {visitCount >= 10 ? (
            <PowerUp
              title="Congrats!"
              powerUpTitle={powerUp}
              subText="You received a power-up."
              isVisible={isPopupVisible}
              onClose={closeModal}
            />
          ) : null}
          <Popup
            isVisible={isBtcPopupVisible}
            onClose={closeBtcModal}
            title={btcAmount}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",

  },
  markerContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",

    marginLeft: -halfMarkerSize,
    marginTop: -halfMarkerSize,
    height: markerSize,
    width: markerSize,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  closeButton: {
    position: "absolute",
    right: "0%",
    top: "0%",
    margin: 16,
  },
  flashButton: {
    position: "absolute",
    right: "38%",
    bottom: "0%",
    marginRight: 16,
    marginBottom: 100,
  },
});

export default QrModal;
