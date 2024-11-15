import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Color from '@/constants/Color'
import { Add, Bitcoin, ScanBarcode, TicketStar } from 'iconsax-react-native'
import { BODY_2_MEDIUM, CAPTION_1_REGULAR, CAPTION_2_REGULAR } from '@/constants/typography'


interface NotificationProps {
  title: string;
  type: string;
  time: string;
  description: string;
}
const NotificationCard: React.FC<NotificationProps> = ({title,type, time, description}) => {


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REWARD':
        return <TicketStar size={20} color="#fff" />;
      case 'TAP':
        return <ScanBarcode size={20} color="#fff" />;
      case 'BONUS':
        return <Add size={20} color="#fff" />;
      default:
        return <Add size={20} color="#fff" />;
    }
  }
  return (
    <View>
      <View style={styles.body}>
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={{ borderRadius: 16 }}>
          <View style={styles.container}>
            <View
              style={{
                marginHorizontal: 12,
                marginVertical: 16,
                flexDirection: "row",
                gap: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: Color.Gray.gray400,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                }}
              >
                  {getNotificationIcon(type)}
              </View>
              <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
                <Text
                  style={{
                    color: Color.base.White,
                    ...BODY_2_MEDIUM,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    color: Color.Gray.gray50,
                    ...CAPTION_1_REGULAR,
                  }}
                >
                  {description}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <Text style={{ ...CAPTION_2_REGULAR, color: Color.base.White }}>{time}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  )
}

export default NotificationCard


const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  container: {
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
});
