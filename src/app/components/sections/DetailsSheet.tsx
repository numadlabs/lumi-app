import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import Animated, { useSharedValue, withSpring, runOnJS, ReduceMotion } from 'react-native-reanimated';
import { TickCircle, Location, TicketExpired, User } from 'iconsax-react-native';
import Color from '@/app/constants/Color';
import Tick from '../icons/Tick';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { height } from '@/app/lib/utils';



interface BottomSheetProps {

  benefits: string | string[],
  locations: string | string[],
  memberships: string | string[],
  about: string | string[],
  instruction: string | string[],
  artistInfo: string | string[]
}

const DetailsSheet: React.FC<BottomSheetProps> = ({ benefits, locations, memberships, about, instruction, artistInfo }) => {
  // const translateY = useSharedValue(0);

  // useEffect(() => {
  //   translateY.value = withSpring(isVisible ? 0 : 1000, {
  //     mass: 1.5,
  //     damping: 40,
  //     stiffness: 398,
  //     overshootClamping: false,
  //     restDisplacementThreshold: 0.01,
  //     restSpeedThreshold: 20,
  //     reduceMotion: ReduceMotion.System,
  //   });
  // }, [translateY, isVisible]);

  // const handleOutsidePress = () => {
  //   onClose()
  // }

  return (
    // <Modal
    //   animationType="none"
    //   transparent={true}
    //   visible={isVisible}
    //   onRequestClose={onClose}
    // >
    //   <TouchableWithoutFeedback onPress={handleOutsidePress}>




    <View style={[styles.bottomSheet]}>
      <View style={styles.content}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White }}>Rewards</Text>
        <View style={{ marginVertical: 16 }}>
          <View style={styles.attribute}>
            <Tick size={24} color={Color.Gray.gray100} />
            <Text style={styles.attributeText}>
              {benefits}
            </Text>
          </View>
       
        </View>
        <View style={{ gap: 16 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White }}>
            Locations
          </Text>
          <View style={{ width: '90%' }}>
            <View style={styles.attribute}>
              <Location color={Color.Gray.gray100} />
              <TouchableOpacity>
              <Text
              numberOfLines={3}
                style={
                  (styles.attributeLocText)
                }
              >
                {locations}
              </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 16, color: Color.base.White }}>
            How it works
          </Text>
          <Text style={{color: Color.Gray.gray50, fontSize: 16, width: '90%'}}>
            {instruction}
          </Text>
        </View>
      </View>
    </View>


    //   </TouchableWithoutFeedback>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomSheet: {
    backgroundColor: Color.Gray.gray600,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',

    zIndex: 999,
    height:height/5
  },
  content: {
    backgroundColor:Color.Gray.gray600
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: Color.Gray.gray600,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: Color.Gray.gray400,
    fontWeight: 'normal',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: Color.System.systemSuccess,
    fontSize: 18,
    fontWeight: 'bold',
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray50,
    fontSize: 16,
    width: "95%",
  },

  attributeLocText: {
    color: Color.System.systemInformation,
    fontSize: 16,
    width: '50%'
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    height: 200,

  },
});

export default DetailsSheet;
