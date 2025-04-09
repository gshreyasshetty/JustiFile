import React from 'react';
import { Platform } from 'react-native';

// Function to safely configure screen options without using string values for numeric properties
export const getScreenOptions = () => {
  const baseOptions = {
    headerStyle: {
      backgroundColor: '#1e40af',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  // Platform-specific options to avoid any potential issues
  if (Platform.OS === 'android') {
    return {
      ...baseOptions,
      // Use numeric values for any size-related properties
      headerTitleContainerStyle: {
        marginHorizontal: 16,
      },
    };
  }

  return baseOptions;
};

// Safe screen configuration factory
export const createScreenConfig = (title) => {
  return {
    title,
    // Ensure no size values are strings
    headerBackTitleVisible: false,
  };
};
