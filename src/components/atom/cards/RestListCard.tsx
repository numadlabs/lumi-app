import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { RestaurantType } from "@/lib/types";
import Color from "@/constants/Color";
import { Reserve } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../ui/Button";
import { SERVER_SETTING } from "@/constants/serverSettings";
import {
  BODY_1_MEDIUM,
  BUTTON_32,
  CAPTION_1_REGULAR,
  STYLIZED_UPPERCASE_REGULAR,
} from "@/constants/typography";

interface ResListCardProp {
  marker: RestaurantType;
  onPress: () => void;
}
const RestListCard: React.FC<ResListCardProp> = ({ marker, onPress }) => {
  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      style={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Color.Gray.gray400,
        marginBottom: 16,
      }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: `${SERVER_SETTING.CDN_LINK}${marker.logo}` as string,
          }}
          style={styles.image}
        />
        <View style={{ height: 92, justifyContent: "space-between" }}>
          <View style={{ gap: 4 }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
              {marker.name}
            </Text>
            <Text style={styles.category}>{marker.categoryName}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "82%",
              alignItems: "center",
              ...(marker.isOwned
                ? { gap: 12 }
                : { justifyContent: "space-between" }),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: marker.isOpen
                      ? `${Color.System.systemSuccess}`
                      : `${Color.System.systemError}`,
                  },
                ]}
              />
              <Text
                style={{
                  color: marker.isOpen
                    ? `${Color.System.systemSuccess}`
                    : `${Color.System.systemError}`,
                }}
              >
                {marker.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
            {marker.isOwned ? (
              <View
                style={{
                  width: 1,
                  height: 14,
                  backgroundColor: Color.Gray.gray50,
                }}
              />
            ) : (
              ""
            )}
            {marker.isOwned ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Reserve color={Color.Gray.gray50} size={16} />
                <Text
                  style={{ color: Color.Gray.gray50, ...CAPTION_1_REGULAR }}
                >
                  {marker.visitCount} Check-ins
                </Text>
              </View>
            ) : (
              <Button
                variant="text"
                onPress={onPress}
                size="small"
                style={{
                  alignItems: "center",
                  height: 36,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 16,
                  borderColor: Color.base.White,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    marginLeft: 8,
                    alignItems: "center",
                    paddingVertical: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={{ ...BUTTON_32, color: Color.base.White }}>
                    Add
                  </Text>
                </View>
              </Button>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default RestListCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    padding: 12,

    borderRadius: 20,
    gap: 16,
  },
  image: {
    borderRadius: 12,
    width: 92,
    height: 92,
  },
  title: {
    ...BODY_1_MEDIUM,
    color: Color.base.White,
  },
  category: {
    ...STYLIZED_UPPERCASE_REGULAR,
    color: Color.Gray.gray100,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});
