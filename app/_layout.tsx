import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Provider } from '@ant-design/react-native';
import { AntDWoodlandsTheme } from '../lib/theme/woodlands-theme';

// Web layout with Ant Design theme
const WebLayout = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS !== 'web') return children;
  
  const { ConfigProvider } = require('antd');
  
  return (
    <ConfigProvider theme={AntDWoodlandsTheme}>
      {children}
    </ConfigProvider>
  );
};

// Native layout with React Native theme
const NativeLayout = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === 'web') return children;
  
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default function RootLayout() {
  const stackContent = (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#2B7F47',
        headerTitleStyle: {
          fontWeight: '600',
          color: '#1C1B1A',
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Woodlands Events',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }} 
      />
      <Stack.Screen 
        name="event/[id]" 
        options={{ 
          title: 'Event Details',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );

  return (
    <WebLayout>
      <NativeLayout>
        {stackContent}
      </NativeLayout>
    </WebLayout>
  );
}