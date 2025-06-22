import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './authcontext';
import SplashScreen from './page/splashscreen';
import MenuScreen from './page/menu';
import Pengguna from './page/profil';
// import KoneksiAlat from './koneksialat';
import KoneksiAlat2 from './koneksi1';
import UnduhHasil from './page/unduhhasil';
import Panduan from './page/panduan';
import Survei from './page/survei';
import PanduanAlat from './page/panduanalat';
import Tentang from './page/tentang';
import Login from './auth/login';
import RegistrationScreen from './auth/registration';
import Listpatok from './page/listdata';
import EditTitik from './page/editdata';
import Titiklokasi from './component/map';
import ConnectNTRIP from './page/Internet/index';
import Peta from './component/peta';
import FormSawah from './page/form';
import FormulirScreen from './page/formscreen';
import UnduhPeta from './page/unduhpeta';
import UnduhData from './page/unduhdata';
import EditForm from './page/editForm';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: '#000',
            backgroundColor: '#99BC85',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 20,
            marginTop: 5,
            letterSpacing: 3,
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LOGIN"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: '#fff',
              borderBottomWidth: 0,
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              // marginTop: 5,
              letterSpacing: 3,
            },
            headerTitle: 'LOGIN',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="REGISTRATION"
          component={RegistrationScreen}
          options={{ 
             headerStyle: {
              backgroundColor: '#fff',
              borderBottomWidth: 0,
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              // marginTop: 5,
              letterSpacing: 3,
            },
            headerTitle: 'REGISTRASI',
            headerTitleAlign: 'center',
           }}
        />
        <Stack.Screen
          name="MENU"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="KONEKSI ALAT" component={KoneksiAlat2} />
        <Stack.Screen name="TAMBAH TITIK" component={Survei} />
        <Stack.Screen name="SURVEI" component={Listpatok} />
        <Stack.Screen name="PANDUAN" component={Panduan} />
        <Stack.Screen name="PANDUAN ALAT" component={PanduanAlat} />
        <Stack.Screen name="TENTANG APLIKASI" component={Tentang} />
        <Stack.Screen name="EDIT TITIK" component={EditTitik} />
        <Stack.Screen name="KONEKSI WIFI" component={ConnectNTRIP} />
        {isLoggedIn && (
          <>
            <Stack.Screen name="PROFIL" component={Pengguna} />
            <Stack.Screen name="TITIK LOKASI" component={Titiklokasi} />
            <Stack.Screen name="PETA" component={Peta} />
            <Stack.Screen name="FORMULIR" component={FormulirScreen} />
            <Stack.Screen name="UNDUH HASIL" component={UnduhHasil} />
            <Stack.Screen name="FORMULIR SAWAH" component={FormSawah} />
            <Stack.Screen name="UNDUH HASIL PETA" component={UnduhPeta} />
            <Stack.Screen name="UNDUH HASIL DATA" component={UnduhData} />
            <Stack.Screen name="EDIT FORM" component={EditForm} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;