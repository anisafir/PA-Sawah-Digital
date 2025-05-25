import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Panduan = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {/* Kartu PANDUAN ALAT */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PANDUAN ALAT')}>
          <Image source={require('../assets/icons/icon5.png')} style={styles.image} />
          <Text style={styles.cardText}>PANDUAN ALAT</Text>
        </TouchableOpacity>

        {/* Kartu TENTANG APLIKASI */}
        <TouchableOpacity style={styles.card1} onPress={() => navigation.navigate('TENTANG APLIKASI')}>
          <Image source={require('../assets/icons/info.png')} style={styles.icon} />
          <Text style={styles.cardText}>TENTANG APLIKASI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 150,
    height: 150,
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  containerSquare: {
    backgroundColor: '#C19A9A',
    width: 360,
    height: 170,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  Text: {
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Alkalami-Regular', // Gunakan font Alkalami
    alignItems: 'center',
    marginLeft: 10,
  },
  menuContainer: {
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationColor: 'black',
    letterSpacing: 2
  },
});

export default Panduan;
