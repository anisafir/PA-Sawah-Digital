import {StyleSheet, Text, View, PermissionsAndroid, Platform, NativeModules, NativeEventEmitter, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import { FlatList } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';


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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    bleCard: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#f9f9f9',
      elevation: 3,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bleText: {
      fontSize: 16,
      fontWeight:'bold',
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: '#17912b',
      borderRadius: 5,
    },
    button1: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: '#ccc',
      borderRadius: 5,
    },
    buttonsurvey: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: '#007BFF',
      borderRadius: 5,
    },
    btnText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    containerMap: {
      height: 350,
      width: 380,
      marginTop: 20,
      marginBottom: 20,
      alignSelf: 'center'
    },
    webView: {
      flex: 1,
    },
});

