import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/config';
import {useIsFocused} from '@react-navigation/native';
import LoadingScreen from '../component/loading';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 0,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardgeo: {
    backgroundColor: '#dddddd',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '95%'
  },
  cardgeoEmpty: {
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    color: '#000',
    marginBottom: 3,
  },
  label2: {
    fontSize: 10,
    color: '#333',
    marginBottom: 2,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    bottom: 15,
    width: '90%',
    backgroundColor: '#486C3E',
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    alignSelf: 'center'
  },
});

export default FormScreen;
