import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ColorsScreen from './src/screens/ColorsScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import HomeScreen from './src/screens/HomeScreen';
import TypographyScreen from './src/screens/TypographyScreen';
import { MaterialSymbolsRoundedFont } from './src/components/Icon';
import { dmSans } from './src/theme/typography';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    MaterialSymbolsRounded: MaterialSymbolsRoundedFont,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { color: '#1A1A1A', fontFamily: dmSans.semiBold },
            headerTintColor: '#1A1A1A',
            contentStyle: { backgroundColor: '#F2F2F2' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'send · design system' }} />
          <Stack.Screen name="Colors" component={ColorsScreen} options={{ title: 'Colors' }} />
          <Stack.Screen name="Typography" component={TypographyScreen} options={{ title: 'Typography' }} />
          <Stack.Screen
            name="Components"
            component={ComingSoonScreen}
            initialParams={{ title: 'Components' }}
            options={{ title: 'Components' }}
          />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
