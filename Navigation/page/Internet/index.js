import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {connectWifiReq} from '../../config/Bluetooth';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

const ConnectNTRIP = ({navigation}) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Redux state to monitor GNSSINFO stream
  const ntripstatus = useSelector(
    state => state.streamData.streams['GNSSINFO'],
  );

  // Function to handle WiFi connection
  const connectWifi = async () => {
    if (!ssid || !password) {
      Alert.alert('Input Error', 'SSID and Password must be filled!');
      return;
    }
    const data = {ssid: ssid, password: password};
    setIsConnecting(true); // Set connecting state
    console.log('Connecting to WiFi with:', data);
    await connectWifiReq(data);
  };

  // Monitor NTRIP status and show alert when status is ON
  useEffect(() => {
    if (ntripstatus) {
      const dataSplit = ntripstatus.split(',');
      console.log('Parsed GNSSINFO Data:', dataSplit);

      // Ensure data length and structure is correct
      if (dataSplit.length > 7) {
        const ntripType = dataSplit[5]?.trim(); // Check NTRIP status
        const ntripConnection = dataSplit[6]?.trim(); // Check ON/OFF status

        if (ntripType === 'NTRIP' && ntripConnection === 'CONNECTED') {
          console.log('Triggering Alert: NTRIP is now connected.');
          setIsConnecting(false); // Reset connection state
          Alert.alert('NTRIP Status', 'NTRIP is now connected.');
        } else {
          console.log('NTRIP not active yet or incorrect data:', {
            ntripType,
            ntripConnection,
          });
        }
      } else {
        console.error('GNSSINFO data format is invalid:', ntripstatus);
      }
    }
  }, [ntripstatus]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Koneksi Wifi</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>SSID</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan SSID"
              placeholderTextColor="#ccc"
              keyboardType="default"
              onChangeText={text => setSsid(text)} 
              value={ssid} 
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Password"
              placeholderTextColor="#ccc"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)} 
              value={password} 
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={connectWifi} disabled={isConnecting}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F2F2F2',
  },
  card: {
    backgroundColor: '#fff',
    height: 600,
    borderRadius: 10,
    padding: 20,
    paddingTop: 1,
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  logo: {
    width: 250,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Alkalami-Regular',
    color: '#D91A1A',
    textAlign: 'center',
    marginBottom: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Alkalami-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color: '#333',
  },
  button: {
    backgroundColor: '#D91A1A',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10, 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Alkalami-Regular',
  },
  loginText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Alkalami-Regular',
  },
  boldText: {
    color: '#D91A1A',
    fontSize: 16,
    fontFamily: 'Alkalami-Regular',
  },
});

export default ConnectNTRIP;