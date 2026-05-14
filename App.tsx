import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { useFonts, Cairo_700Bold, Cairo_400Regular, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';
import { View, Text } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import GlobalAutoUpdater from './src/components/common/GlobalAutoUpdater';

export default function App() {
  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
    Cairo_800ExtraBold,
  });

  // Since we also rely on global AppContext loading, we can defer hiding splash or just render children
  if (!fontsLoaded) {
    return null; // Or a splash/activity indicator
  }

  return (
    <AppProvider>
      <RootNavigator />
      <GlobalAutoUpdater />
      <StatusBar style="dark" />
    </AppProvider>
  );
}
