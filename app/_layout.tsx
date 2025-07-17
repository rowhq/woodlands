import { Stack } from 'expo-router';
import { Provider } from '@ant-design/react-native';

export default function RootLayout() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Woodlands Events' }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
      </Stack>
    </Provider>
  );
}