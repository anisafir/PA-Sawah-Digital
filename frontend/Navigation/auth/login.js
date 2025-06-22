import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomAlert from '../component/customalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../authcontext';
import BASE_URL from '../config/config';
import LoadingScreen from '../component/loading';

const LoginScreen = ({navigation}) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Harap isi semua kolom.');
      return;
    }
    setIsLoading(true);
    const userData = {email, password};

    try {
      const response = await fetch(`${BASE_URL}user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.user_id !== undefined) {
        await AsyncStorage.setItem('user_id', data.user_id.toString());
        login();
        navigation.reset({
          index: 0,
          routes: [{name: 'MENU'}],
        });
      } else {
        // Handle various error responses
        let errorMessage = data.message;
        if (response.status === 404 && data.message === 'User not found') {
          errorMessage = 'Pengguna tidak ditemukan. Harap periksa email Anda.';
        } else if (
          response.status === 400 &&
          data.message === 'Invalid credentials'
        ) {
          errorMessage = 'Kredensial tidak valid. Harap periksa password Anda.';
        }
        showAlert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      showAlert('Error', 'Something went wrong. Please try again.');
    } finally {
      // Always set loading state to false after request
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <View>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/images/icon5.png')}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.title}>Login</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan Email"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan Password"
                  placeholderTextColor="#ccc"
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <CustomAlert
          visible={alertVisible} // <-- Passed as prop to CustomAlert
          title={alertTitle}
          message={alertMessage}
          onClose={closeAlert} // Handle modal close
        />
        <View style={isLoading ? {display: 'none'} : styles.loginLink}>
          <Text style={styles.loginText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('REGISTRATION')}>
            <Text style={styles.boldText}>Registrasi</Text>
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
    height: 580,
    borderRadius: 10,
    padding: 20,
    paddingTop: 1,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    marginTop: 50,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Alkalami-Regular',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333333',
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    textShadowColor: 'rgba(39, 39, 39, 0.3)', // Warna bayangan dengan transparansi
    textShadowOffset: {width: 2, height: 2}, // Posisi bayangan (X, Y)
    textShadowRadius: 4, // Menambah efek blur pada bayangan
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7C7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    color: '#7A7878',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#486C3E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginLink: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Add some space above the link
  },
  loginText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
  boldText: {
    color: '#007BFF',
    fontSize: 16,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
