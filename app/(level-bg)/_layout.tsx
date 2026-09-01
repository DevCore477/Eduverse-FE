import { BottomMidRightBoundryColor, BottomRightBoundryColor, TopLeftBoundryColor } from "@/assets/images";
import OfflineBanner from "@/components/OfflineBanner";
import { useConnectivity } from "@/hooks/use-connectivity";
import { Slot } from 'expo-router';
import 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import { styles } from '@/styles/app/(level-bg)/_layout.styles';
import { LinearGradient } from "expo-linear-gradient";


export default function RootLayout() {
  const theme = useTheme()
  const themedStyles = styles(theme)
  const { connectivity } = useConnectivity()
  return (
    <LinearGradient
      colors={['#00AC56', '#00743A']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={themedStyles.container}>
      <TopLeftBoundryColor style={themedStyles.topLeft} />
      <BottomMidRightBoundryColor style={themedStyles.bottomMidRight} />
      <BottomRightBoundryColor style={themedStyles.bottomRight} />
      <Slot />
      {/* <Stack screenOptions={{ headerShown: false, contentStyle: themedStyles.stackContainer }} /> */}
      <OfflineBanner visible={!connectivity.isConnected} />
    </LinearGradient>
  );
}

