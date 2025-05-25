import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Download = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UNDUH HASIL PETA')}>
          <Image
            source={require('../assets/icons/mapmarker.png')}
            style={styles.icon}
          />
          <Text style={styles.label}>PETA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card1}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UNDUH HASIL DATA')}>
          <Image
            source={require('../assets/icons/data.png')}
            style={styles.icon}
          />
          <Text style={styles.label}>DATA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    alignItems: 'center',
    // paddingTop: 10
  },
  card: {
    width: '96%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderColor: '#666262',
    borderWidth: 1,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 80,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  card1: {
    width: '96%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderColor: '#666262',
    borderWidth: 1,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    letterSpacing: 2,
    textDecorationLine: 'underline',
    textDecorationColor: '#000000',
    textDecorationStyle: 'solid',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    backgroundColor: '#486C3E',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  icon: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});

export default Download;
