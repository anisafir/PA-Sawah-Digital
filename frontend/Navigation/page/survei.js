import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  SearchDevice,
  ConnectDevice,
  DisconnectedDevice,
  CheckAvailable,
  showdevicePair,
} from '../config/Bluetooth.js';
import * as utm from 'utm';
import { CoordinateConverter, conferalt, NmeaParser } from '../Helpers/geo_helpers.js';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/config.js';
import AsyncStorageHelper from '../Helpers/asyncLocalStorage.js';

const Survei = () => {
  const [utmCoords, setUtmCoords] = useState({ utmX: null, utmY: null });
  const [isConverted, setIsConverted] = useState(false);

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [longitudeDMS, setLongitudeDMS] = useState('');
  const [latitudeDMS, setLatitudeDMS] = useState('');
  const [statusRtk, setStatusRtk] = useState('')

  const [tinggiEllipsoid, setTinggiEllipsoid] = useState(0);
  const [zonaUTM, setZonaUTM] = useState('');
  const [userId, setUserId] = useState(null);

  const streamDataGNGGA = useSelector(
    state => state.streamData.streams['GNGGA'],
  );
  const streamDataGNGST = useSelector(
    state => state.streamData.streams['GNGST'],
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        console.log("Retrieved user_id from AsyncStorage:", userId);

        if (userId) {
          setUserId(userId);
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const nmeaParser = async () => {
      if (streamDataGNGGA && streamDataGNGST) {
        const responseData = await NmeaParser(streamDataGNGGA, streamDataGNGST);
        // console.log('Parsed GNGGA Data with accuracy:', responseData);
        if (responseData && !responseData.error) {
          setAccuracy(responseData.accuracy || 0);

        }
      } else if (streamDataGNGGA) {
        const responseData = await NmeaParser(streamDataGNGGA);
        // console.log('Parsed GNGGA Data without accuracy:', responseData);
      }
    };
    const parsingLongLat = async () => {
      if (streamDataGNGGA) {
        const response2 = await CoordinateConverter(streamDataGNGGA);
        if (response2.error == null) {
          setLongitude(response2.longitude);
          setLatitude(response2.latitude);
        }
      }
    };

    nmeaParser();
    parsingLongLat();
  }, [streamDataGNGGA, streamDataGNGST]);


  useEffect(() => {
    if (streamDataGNGGA) {
      try {
        const dataSplit = streamDataGNGGA.split(',');
        switch (dataSplit[6]) {
          case '0':
            setStatusRtk("Single");
            break;
          case '1':
            setStatusRtk("3D Fix");
            break;
          case '2':
            setStatusRtk("DGPS");
            break;
          case '3':
            setStatusRtk("DGPS / RTK Fix");
            break;
          case '4':
            setStatusRtk("Fixed");
            break;
          case '5':
            setStatusRtk("Float");
            break;
          case '6':
            setStatusRtk("Single");
            break;
          case '7':
            setStatusRtk("Single");
            break;
          case '8':
            setStatusRtk("Simulation");
            break;
          default:
            setStatusRtk("Unknown");
        }
      } catch (error) {
        console.error('Error processing GNGGA status:', error);
        setStatusRtk("Error");
      }
    }
  }, [streamDataGNGGA]);

  const [formData, setFormData] = useState({namaTitik: '', });

  const handleGetCoordinates = async () => {
    if (streamDataGNGGA) {
      const responseData = await NmeaParser(streamDataGNGGA, streamDataGNGST);
      console.log('Parsed NMEA Data:', responseData);
      
      if (responseData && !responseData.error) {
        setLongitudeDMS(responseData.longitudeDMS);
        setLatitudeDMS(responseData.latitudeDMS);
        setTinggiEllipsoid(responseData.elevation);
        setUtmCoords({
          utmX: responseData.utmX.toFixed(2),
          utmY: responseData.utmY.toFixed(2),
        });
        setZonaUTM(responseData.utmZone);
        
        if (responseData.accuracy !== null && responseData.accuracy !== undefined) {
          setAccuracy(responseData.accuracy);
        }
      }

      const response2 = await CoordinateConverter(streamDataGNGGA);
      if (response2.error == null) {
        setLongitude(response2.longitude);
        setLatitude(response2.latitude);
      }
    } else {
      Alert.alert('Perhatian', 'Data NMEA tidak tersedia. Pastikan perangkat terhubung dan mengirimkan data.');
    }
  };

  const getLongitudeDirection = longitude => (longitude >= 0 ? 'BT' : 'BB');
  const getLatitudeDirection = latitude => (latitude >= 0 ? 'LU' : 'LS');

  const handleSave = async () => {
    if (!formData.namaTitik ||  utmCoords.utmX === null ||  utmCoords.utmY === null || !longitudeDMS || !latitudeDMS || tinggiEllipsoid === null || !zonaUTM || !userId) {
      Alert.alert('Perhatian', 'Pastikan semua data sudah lengkap sebelum menyimpan.');
      return;
    }

    const dataToSave = {
      latitude: latitudeDMS,
      longitude: longitudeDMS,
      namaTitik: formData.namaTitik,
      utmX: utmCoords.utmX,
      utmY: utmCoords.utmY,
      user_id: userId,
      tinggiEllipsoid: tinggiEllipsoid,
      zona: zonaUTM,
      akurasi: accuracy
    };

    console.log("Data JSON untuk dikirim:", JSON.stringify(dataToSave));

    fetch(`${BASE_URL}data/tambahdata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Server response:', result);
        if (result.success) {
          Alert.alert('Informasi', 'Data berhasil disimpan');
        } else {
          console.log('Save failed:', result.message);
          Alert.alert('Informasi', 'Gagal menyimpan data');
        }
      })
      .catch(error => {
        console.error('Error saving data:', error);
        Alert.alert('Informasi', 'Terjadi kesalahan saat menyimpan data');
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.cardgeo}>
          <View style={styles.card1}>
            <View style={styles.row}>
              <Text style={styles.label2}>Longitude: </Text>
              <Text style={styles.value}>{longitude}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label2}>Latitude: </Text>
              <Text style={styles.value}>{latitude}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label2}>Akurasi(m): </Text>
              <Text style={styles.value}>{accuracy}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label2}>Solution: </Text>
              <Text style={styles.value}>{statusRtk ?? ''}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonkonversi}
          onPress={handleGetCoordinates}>
          <Text style={styles.btnText}>DAPATKAN KOORDINAT</Text>
        </TouchableOpacity>

        <View style={styles.cardgeo}>
          <Text style={styles.labeltitik}>Nama Titik</Text>
          <TextInput
            style={styles.input}
            placeholder="Isikan nama titik pengukuran"
            value={formData.namaTitik}
            onChangeText={text =>
              setFormData(prevState => ({ ...prevState, namaTitik: text }))
            }
          />
          <View style={styles.card}>
            <Text style={styles.label}>Bujur: </Text>
            <Text style={styles.label}>
              {longitudeDMS
                ? `${longitudeDMS} ${getLongitudeDirection(longitude)}`
                : 'Memuat ...'}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Lintang: </Text>
            <Text style={styles.label}>
              {latitudeDMS
                ? `${latitudeDMS} ${getLatitudeDirection(latitude)}`
                : 'Memuat ...'}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>UTM X: </Text>
            <Text style={styles.label}>{utmCoords.utmX ? utmCoords.utmX : 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>UTM Y: </Text>
            <Text style={styles.label}>{utmCoords.utmY ? utmCoords.utmY : 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Tinggi Ellipsoid: </Text>
            <Text style={styles.label}>{tinggiEllipsoid ? `${tinggiEllipsoid} m` : 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Akurasi: </Text>
            <Text style={styles.label}>{accuracy ? `${accuracy} m` : 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Zona: </Text>
            <Text style={styles.label}>{zonaUTM ? zonaUTM : 'Memuat ...'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonsimpan} onPress={handleSave}>
          <Text style={styles.btnText1}>SIMPAN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 340
  },
  card1: {
    backgroundColor: '#486C3E',
    padding: 10,
    borderRadius: 5,
    width: 340,
    // height: 200, // <-- ini penting biar bisa vertical align
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardgeo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 360,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardgeo1: {
    backgroundColor: '',
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  label2: {
    flex: 1,
    fontSize: 15,
    color: '#ffff',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    textAlign: 'right',
  },
  buttonkonversi: {
    backgroundColor: '#486C3E',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    width: 360,
    alignItems: 'center',
    paddingVertical: 10
  },
  buttonsimpan: {
    backgroundColor: '#486C3E',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: 360,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    // fontFamily: 'Times New Roman',
    letterSpacing: 2,
    // justifyContent: 'center'
  },
  btnText1: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2
    // fontFamily: 'Times New Roman',
  },
  input: {
    borderColor: '#ccc',
    padding: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    width: 340
  },
  labeltitik: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
    // paddingHorizontal: 10,
    alignSelf: 'flex-start', // <-- ini override alignItems parent
    width: '100%',           // pastikan dia lebar penuh
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    width: 340
  },
  imageIcon: {
    width: 50,
    height: 50,
  },
  imagePreview: {
    width: 75,
    height: 100,
  },
  labelFoto: {
    fontSize: 15,
    margin: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 1, // Sesuaikan ukuran label item
    color: '#333', // Warna teks
  },
});

export default Survei;