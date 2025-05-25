import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../authcontext.js';
import IconMenu from '../assets/icons/image.png'
import { Menu, Provider } from 'react-native-paper';
import CustomAlert from '../component/customalert.js';
import  BASE_URL from '../config/config.js'
import { useFocusEffect } from '@react-navigation/native';
import {store} from '../config/Reducer.js'

const App = ({ navigation }) => {
  const { isLoggedIn, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); 
  const [onOkPress, setOnOkPress] = useState(null);       

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useFocusEffect(
    React.useCallback(() => {
      setVisible(false);
    }, [])
  );

  // const checkIdDesa = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem('user_id');
  //     if (userId) {
  //       const idDesa = await fetchIdDesaFromAPI(userId);
  //       if (idDesa) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       console.error('User ID not found in AsyncStorage');
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error checking id_desa:', error);
  //     return false;
  //   }
  // };

  // const fetchIdDesaFromAPI = async (userId) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}presisi/user/desa/${userId}`);
  //     console.log(`${BASE_URL}presisi/user/desa/${userId}`)
  //     const data = await response.json();
  //     if (response.ok && data.length > 0) {
  //       const desaData = data[0];
  //       return desaData.id_desa || null;
  //     } else {
  //       console.error("No desa data found");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching desa data:', error);
  //     return null;
  //   }
  // };

  const handleProtectedPageNavigation = (page) => {
    if (!isLoggedIn) {
      showAlert(
        'Login diperlukan',
        'Anda harus login terlebih dahulu untuk dapat mengakses halaman ini',
        () => navigation.replace('LOGIN')
      );
    } else {
      navigation.navigate(page);
    }
  };  
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'MENU' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const showAlert = (title, message, onOkCallback) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
    setOnOkPress(() => onOkCallback);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleOkPress = () => {
    if (onOkPress) onOkPress();
    closeAlert();
  };

  useEffect(() => {
  }, [isLoggedIn]);

  const handleLogin = () => {
    navigation.replace('LOGIN');
  };

  
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.menuTitle}>MENU</Text>
            <View style={styles.menuButtonContainer}>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                    <Image source={IconMenu} style={{ width: 30, height: 30, tintColor: 'black' }} />
                  </TouchableOpacity>
                }
              >
              <Menu.Item
                onPress={isLoggedIn ? handleLogout : handleLogin}
                title={isLoggedIn ? "Logout" : "Login"}
              />
            </Menu>
          </View>
      </View>

      <View style={styles.containerRow}>
        <View style={styles.iconTextContainer}>
          <TouchableOpacity 
            style={styles.containerCircle} onPress={() => handleProtectedPageNavigation('KONEKSI ALAT')}>
            <Image source={require('../assets/icons/IconKoneksiAlat.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.Text}>Koneksi Alat</Text>
        </View>

        <View style={styles.iconTextContainer}>
            <TouchableOpacity 
              style={styles.containerCircle} onPress={() => handleProtectedPageNavigation('SURVEI')}>
              <Image source={require('../assets/icons/PlaceMarker.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.Text}>Survei</Text>
        </View>
      </View>

      <View style={styles.containerRow}>
        <View style={styles.iconTextContainer}>
          <TouchableOpacity 
            style={styles.containerCircle} onPress={() => handleProtectedPageNavigation('FORMULIR')}>
            <Image source={require('../assets/icons/formulirr.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.Text}>Formulir</Text>
        </View>

        <View style={styles.iconTextContainer}>
          <TouchableOpacity 
            style={styles.containerCircle} onPress={() => handleProtectedPageNavigation('UNDUH HASIL')}>
            <Image source={require('../assets/icons/IconUnduhHasil.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.Text}>Unduh Hasil</Text>
        </View>
      </View>

      <View style={styles.containerRow}>
        <View style={styles.iconTextContainer}>
          <TouchableOpacity 
          style={styles.containerCircle} onPress={() => navigation.navigate('PANDUAN')}>
            <Image source={require('../assets/icons/IconPanduan.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.Text}>Panduan</Text>
        </View>

        <View style={styles.iconTextContainer}>
          <TouchableOpacity 
          style={styles.containerCircle} onPress={() => handleProtectedPageNavigation('PROFIL')}>
            <Image source={require('../assets/icons/user-2.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.Text}>Profil</Text>
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        onOkPress={handleOkPress} 
      />
    </View>
  </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerRow: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 25,
  },
  containerCircle: {
    // backgroundColor: '#FAF1E6',
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    marginTop: 10, 
    textAlign: 'center',
  },
  icon: {
    width: 50, 
    height: 50, 
  },
  panelMenuText: {
    color: '#fff',
    fontSize: 18,
    // fontFamily: 'Alkalami-Regular',
  },
  Text: {
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
    // fontSize: 14
    // fontFamily: 'Poppins-Regular', 
  },
  iconTextContainer: {
    alignItems: 'center', 
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderBottomWidth: 1, // Ketebalan garis bawah
    borderBottomColor: '#000', // Warna garis bawah
    backgroundColor: '#99BC85',
  },
  menuTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: 'Alkalami-Regular', 
    textAlign: 'center',
    flex: 1, 
    paddingVertical: 5,
    marginBottom: 5,
    letterSpacing: 3
  },
  menuButtonContainer: {
    marginLeft: -40,
    padding: 0,
  },
  menuButton: {
    padding: 5,
  },
});

export default App;
