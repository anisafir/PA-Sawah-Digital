import React, {useState, useEffect} from 'react';
import { 
    View, Text, 
    TextInput, TouchableOpacity,
    StyleSheet, Image,
    ScrollView, FlatList, 
    Alert, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, Provider, RadioButton } from 'react-native-paper';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';
import { WebView } from 'react-native-webview';
import {Picker} from '@react-native-picker/picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';




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
});

const RegistrationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instansi, setInstansi] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !instansi ||
      !password ||
      !confirmPassword
    ) {
      showAlert('Error', 'Semua kolom harus diisi');
      return;
    }

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
      showAlert('Error', 'Nomor telepon hanya boleh berisi angka');
      return;
    }

    if (password.length < 8) {
      showAlert('Error', 'Password harus minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      nama: name,
      email,
      no_telp: phone,
      instansi,
      password,
    };

    try {
      const response = await fetch(`${BASE_URL}user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravityAndOffset(
            'Akun berhasil dibuat!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            100
          );
        } else {
          Alert.alert('Sukses', 'Akun berhasil dibuat!');
        }

        setName('');
        setEmail('');
        setPhone('');
        setInstansi('');
        setPassword('');
        setConfirmPassword('');

        navigation.navigate('LOGIN');
      } else {
        showAlert('Error', data.message);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      showAlert('Error', 'Something went wrong. Please try again.');
    }
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/icon5.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>SAWAH DIGITAL</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor="#CCCCCC"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CCCCCC"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            placeholder="Nomor Telepon"
            placeholderTextColor="#CCCCCC"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Instansi</Text>
          <TextInput
            style={styles.input}
            placeholder="Instansi"
            placeholderTextColor="#CCCCCC"
            value={instansi}
            onChangeText={setInstansi}
          />

          {/* Kata Sandi */}
          <Text style={styles.label}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Kata Sandi"
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Ulangi Kata Sandi */}
          <Text style={styles.label}>Ulangi Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Ulangi Kata Sandi"
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Tombol Daftar */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>DAFTAR</Text>
          </TouchableOpacity>
        </View>
        {/* Custom Alert Modal */}
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={closeAlert}
        />
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LOGIN')}>
            <Text style={styles.boldText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const ConnectDevice = ({ navigation }) => {
  const [isScanning, setScanning] = useState(false);
  const [bleDevices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null); //penambahan baru
  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule)

  useEffect(() => {
    // requestPermissions();

    BleManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    });
  }, []);

  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is already enabled or the user confirmed');
        requestPermission()
      })
      .catch(error => {
        console.log('The user refused to enable Bluetooth');
      });
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
        setScanning(false)
        handleGetConnectedDevices()
        console.log("Scan Stopped")
    })

    return () => stopListener.remove()
  }, [])

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    if (granted){
        startScanning()
    }
  };

  const startScanning = () => {
    if (!isScanning){
        BleManager.scan([], 5, false).then(() => {
            console.log("Scan started");
            setScanning(true)
          }).catch((error) => {
            console.error(error)
          })
    }
    
  }

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
      console.log('Bonded devices:', bondedPeripheralsArray);
      if (bondedPeripheralsArray.length === 0) {
        console.log('No bonded peripherals found');
      } else {
        const devices = bondedPeripheralsArray.filter((device) => device.name); // Filter devices with names
        setDevices(devices); // Update state with bonded devices
        // console.log(JSON.stringify(devices));
      }
    }).catch(error => {
      console.error('Error while retrieving bonded peripherals:', error);
    });
  }

  const connectToDevice = (device) => {
    console.log('Attempting to connect to device:', device);
    BleManager.connect(device.id)
      .then(() => {
        console.log('Connected to ' + device.name);
        setConnectedDevice(device); // Simpan perangkat yang terhubung
      })
      .catch((error) => {
        console.log('Connection error', error);
      });
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      BleManager.disconnect(connectedDevice.id)
        .then(() => {
          console.log('Disconnected from ' + connectedDevice.name);
          setConnectedDevice(null); // Reset state setelah disconnect
        })
        .catch((error) => {
          console.log('Disconnection error', error);
        });
    } else {
      console.log('No device connected');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.bleCard}>
        <Text style={styles.bleText}>{item.name || 'Unnamed device'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => connectToDevice(item)}>
          <Text style={styles.btnText}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  };

   return (
    <View style={styles.container}>
      <Text>Perangkat terdekat yang tersedia</Text>
      {isScanning ? <Text>Mendeteksi ...</Text> : null}
      <FlatList
        data={bleDevices}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
      />
      <TouchableOpacity style={styles.button1} onPress={startScanning}>
        <Text style={styles.btnText}>Pindai ulang</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={disconnectFromDevice}>
        <Text style={styles.btnText}>Disconnect</Text>
      </TouchableOpacity>

      <View style={styles.containerMap}>
        <WebView
          source={{ uri: 'https://anisafir.github.io/WebView-SawahDigital/peta.html' }}
          style={styles.webView}
        />
      </View>

      {/* <TouchableOpacity style={styles.buttonsurvey} onPress={() => navigation.navigate('SURVEI')}>
        <Text style={styles.btnText}>Survei</Text>
      </TouchableOpacity> */}
    </View>
  );

};


export default ConnectDevice;

const FormScreen = () => {
  const navigation = useNavigation();
  const [dataForm, setDataForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        console.log('Retrieved user_id from AsyncStorage:', user_id);
        if (user_id) {
          setUserId(user_id);
          fetchForm(user_id);
        } else {
          console.error('User ID not found in AsyncStorage');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
        setLoading(false);
      }
    };

    const fetchForm = async userId => {
      try {
        const response = await fetch(`${BASE_URL}form/panggilForm/${userId}`);
        const data = await response.json();

        if (data.success) {
          setDataForm(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal mengambil data survei');
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      if (userId) {
        fetchForm(userId);
      } else {
        fetchUserId();
      }
    }
  }, [isFocused]);

  const handleNavigate = () => {
    navigation.navigate('FORMULIR SAWAH');
  };

  const handleEdit = item => {
    navigation.navigate('EDIT FORM', {item});
  };

  const handleDelete = async id => {
    try {
      Alert.alert(
        'Konfirmasi',
        'Apakah Anda yakin ingin menghapus data ini?',
        [
          {
            text: 'Batal',
            onPress: () => console.log('Hapus dibatalkan'),
            style: 'cancel',
          },
          {
            text: 'Hapus',
            onPress: async () => {
              setDeletingId(id);
              try {
                const response = await fetch(
                  `${BASE_URL}form/hapusform/${id}`,
                  {
                    method: 'DELETE',
                  },
                );

                const result = await response.json();

                if (result.success) {
                  Alert.alert('Sukses', 'Data berhasil dihapus');
                  // fetchData()
                  setDataForm(prevData =>
                    prevData.filter(item => item.id !== id),
                  );
                } else {
                  Alert.alert('Gagal', 'Gagal menghapus data');
                }
              } catch (error) {
                console.error('Error menghapus data:', error);
                Alert.alert('Error', 'Terjadi kesalahan saat menghapus data');
              } finally {
                setDeletingId(null)
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error saat memproses konfirmasi penghapusan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memproses penghapusan');
    }
  };

  const formatTanggal = tanggal => {
    const date = new Date(tanggal);

    const jam = date
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace('.', ':');

    const tanggalFormatted = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `${jam}, ${tanggalFormatted}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Kotak Card */}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={[
            styles.cardgeo,
            dataForm.length === 0 && styles.cardgeoEmpty,
          ]}>
          {dataForm.length === 0 ? (
            <Text style={styles.noDataText}>Belum ada form terisi</Text>
          ) : (
            dataForm.map((item, index) => (
              <View key={item.id || index} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Text style={styles.label}>
                      Pemilik: {item.nama_pemilik}
                    </Text>
                    <Text style={styles.label2}>
                      Dibuat: {formatTanggal(item.created_at)}
                    </Text>

                    <Text style={styles.label2}>
                      Diubah:{' '}
                      {new Date(item.updated_at).getTime() !==
                      new Date(item.created_at).getTime()
                        ? formatTanggal(item.updated_at)
                        : '-'}
                    </Text>
                  </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Image
                      source={require('../assets/icons/pencil.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} disabled={deletingId === item.id}>
                    {deletingId === item.id ? (
                      <ActivityIndicator size="small" color="#999" />
                    ) : (
                      <Image
                        source={require('../assets/icons/delete.png')}
                        style={styles.buttonImage}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Tombol Tambah Formulir */}
      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}>TAMBAH FORMULIR</Text>
      </TouchableOpacity>
    </View>
  );
};

const PanduanAlat = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={data}
        enableSwipeDown={true}
        backgroundColor="#fff"
        renderIndicator={(currentIndex, allSize) => (
          <View style={styles.indicatorContainer}>
            <Text
              style={
                styles.indicatorText
              }>{`${currentIndex} / ${allSize}`}</Text>
          </View>
        )}
      />
{/* 
      <View style={styles.buttonContainer}>
        {dataPDF.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => downloadPDF(item.url, 'buku_panduan', setIsLoading)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{item.title}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View> */}
    </View>
  );
};
const FormSawah = ({navigation}) => {

  // Form data state
  const [formData, setFormData] = useState({
    namaPemilik: '',
    informasiWilayah: '',
    luasLahan: '',
    jenisTanaman: '',
    masaPanen: '',
    sumberAir: 'Sungai', // Default value
    jarakDariSumberAir: '',
    metodePengairan: 'Irigasi Genangan', // Default value
    dokumentasiUtara: null,
    dokumentasiSelatan: null,
    dokumentasiBarat: null,
    dokumentasiTimur: null,
    titikKoordinat: [''],
    pelaksanaSurvei: [''],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [villages, setVillages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [ketersediaanAir, setKetersediaanAir] = useState('Tercukupi');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [dataPatok, setDataPatok] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        console.log("Retrieved user_id from AsyncStorage:", user_id); 
        if (user_id) {
          setUserId(user_id); 
          fetchTitikSurvei(user_id);
        } else {
          console.error("User ID not found in AsyncStorage");
          setLoading(false); 
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
        setLoading(false); 
      }
    };

    fetchUserId()
  }, []);

  const fetchTitikSurvei = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}data/panggildata/${userId}`);
      const data = await response.json();
  
      if (data.success) {
        setDataPatok(data.data);
      } else {
        setError(data.message);
        showAlert('Error', data.message || 'Gagal mengambil data titik koordinat');
      }
    } catch (err) {
      console.error('Error fetching titik koordinat:', err);
      setError('Gagal mengambil data titik koordinat');
      showAlert('Error', 'Gagal mengambil data titik koordinat');
    } finally {
      setLoading(false);
    }
  };

  // Village selection handler
  const handleSelectVillage = (item) => {
    setSelectedVillage(item.value);
    setSelectedDistrict(item.district);
    setSelectedCity(item.city);
    setSelectedProvince(item.province);
    setSearchQuery(item.label);
    setShowDropdown(false);
    
    handleInputChange(setFormData, 'informasiWilayah', {
      desa: item.value,
      kecamatan: item.district,
      kabupaten: item.city,
      provinsi: item.province,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectVillage(item)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const dokumentasiList = [
    { key: 'dokumentasiUtara', label: 'Dokumentasi Arah Utara' },
    { key: 'dokumentasiSelatan', label: 'Dokumentasi Arah Selatan' },
    { key: 'dokumentasiBarat', label: 'Dokumentasi Arah Barat' },
    { key: 'dokumentasiTimur', label: 'Dokumentasi Arah Timur' },
  ];

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleSubmit = async () => {
    const requiredFields = ['namaPemilik', 'luasLahan', 'jenisTanaman'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      showAlert('Error', 'Mohon lengkapi semua data yang diperlukan');
      return;
    }
  
    setLoading(true);
    try {
      const imageKeys = ['dokumentasiUtara', 'dokumentasiTimur', 'dokumentasiSelatan', 'dokumentasiBarat'];
      const uploadedImages = {};
      const publicIdArray = [];
  
      for (const key of imageKeys) {  
        const uri = formData[key];
        if (uri && !uri.startsWith('http')) {
          const cloudinaryUrl = await uploadToCloudinary(uri);
          if (!cloudinaryUrl) {
            showAlert('Error', `Gagal upload gambar ${key}`);
            setLoading(false);
            return;
          }
          // convert "dokumentasiUtara" → "dokumentasi_utara"
          const snakeKey = key.replace('dokumentasi', 'dokumentasi_').toLowerCase();
          uploadedImages[snakeKey] = cloudinaryUrl.url;
          publicIdArray.push(cloudinaryUrl.public_id);
        } else if (uri) {
          const snakeKey = key.replace('dokumentasi', 'dokumentasi_').toLowerCase();
          uploadedImages[snakeKey] = uri;
        }
      }
  
      const dataToSubmit = {
        nama_pemilik: formData.namaPemilik,
        waktu_pelaksanaan: waktuPelaksanaan.toISOString(),
        desa: selectedVillage,
        kecamatan: selectedDistrict,
        kab_kota: selectedCity,
        provinsi: selectedProvince,
        luas_lahan: formData.luasLahan,
        jenis_tanaman: formData.jenisTanaman,
        masa_panen: formData.masaPanen,
        sumber_air: formData.sumberAir,
        jarak_sumber_air: formData.jarakDariSumberAir,
        ketersediaan_air: ketersediaanAir,
        metode_pengairan: formData.metodePengairan,
        titik_koordinat_id: formData.titikKoordinat,
        pelaksana_survei: formData.pelaksanaSurvei,
        user_id: userId,
        cloudinary_ids: publicIdArray,
        ...uploadedImages,
      };
  
      const response = await fetch(`${BASE_URL}form/tambahForm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
  
      const responseText = await response.text();
      const result = JSON.parse(responseText);
  
      if (response.ok && result.success) {
        showAlert('Sukses', 'Data berhasil disimpan');
        resetForm(
          setFormData,
          setKetersediaanAir,
          setWaktuPelaksanaan,
          setSelectedVillage,
          setSelectedDistrict,
          setSelectedCity,
          setSelectedProvince,
          setSearchQuery
        );
        setTimeout(() => {
          navigation.goBack()
        }, 2000);
      } else {
        console.log('Response from server:', result);

        throw new Error(result.message || `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('Error', `Gagal menyimpan data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const renderHeader = () => (
    <View style={styles.header}>
      <FormInput
        label="Nama Pemilik"
        required
        value={formData.namaPemilik}
        onChangeText={(text) => handleInputChange(setFormData, 'namaPemilik', text)}
        placeholder="Nama pemilik lahan"
      />
      
      <Text style={styles.label}>Waktu Pelaksanaan <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={[styles.input, styles.textInputStyle]}
          value={waktuPelaksanaan ? formatDate(waktuPelaksanaan) : ''}
          editable={false}
          placeholder="Pilih Tanggal"
          placeholderTextColor="#626964"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={waktuPelaksanaan || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange(setShowDatePicker, setWaktuPelaksanaan)}
        />
      )}

      <View style={styles.cardBig}>
        <View style={styles.carddesa}>
          <Text style={styles.label}>Informasi Wilayah <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Cari Desa..."
            placeholderTextColor="#626964"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text, setVillages, setLoading, setShowDropdown, setSearchQuery, showAlert)}
          />
          {/* {loading && <ActivityIndicator size="small" color="#000" style={styles.loader} />} */}

          {showDropdown && (
            <FlatList
              data={villages}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              nestedScrollEnabled={true}
              renderItem={renderItem}
              style={styles.dropdown}
              ListEmptyComponent={() => !loading && <Text style={styles.noResultText}>Tidak ada hasil ditemukan</Text>}
              showsVerticalScrollIndicator= {false}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Informasi Wilayah Terpilih</Text>
          <View style={styles.infoContainer}>
            {[
              {
                label: 'Desa',
                value: selectedVillage
              },
              {
                label: 'Kecamatan',
                value: selectedDistrict
              },
              {
                label: 'Kabupaten/Kota',
                value: selectedCity
              },
              {
                label: 'Provinsi',
                value: selectedProvince
              },
            ].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.infoValue}>{item.value || '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={[{}]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => null}
      ListHeaderComponent={renderHeader()}
      showsVerticalScrollIndicator= {false}
      ListFooterComponent={
        <View>
          <FormInput
            label="Luas Lahan"
            required
            value={formData.luasLahan}
            onChangeText={(text) => handleInputChange(setFormData, 'luasLahan', text)}
            placeholder="contoh: 1000 m²"
            keyboardType="numeric"
            />  

            <FormInput
            label="Jenis Tanaman"
            required
            value={formData.jenisTanaman}
            onChangeText={(text) => handleInputChange(setFormData, 'jenisTanaman', text)}
            placeholder="contoh: Padi"
            />  

            <FormInput
            label="Masa Panen"
            required
            value={formData.masaPanen}
            onChangeText={(text) => handleInputChange(setFormData, 'masaPanen', text)}
            placeholder="contoh: 3 Bulan"
            />  

            <Text style={styles.label}>Sumber Air</Text>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.sumberAir}
              onValueChange={(itemValue) => handleInputChange(setFormData, 'sumberAir', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              <Picker.Item label="Sungai" value="Sungai" />
              <Picker.Item label="Jaringan Irigasi Primer" value="Jaringan Irigasi Primer" />
              <Picker.Item label="Jaringan Irigasi Sekunder" value="Jaringan Irigasi Sekunder" />
              <Picker.Item label="Jaringan Irigasi Tersier" value="Jaringan Irigasi Tersier" />
              <Picker.Item label="Sumur Bor/Pompa" value="Sumur Bor/Pompa" />
              <Picker.Item label="Mata Air" value="Mata Air" />
              <Picker.Item label="Danau/Waduk" value="Danau/Waduk" />
              <Picker.Item label="Kolam Penampung Air Hujan" value="Kolam Penampung Air Hujan" />
            </Picker>
            </View>

            <FormInput
            label="Jarak dari Sumber Air"
            required
            value={formData.jarakDariSumberAir}
            onChangeText={(text) => handleInputChange(setFormData, 'jarakDariSumberAir', text)}
            placeholder="contoh: 100 meter"
            keyboardType='numeric'
            />  

            <Text style={styles.label}>Ketersediaan Air</Text>
            <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <RadioButton
                value="Tercukupi"
                status={ketersediaanAir === 'Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Tercukupi</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="Kurang Tercukupi"
                status={ketersediaanAir === 'Kurang Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Kurang Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Kurang Tercukupi</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="Tidak Tercukupi"
                status={ketersediaanAir === 'Tidak Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Tidak Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Tidak Tercukupi</Text>
            </View>
            </View>

            <Text style={styles.label}>Metode Pengairan</Text>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.metodePengairan}
              onValueChange={(itemValue) => handleInputChange(setFormData, 'metodePengairan', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              <Picker.Item label="Irigasi Genangan" value="Irigasi Genangan" />
              <Picker.Item label="Irigasi Curah" value="Irigasi Curah" />
              <Picker.Item label="Irigasi Alur" value="Irigasi Alur" />
            </Picker>
            </View>

            <Text style={styles.label}>Titik Koordinat</Text>
            {formData.titikKoordinat.map((item, index) => (
              <View key={index} style={styles.pickerContainer}>
                <Picker
                  selectedValue={item}
                  onValueChange={(value) => handleKoordinatChange(setFormData, formData, index, value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  enabled={!loading}>
                  <Picker.Item label="Pilih Titik Koordinat" value="" enabled={false}/>
                  {dataPatok.map((patok) => patok && patok.id_titik ? (
                    <Picker.Item 
                      key={String(patok.id_titik)} 
                      label={`${patok.nama_titik || ''}`} 
                      value={String(patok.id_titik)} 
                    />
                  ) : null)}
                </Picker>
              </View>
            ))}
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleRemoveKoordinat(setFormData, formData)}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleAddKoordinat(setFormData)}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
            </View>

            <Text style={styles.label}>Pelaksana Survei</Text>
            {formData.pelaksanaSurvei.map((item, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Nama Pelaksana Survei ${index + 1}`}
              value={item}
              onChangeText={value => handlePelaksanaChange(setFormData, formData, index, value)}
              placeholderTextColor="#626964"
            />
            ))}
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleRemovePelaksana(setFormData, formData)}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleAddPelaksana(setFormData)}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
            </View>

            {dokumentasiList.map(({ key, label }) => (
            <View key={key}>
              <Text style={styles.labelFoto}>{label}</Text>
              <TouchableOpacity
                onPress={() => handleImagePick(key, setFormData)}
                style={styles.imageUpload}>
                {renderImage(formData[key])}
              </TouchableOpacity>
            </View>
            ))}
            <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>SIMPAN</Text>
            )}
            </TouchableOpacity>

            <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={closeAlert}
            />
        </View>
      }
      />
  );
};

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
                  sawahdigital21@gmail.com
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

const UnduhPeta = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataTitik, setDataTitik] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        console.log('Retrieved user_id from AsyncStorage:', user_id);
        if (user_id) {
          setUserId(user_id);
          fetchForm(user_id);
        } else {
          console.error('User ID not found in AsyncStorage');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
        setLoading(false);
      }
    };

    const fetchForm = async userId => {
      try {
        const response = await fetch(`${BASE_URL}form/panggilform/${userId}`);
        const data = await response.json();

        if (data.success) {
          setDataTitik(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal mengambil data survei');
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const formatTanggal = tanggal => {
    const date = new Date(tanggal);

    const jam = date
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace('.', ':');

    const tanggalFormatted = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `${jam}, ${tanggalFormatted}`;
  };

  const downloadPDF = async (id) => {
    if (!id) {
      Alert.alert('Error', 'Form ID tidak ditemukan.');
      return;
    }

    setDownloadingId(id);
    try {
      const response = await fetch(`${BASE_URL}form/downloadpdf/${id}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengunduh PDF');
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
  
      let fileName = `pemetaan_sawah${id}.pdf`;
      let filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      let fileExists = await RNFS.exists(filePath);
      let count = 1;
  
      while (fileExists) {
        fileName = `pemetaan_sawah${id}(${count}).pdf`;
        filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        fileExists = await RNFS.exists(filePath);
        count++;
      }
  
      await RNFS.writeFile(filePath, base64Data, 'base64');
  
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          `File disimpan di Download/${fileName}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      } else {
        Alert.alert('Sukses', `File disimpan: ${fileName}`);
      }
    } catch (error) {
      console.error('Error saat mengunduh PDF:', error);
      Alert.alert('Peringatan', 'Gagal mengunduh PDF. Pastikan data sudah diisi.');
    } finally {
      setDownloadingId(null)
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.cardContainer,
            dataTitik.length === 0 && styles.centerEmpty,
          ]}>
          {dataTitik.length === 0 ? (
            <Text style={styles.noDataText}>Belum ada data titik</Text>
          ) : (
            dataTitik.map((item, index) => (
              <View key={item.id || index} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.title}>Pemilik: {item.nama_pemilik}</Text>
                    <Text style={styles.metaText}>
                      Dibuat: {formatTanggal(item.created_at)}
                    </Text>
                    <Text style={styles.metaText}>
                      Diubah:{' '}
                      {new Date(item.updated_at).getTime() !==
                      new Date(item.created_at).getTime()
                        ? formatTanggal(item.updated_at)
                        : '-'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadPDF(item.id)}
                    disabled={downloadingId === item.id}>
                    {downloadingId === item.id ? (
                      <ActivityIndicator size="small" color="#333" />
                    ) : (
                      <Text style={styles.downloadText}>⬇ Unduh Data</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};