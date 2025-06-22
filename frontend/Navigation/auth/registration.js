import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  Platform,
} from 'react-native';
import CustomAlert from '../component/customalert';
import BASE_URL from '../config/config';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Alkalami-Regular',
    color: '#000000',
    marginTop: -10,
    marginVertical: 20,
    // textDecorationLine: 'underline',
    // textDecorationColor: '#000000',
    // textDecorationStyle: 'solid',
    letterSpacing: 2,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: -20
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333333',
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    textShadowColor: 'rgba(39, 39, 39, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
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
  },
  loginText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Times New Roman',
    marginBottom: 20,
  },
  boldText: {
    color: '#007BFF',
    fontSize: 16,
    fontFamily: 'Times New Roman',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
