import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Color from "../constants/Color";
import { TickCircle } from "iconsax-react-native";
import Button from "../components/ui/Button";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "../lib/service/keysHelper";

const Success = () => {
  const queryClient = useQueryClient()




  const handleNavigation = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.info })
    router.navigate("/(tabs)")
  }
  return (
    <View style={styles.body}>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.svgContainer}>
          <TickCircle color={Color.System.systemSuccess} size={64} />
          <Text style={styles.topText}>Congratulations!</Text>
          <Text style={styles.bottomText}>
            You will earn extra rewards every time you use an Membership.
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          textStyle="primary"
          size="default"
          onPress={handleNavigation}
        >
          Continue
        </Button>
      </View>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    height: 212,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,

    paddingTop: 24,
    paddingBottom: 32,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32,
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  topText: {
    color: Color.base.White,
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 8,
  },
  bottomText: {
    marginTop: 12,
    color: Color.Gray.gray100,
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
