import { Platform } from 'react-native';
import React from 'react';

export const isWeb = Platform.OS === 'web';

// Helper to use different components for web vs native
export function PlatformComponent<T>({ 
  web, 
  native 
}: { 
  web: React.ComponentType<T>, 
  native: React.ComponentType<T> 
}) {
  return isWeb ? web : native;
}