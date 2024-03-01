import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../constants/Color'
import { TickCircle } from 'iconsax-react-native'
import Button from '../components/ui/Button'
import { router, useNavigation } from 'expo-router'

const Success = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <View style={styles.svgContainer}>
          <TickCircle color={Color.System.systemSuccess} size={64}/>
          <Text style={styles.topText}>
            Success
          </Text>
          <Text style={styles.bottomText}>
          Every time you use an A-card, you will receive extra rewards. Manage personal info in your settings.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button variant='primary' textStyle='primary' size='default' onPress={() => router.navigate('/')}>Continue</Button>
      </View>
    </View>
  )
}

export default Success

const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.base.White,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  container: {
    width: '100%',
    height: 212,
    paddingVertical: 16,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginTop: 16,
    elevation: 4,
    borderRadius: 32
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  topText: {
    color: Color.Gray.gray500,
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 8
  },
  bottomText: {
    marginTop: 12,
    color: Color.Gray.gray400,
    fontSize: 16,
    textAlign: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
    marginBottom: 20
  },
})