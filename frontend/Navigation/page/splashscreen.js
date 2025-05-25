import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const navigateToMenu = () => {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MENU' }],
        });
      }, 3000); // 3-second delay
    };

    navigateToMenu();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/icon5.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>SAWAH DIGITAL</Text>
      </View>
      <Text style={styles.subtitle}>Selamat Datang Di Aplikasi Pemetaan Detail Poligon Sawah</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    borderRadius: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 0,
    textDecorationLine: 'underline', // Menambahkan garis bawah pada teks
    textDecorationColor: '#000000', // Warna underline (opsional)
    textDecorationStyle: 'solid', // Jenis garis (solid, dotted, dashed)
    letterSpacing: 5,
  },
  subtitle: {
    paddingTop: 20,
    fontSize: 14,
    color: '#000000',
    marginTop: 0,
    fontFamily: 'Alkalami-Regular',
  },
});

export default SplashScreen;
