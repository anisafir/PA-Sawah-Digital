import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventType
} from 'react-native-bluetooth-classic';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog(prevLog => [...prevLog, message]);
  };

  useEffect(() => {
    const initBluetooth = async () => {
        console.log('Initializing Bluetooth...');
        addLog('Initializing Bluetooth...');
        try {
          const available = await RNBluetoothClassic.isBluetoothAvailable();
          addLog(`Bluetooth availability: ${available}`);
          console.log('Bluetooth availability:', available);
          setBluetoothAvailable(available);
    
          if (available) {
            let enabled = await RNBluetoothClassic.isBluetoothEnabled();
            console.log('Bluetooth enabled status:', enabled);
            addLog(`Bluetooth enabled status: ${enabled}`);
    
            if (!enabled) {
              enabled = await RNBluetoothClassic.requestBluetoothEnabled();
              console.log('Bluetooth enabled by request:', enabled);
              addLog(`Bluetooth enabled by request: ${enabled}`);
            }
    
            if (enabled) {
              await fetchPairedDevices();
              await fetchConnectedDevices();
            } else {
              Alert.alert(
                'Bluetooth is not enabled',
                'Please enable Bluetooth to use this app.',
              );
            }
          } else {
            Alert.alert(
              'Bluetooth is not available',
              'This device does not support Bluetooth.',
            );
          }
        } catch (err) {
          console.error('Error during Bluetooth initialization:', err);
        }
      };

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const isGranted = Object.values(granted).every(
            result => result === PermissionsAndroid.RESULTS.GRANTED,
          );

          if (isGranted) {
            console.log('All required permissions granted');
            addLog('All required permissions granted');
          } else {
            Alert.alert(
              'Permissions required',
              'Please grant all permissions in settings to use Bluetooth.',
            );
          }
        } catch (err) {
          console.error('Error requesting permissions:', err);
        }
      }
    };

    initBluetooth();
    requestPermissions();

    
  }, []);

  const fetchPairedDevices = async () => {
    console.log('Fetching paired devices...');
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      const simplifiedPairedDevices = paired.map(device => ({
        id: device.id,
        name: device.name,
      }));
      console.log('Paired devices:', simplifiedPairedDevices);
      setPairedDevices(simplifiedPairedDevices);
    } catch (err) {
      console.error('Error fetching paired devices:', err);
    }
  };

  const fetchConnectedDevices = async () => {
    console.log('Fetching connected devices...');
    try {
      const connected = await RNBluetoothClassic.getConnectedDevices();
      connected.forEach(device => {
        console.log('Device info:', JSON.stringify(device, null, 2));
    });
      setConnectedDevices(connected);
    } catch (err) {
      console.error('Error fetching connected devices:', err);
    }
  };

  const connectToDevice = async device => {
    console.log('Attempting to connect to device:', device.name || device.id);
    try {
      const connected = await RNBluetoothClassic.connectToDevice(device.id);
      if (connected) {
        console.log(
          'Successfully connected to device:',
          device.name || device.id,
        );
        
        setConnectedDevice(device);
        Alert.alert(
          'Connection successful',
          `Connected to ${device.name || device.id}`,
        );
      } else {
        console.warn('Connection to device failed:', device.name || device.id);
        Alert.alert(
          'Connection failed',
          'Could not connect to the device. Please try again.',
        );
      }
    } catch (error) {
      console.error('Failed to connect to device:', error);
      Alert.alert(
        'Connection error',
        'An error occurred while trying to connect to the device.',
      );
    }
  };

  const scanForDevices = async () => {
    if (!bluetoothAvailable) {
      console.log('Bluetooth is not available');
      Alert.alert(
        'Bluetooth is not available',
        'Please check Bluetooth settings.',
      );
      return;
    }

    console.log('Starting device scan...');
    try {
      setScanning(true);
      setDevices([]); // Clear previous devices
      await RNBluetoothClassic.startDiscovery();
      console.log('Device scan started...');
    } catch (error) {
      console.error('Error during device scanning:', error);
    } finally {
      // Stop discovery after a timeout (e.g., 10 seconds)
      setTimeout(async () => {
        console.log('Stopping device scan...');
        await RNBluetoothClassic.cancelDiscovery();
        setScanning(false);
      }, 10000);
    }
  };

  // const readData = () => {
  //   if (!connectedDevice) {
  //     console.log("No connected device");
  //     addLog("No connected device");
  //     return;
  //   }
  
  //   const subscription = connectedDevice.onDataReceived(data => {
  //     console.log("Received data:", data);
  //     parseNMEAData(data.data);
  //   });
  
  //   // Optionally: Unsubscribe when the component is unmounted
  //   return () => subscription.remove();
  // };
  
  const parseNMEAData = (data) => {
    console.log("Parsing NMEA data:", data); // Log data NMEA sebelum diproses
    const gpgga = data.split('\n').find(line => line.startsWith('$GPGGA'));
    if (gpgga) {
      console.log("GPGGA line found:", gpgga); // Log baris yang cocok dengan GPGGA
      const parts = gpgga.split(',');
      const latitude = parseLatitude(parts[2], parts[3]);
      const longitude = parseLongitude(parts[4], parts[5]);
      setCoordinates({ latitude, longitude });
      console.log("Parsed coordinates:", { latitude, longitude }); // Log koordinat hasil parsing
      addLog(`Parsed coordinates: Latitude = ${latitude}, Longitude = ${longitude}`);
    } else {
      console.log("GPGGA line not found in data");
      addLog("GPGGA line not found in data");
    }
  };

  const parseLatitude = (value, direction) => {
    const degrees = parseFloat(value.slice(0, 2));
    const minutes = parseFloat(value.slice(2)) / 60;
    const latitude = degrees + minutes;
    return direction === 'S' ? -latitude : latitude;
  };

  const parseLongitude = (value, direction) => {
    const degrees = parseFloat(value.slice(0, 3));
    const minutes = parseFloat(value.slice(3)) / 60;
    const longitude = degrees + minutes;
    return direction === 'W' ? -longitude : longitude;
  };

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
      <Button
        title={scanning ? 'Scanning...' : 'Scan for Devices'}
        onPress={scanForDevices}
      />
      <Text style={{marginVertical: 20}}>Paired Devices:</Text>
      <FlatList
        data={pairedDevices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{marginVertical: 10}}>
            <Text>{item.name || item.id}</Text>
            <Button title="Connect" onPress={() => connectToDevice(item)} />
          </View>
        )}
      />

      <Text style={{marginVertical: 20}}>Coordinates:</Text>
      <Text>Latitude: {coordinates.latitude}</Text>
      <Text>Longitude: {coordinates.longitude}</Text>

      <Button title="Read Coordinates" />

      <ScrollView style={{marginTop: 20, borderTopWidth: 1, paddingTop: 10}}>
        <Text style={{fontWeight: 'bold'}}>Terminal Output:</Text>
        {log.map((entry, index) => (
          <Text key={index} style={{fontSize: 12, color: 'grey'}}>
            {entry}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
