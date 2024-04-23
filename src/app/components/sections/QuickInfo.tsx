import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../../constants/Color";
import { router } from "expo-router";
import Button from "../ui/Button";
import ProgressBar from "./ProgressBar";
import { width } from "@/app/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
const QuickInfo = ({ user }) => {

  const [progress, setProgress] = useState(0);

  console.log(user)

  useEffect(() => {

    const totalFields = 4;
    const filledFields = [user?.nickname, user?.email, user?.location, user?.dateOfBirth].filter(
      field => field !== null
    ).length;
    const newProgress = filledFields / totalFields;
    setProgress(newProgress);
  }, [user.nickname, user.email, user.location, user.dateOfBirth]);


return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 24,
          borderRadius: 16
        }}
      >
        <View style={styles.container1}>
          <View style={styles.textContainer}>
            <Text style={styles.topTitle}>Boost your rewards</Text>
            <Text style={styles.bottomTitle}>More data, more Bitcoin.</Text>
          </View>
          <View>
            <Button
              variant="primary"
              onPress={() => router.push("(boost)/Email")}>
              <Text style={{ color: Color.base.White }}>
                Start
              </Text>
            </Button>
          </View>
        </View>
        <View style={styles.container2}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <ProgressBar progress={progress} width={'85%'} height={8} />
            <Text style={{ color: Color.base.White, fontSize: 12, lineHeight: 16, fontWeight: '700' }}>{`${progress * 100}%`}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default QuickInfo;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    height: '90%'
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width:300,
    marginTop: 20,
    alignItems: "center",
  },
  textContainer: {
    gap: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Color.base.White,
  },
  bottomTitle: {
    fontSize: 12,
    color: Color.Gray.gray100,
  },
  button: {
    borderRadius: 48,
    backgroundColor: Color.base.Black,
    paddingVertical: 12,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 13,
    fontWeight: "bold",
  },
  progressPerc: {
    fontSize: 10,
    color: Color.base.White,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
