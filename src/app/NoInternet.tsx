import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmojiSad } from 'iconsax-react-native'
import Color from '@/constants/Color'
import { BODY_2_REGULAR, H6 } from '@/constants/typography'
import Button from '@/components/ui/Button'

const NoInternet = ({ onPress }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ padding: 16, backgroundColor: Color.Gray.gray500, borderRadius: 16 }}>
          <EmojiSad size={48} color={Color.Gray.gray100} />
        </View>

        <Text style={{ ...H6, color: Color.base.White, textAlign: 'center', marginTop: 16 }}>
          No internet{"\n"}
          connection available
        </Text>
        <Text style={{ ...BODY_2_REGULAR, color: Color.Gray.gray100, textAlign: 'center', marginTop: 8 }}>
          Please check your internet connection and try again
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <Button onPress={onPress}>
          <Text>
            Try again
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default NoInternet