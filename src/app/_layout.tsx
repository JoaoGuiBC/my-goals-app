/* eslint-disable camelcase */

// CONFIG
import '@/libs/dayjs'
import '@/styles/global.css'

// LIBS
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// DATABASE
import { SQLiteProvider } from 'expo-sqlite/next'
import { databaseInit } from '@/database/database-init'

// FONTS
import {
  useFonts,
  OpenSans_700Bold,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from '@expo-google-fonts/open-sans'

// STYLES
import { colors } from '@/styles/colors'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded] = useFonts({
    OpenSans_700Bold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  })

  if (fontsLoaded) {
    SplashScreen.hideAsync()
  } else {
    return
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.gray[600] }}
    >
      <StatusBar style="light" />
      <SQLiteProvider databaseName="mygoals.db" onInit={databaseInit}>
        <Slot />
      </SQLiteProvider>
    </GestureHandlerRootView>
  )
}
