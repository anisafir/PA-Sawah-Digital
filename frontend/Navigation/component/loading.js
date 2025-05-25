import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = ({ size = 80, color = '#486C3E' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: '##eb4034',  
  },
});

export default LoadingScreen;
