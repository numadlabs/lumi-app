import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Location, TicketExpired, User } from 'iconsax-react-native'
import Color from '@/app/constants/Color'
import Tick from '../icons/Tick'

const BottomSheet = () => {
  return (
    <View>
      <View style={styles.textImageContainer}>
          <View style={styles.textContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{'name'}</Text>
            <Text style={{ fontSize: 12 }}>{'category'}</Text>
          </View>
          {/* <Image style={styles.image} source={require("@/public/images/Image1.png")} /> */}
        </View>
        <View style={styles.attrContainer}>
          <View style={{ gap: 32 }}>
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Benefits</Text>
              <View>
                <View style={styles.attribute}>
                  <Tick />
                  <Text style={styles.attributeText}>Earn BTC for every visit</Text>
                </View>
                <View style={styles.attribute}>
                  <Tick />
                  <Text style={styles.attributeText}>Earn BTC for every visit</Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Locations</Text>
              <View>
                <View style={styles.attribute}>
                  <Location color={Color.Gray.gray600} />
                  <Text style={styles.attributeText}>{'location'}</Text>
                </View>
              </View>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Memberships</Text>
            <View style={styles.membershipContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, }}>
                <TicketExpired color={Color.Gray.gray600} />
                <Text>Expiry</Text>
              </View>
              <View>
                <Text>1 year/ free to renew</Text>
              </View>
            </View>
            <View style={styles.membershipContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, }}>
                <User color={Color.Gray.gray600} />
                <Text>Artist</Text>
              </View>
              <View>
                <Text>Chun Maru</Text>
              </View>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>About</Text>
            <Text>{'about'}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>How it works</Text>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et justo sit amet nisl semper placerat id in arcu. </Text>
          </View>
        </View>
    </View>
  )
}

export default BottomSheet

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  closeButton: {

  },
  closeButtonContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  textImageContainer: {
    padding: 20,
    gap: 20,
    backgroundColor: Color.Gray.gray200,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    gap: 4
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
  },
  attribute: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16
  },
  membershipContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 20,
    bottom: 30,
    width: '100%',
    paddingHorizontal: 16
  }
})