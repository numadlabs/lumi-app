// Import React and other necessary libraries
import Color from "@/app/constants/Color";
import { RestaurantType } from "@/app/lib/types";
import { Reserve, Wallet } from "iconsax-react-native";
import moment from "moment";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;

// Define the props for the FloatingRestaurantCard component
interface FloatingRestaurantCardProps {
  marker: RestaurantType; // Use the Restaurant interface defined earlier
  // key: string;
  onPress: () => void; // A function to handle the button press
  isClaimLoading: boolean;
}

// Define the FloatingRestaurantCard component
const FloatingRestaurantCard: React.FC<FloatingRestaurantCardProps> = ({
  marker,
  // key,
  onPress,
  isClaimLoading,
}) => {
  // console.log("🚀 ~ marker:", key);
  // Example: Set opening time to 9:00 AM and closing time to 5:00 PM

  // Convert opensAt and closesAt strings to Date objects
  const currentTime = moment();

  // Parse opensAt and closesAt strings using moment
  const opensAt = moment(marker.opensAt, "HH:mm");
  let closesAt = moment(marker.closesAt, "HH:mm");

  // Adjust closesAt if it's before or equal to opensAt to consider the next day
  if (closesAt.isSameOrBefore(opensAt)) {
    closesAt = closesAt.add(1, "day");
  }

  const isOpen = currentTime.isBetween(opensAt, closesAt, null, "[]");

  // console.log(isOpen, opensAt, closesAt);
  return (
    <>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        style={styles.card}
      >
        <BlurView
          intensity={24}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 16,
          }}
        >
          <Image
            source={{
              uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${marker.logo}` as string,
            }}
            style={styles.cardImage}
            // resizeMode="cover"
          />
          <View style={styles.textContent}>
            <View>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {marker.name}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.category}
              </Text>
            </View>

            <View style={styles.button}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: isOpen ? "green" : "red" },
                  ]}
                />
                <Text style={{ color: isOpen ? "green" : "red" }}>
                  {isOpen ? "Open" : "Closed"}
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  height: 14,
                  backgroundColor: Color.Gray.gray50,
                }}
              />
              {marker.isOwned ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Reserve color={Color.Gray.gray100} size={16} />
                  <Text style={{ color: Color.Gray.gray50 }}>
                    {marker.visitCount} Check-ins
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={onPress}>
                  <View
                    style={{
                      flexDirection: "row",
                      position: "relative",
                      backgroundColor: Color.Gray.gray600,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 48,
                      marginLeft: 49,
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                   
                    <Text
                      style={{
                        color: Color.Gray.gray50,
                        fontWeight: "bold",
                        fontSize: 11,
                        lineHeight: 16,
                      }}
                    >
                      {isClaimLoading
                        ? (<ActivityIndicator/>)
                        : marker.isOwned
                        ? "Owned"
                        : "Add"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "space-between",
    marginHorizontal: 10,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: Color.Gray.gray400,
  },
  cardImage: {
    width: 92,
    height: 92,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 8,
  },

  textContent: {
    flex: 1,
    gap: 30,
    // backgroundColor: "red",
  },

  button: {
    // backgroundColor: "#FFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  cardtitle: {
    fontSize: 18,
    color: Color.base.White,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: Color.Gray.gray100,
  },
  signIn: {
    padding: 5,

    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Export the component
export default FloatingRestaurantCard;
