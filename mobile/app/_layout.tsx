import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from './cart/CartContext';
import FloatingCartButton from './cart/FloatingCartButton';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const hideCartButton = Boolean(pathname && (
    pathname.startsWith('/auth') || 
    pathname.endsWith('/login') || 
    pathname.includes('/checkout') ||
    pathname.includes('/payment')
  ));

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

  {!hideCartButton && <FloatingCartButton />}

        <StatusBar style="auto" />
      </CartProvider>
    </ThemeProvider>
  );
}
