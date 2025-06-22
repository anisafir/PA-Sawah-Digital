import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CoordinateConverter, conferalt,parseCoordinates} from './Helpers/geo_helpers.js';
import AsyncStorageHelper from './Helpers/asyncLocalStorage.js';
import currentDate from './Helpers/curren_date.js';
import {Provider} from 'react-redux';
import {
  SearchDevice,
  ConnectDevice,
  DisconnectedDevice,
  CheckAvailable,
  showdevicePair,
} from './config/Bluetooth.js';
import {
  View,
  Text,
  Button,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {WebView} from 'react-native-webview';
import LoadingScreen from './component/loading';
import NtripClientReq from './Helpers/NtripClientReq.js';
import MapView, {Marker} from 'react-native-maps';
import {Buffer} from 'buffer';
import TcpSocket from 'react-native-tcp-socket';

const App = ({navigation}) => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bluetoothReady, setbluetoothReady] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState({});
  const [log, setLog] = useState([]);
  const [scanning, setScanning] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [connectionNtrip, setConnectionNtrip] = useState(false);
  const [StatusNtrip, setStatusNtrip] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const scrollRef = useRef(null);
  const streamDataGNGGA = useSelector(
    state => state.streamData.streams['GNGGA'],
  );
  const streamDataGNGST = useSelector(
    state => state.streamData.streams['GNGST'],
  );
  const addLog = message => {
    setLog(prevLog => {
      const updatedLog = [...prevLog, message];

      // Ganti timeout untuk memastikan update state selesai
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollToEnd({animated: true});
        }
      }, 100);

      return updatedLog;
    });
  };
  const addPairedDevice = (newDevice) => {
    setPairedDevices(prevDevices => [...prevDevices, newDevice]);
  };
  useEffect(() => {
    const initializing = async () => {
      const isAvailable = await CheckAvailable();
      if (isAvailable) {
        setbluetoothReady(true);
        const devices = await showdevicePair();
        setPairedDevices(devices);
      }
    };
    initializing();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (streamDataGNGGA && streamDataGNGST) {
        if (connectedDevice == null) {
          const getDevices = await AsyncStorageHelper.getItem('data_device');
          const deviceConnect = JSON.parse(getDevices);
          setConnectedDevice(deviceConnect);
        }
      }
    };
    fetchData();
  }, [streamDataGNGGA, streamDataGNGST, connectedDevice, connectionNtrip]);

  useEffect(() => {
    const parsingLonLat = CoordinateConverter(streamDataGNGGA);
    setLatitude(parsingLonLat.latitude ?? 0);
    setLongitude(parsingLonLat.longitude ?? 0);
    addLog(streamDataGNGGA + '\n');
  }, [streamDataGNGGA]);

  useEffect(() => {
  }, [streamDataGNGGA, connectionNtrip, StatusNtrip]);

  useEffect(() => {
    if (!isMonitoring) {
      setConnectedDevice(null);
      setLatitude(null);
      setLongitude(null);
    }
  }, [isMonitoring]);

  const RequestScan = async () => {
    setbluetoothReady(true);
    try {
      window.alert('start scaan');
      const searchDevices = await SearchDevice();
      if(!searchDevices.error){
        addPairedDevice(searchDevices);
      }
    } catch (error) {
      window.alert('Error during Bluetooth device search: ' + error);
    }
  };

  const Disconnected = async () => {
    try {
      const getDevices = await AsyncStorageHelper.getItem('data_device');
      if (getDevices) {
        const reqDisconect = await DisconnectedDevice(dispatch);
        setLatitude(null);
        setLongitude(null);
        setConnectedDevice(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWifi = async () => {
    navigation.navigate('KONEKSI WIFI');
  }
  

  const ReqConnect = async data => {
    const responseData = await ConnectDevice(data, dispatch);
  };

  return (
    <View
      style={styles.container}
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled={true}>
      {bluetoothReady ? (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: 200}}>
              <Button
                title={scanning ? 'Sedang Memindai...' : 'Hubungkan ke Alat'}
                onPress={RequestScan}
              />
            </View>
            <View style={{width: 150}}>
              {connectedDevice && (
                <Button title="Putuskan" onPress={Disconnected} />
              )}
            </View>
          </View>
          <Text style={{marginVertical: 20, fontWeight: 'bold'}}>
            Alat yang terdeteksi:
          </Text>

          <View style={styles.card}>
            {pairedDevices ? (
              pairedDevices.length > 0 ? (
                <FlatList
                  data={pairedDevices}
                  keyExtractor={item => item.id}
                  nestedScrollEnabled={true}
                  renderItem={({item}) => (
                    <SafeAreaView style={{marginVertical: 1}}>
                      <Text>{item.name || item.id}</Text>
                      <Button
                        title="Hubungkan"
                        onPress={() => ReqConnect(item)}
                        color={
                          connectedDevice &&
                          connectedDevice.address === item.address
                            ? '#FF0000'
                            : ''
                        }
                      />
                    </SafeAreaView>
                  )}
                />
              ) : (
                <Text>No paired devices available</Text>
              )
            ) : (
              <Text>Loading paired devices...</Text>
            )}
          </View>

          <View style={{width: '100%'}}>
            {connectedDevice && ( <Button title="Hubungkan Wifi" onPress={connectWifi} color="#00008B" />)}
          </View>
          <View style={styles.gpsContainer}>
            <Text style={styles.gpsText}>
              Latitude: {latitude !== null ? latitude : 'Memuat...'}
            </Text>
            <Text style={styles.gpsText}>
              Longitude: {longitude !== null ? longitude : 'Memuat...'}
            </Text>
          </View>

          <View style={styles.containerMap}>
            <WebView
              source={{ uri: 'https://anisafir.github.io/WebView-SawahDigital/peta.html' }}
              style={styles.webView}
            />
          </View>
        </View>
      ) : (
        <LoadingScreen />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  card: {
    padding: 10,
    height: 200,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  containerMap: {
    height: "50%",
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  webView: {
    flex: 1,
  },
  logScroll: {
    flex: 1,
  },
  buttonsurvey: {
    paddingHorizontal: 1,
    margin: 1,
    backgroundColor: '#D91A1A',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Alkalami-Regular',
    textAlign: 'center',
  },
});
