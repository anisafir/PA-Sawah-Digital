import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ScrollView} from 'react-native-gesture-handler';
import BASE_URL from '../config/config';
import LoadingScreen from '../component/loading';
import { useAuth } from '../authcontext';

const {width} = Dimensions.get('window');

const Pengguna = ({navigation}) => {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        const response = await fetch(`${BASE_URL}user/${userId}`);
        const data = await response.json();
        setProfil(data[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

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

  // Function to render info item
  const renderInfoItem = (label, value, icon) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Image source={icon} style={styles.infoIcon} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '-'}</Text>
      </View>
    </View>
  );

  // Get first letter of name for the avatar placeholder
  const getInitials = () => {
    if (profil && profil.nama) {
      return profil.nama.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.contentWrapper}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profil && profil.foto_profil ? (
              <Image source={{uri: profil.foto_profil}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{profil?.nama || 'Pengguna'}</Text>
          <Text style={styles.userRole}>
            {profil?.jabatan || profil?.instansi || 'Pengguna Aplikasi'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Informasi Pengguna</Text>

          {renderInfoItem(
            'Nama Lengkap',
            profil?.nama,
            require('../assets/icons/user1.png'),
          )}

          {renderInfoItem(
            'Email',
            profil?.email,
            require('../assets/icons/mail1.png'),
          )}

          {renderInfoItem(
            'Nomor Telepon',
            profil?.no_telp,
            require('../assets/icons/telephone.png'),
          )}

          {renderInfoItem(
            'Instansi',
            profil?.instansi,
            require('../assets/icons/building.png'),
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  scrollContainer: {
  paddingBottom: 30,
},
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20, 

  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 30,
    paddingBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#486C3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#486C3E',
    marginVertical: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#486C3E',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#486C3E',
    marginBottom: 5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F5FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    width: 20,
    height: 20,
    tintColor: '#486C3E',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    marginHorizontal: 15,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Pengguna;
