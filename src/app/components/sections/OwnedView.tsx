import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Color from '@/app/constants/Color';
import { height } from '@/app/lib/utils';
import DetailsSheet from './DetailsSheet';

const OwnedView = () => {
  const offset = useSharedValue(0);
  const [showPerks, setShowPerks] = useState(true);
  const [loading, setLoading] = useState(false);
  const backgroundColor = showPerks ? Color.Gray.gray300 : Color.Gray.gray400;
  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  const [isOpen, setOpen] = useState(false);
  const toggleBottomSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeY;
    })
    .onFinalize(() => {
      if (offset.value < height / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(height / 2, {}, () => {
          runOnJS(toggleBottomSheet)();
        });
      }
    });

    const toggleView = (view) => {
      setShowPerks(view);
    };
  return (
    <View style={styles.attrContainer}>
    <View
      style={{
        backgroundColor: Color.Gray.gray400,
        justifyContent: "space-between",
        borderRadius: 48,
        height: 48,
        width: "100%",
        flexDirection: "row",
        padding: 4,
      }}
    >
      <TouchableOpacity
        onPress={() => toggleView(true)}
        style={{
          backgroundColor: backgroundColor,
          alignItems: "center",
          borderRadius: 48,
          justifyContent: "center",
          width: "50%",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: Color.base.White,
            fontWeight: "bold",
          }}
        >
          Perks
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleView(false)}>
        <View
          style={{
            backgroundColor: showPerks
              ? Color.Gray.gray400
              : Color.Gray.gray300,
            flex: 1,
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: 60,
            justifyContent: "center",
            borderRadius: 48,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: Color.base.White,
              fontWeight: "bold",
            }}
          >
            Details
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={{ flex: 1, flexGrow: 1, marginTop: 32 }}>
      {isLoading ? (
        <ActivityIndicator color={Color.Gray.gray600} />
      ) : showPerks ? (
        <View style={styles.powerUpGrid}>
          {perks && perks.length > 0 ? (
            perks.map((item, index) => (
              <PowerUpCard
                key={index}
                title={item.name}
                onPress={() =>
                  router.push({
                    pathname: `/PowerUp`,
                    params: {
                      name: item.name,
                      id: item.id,
                    },
                  })
                }
              />
            ))
          ) : (
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={{ borderRadius: 16 }}>
            <View
              style={{
                gap: 16,
                padding: 24,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: Color.Gray.gray400,
                alignItems: 'center',
                paddingVertical: 32,
                 paddingHorizontal: 24
              }}
            >
              <View
                style={{padding:12, backgroundColor:Color.Gray.gray400, justifyContent: "center", alignItems: "center", width:52, borderRadius: 12 }}
              >
                <PerkGradient/>
              </View>

              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 16,
                  fontSize: 12,
                  fontWeight: "400",
                  color: Color.Gray.gray50
                }}
              >
                You haven’t got any perks yet.{"\n"} Every 10th check-in,
                you will receive perks.
              </Text>
            </View>
            </LinearGradient>
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, flexGrow: 1, marginBottom: 150, padding: 8 }}
        >
          <DetailsSheet
            benefits={benefits}
            locations={location}
            memberships={membership}
            about={about}
            instruction={instruction}
            artistInfo={artistInfo}
          />
        </View>
      )}
    </View>
  </View>
  )
}

export default OwnedView


const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray200,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  powerUpGrid: {
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
});