import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const Tentang = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:sawahdigital20@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:082145291007');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/icon5.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>SAWAH DIGITAL</Text>
        </View>

        <View style={styles.teksContainer}>
          <Text style={styles.teks}>
            {'     '}Sawah Digital dirancang untuk memudahkan pengukuran dan
            pemetaan lahan sawah secara akurat. Dengan aplikasi ini, Anda dapat
            melakukan pengukuran lahan, memetakan lahan, mendapatkan informasi
            lahan, dan melihatnya melalui peta. {'\n'}
            {'     '}Tujuan aplikasi ini adalah untuk membantu pemerintah dan
            dinas pertanian untuk melakukan pengukuran dan pemetaan lahan sawah
            secara akurat dengan menghemat waktu dan tenaga. Sawah Digital
            menyediakan fitur yang sederhana dan mudah digunakan untuk surveyor
            dan pihak berwenang.
          </Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.teks2}>HUBUNGI KAMI:</Text>

          <View style={styles.contactContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.label}>No. Telp</Text>
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity onPress={handleEmailPress}>
                <Text style={[styles.value, styles.link]}>
                  sawahdigital20@gmail.com
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePhonePress}>
                <Text style={[styles.value, styles.link]}>082145291007</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F0EEED',
  },
  logoContainer: {
    width: 360,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 268
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 10,
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'Alkalami-Regular',
    letterSpacing: 2,
    textAlign: 'center',
  },
  teksContainer: {
    width: 360,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  teks: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
    textAlign: 'justify',
  },
  container2: {
    width: 360,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  teks2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 2,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#34a1eb',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default Tentang;
