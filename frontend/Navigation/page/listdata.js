import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import BASE_URL from '../config/config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../component/loading';
import { useIsFocused } from '@react-navigation/native';

const Listpatok = () => {
  const [dataPatok, setDataPatok] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation(); 
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        console.log("Retrieved user_id from AsyncStorage:", user_id); 
        if (user_id) {
          setUserId(user_id); 
          fetchData(user_id); 
        } else {
          console.error("User ID not found in AsyncStorage");
          setLoading(false); 
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
        setLoading(false); 
      }
    };

     const fetchData = async (userId) => {
      try {
        const response = await fetch(`${BASE_URL}data/panggildata/${userId}`);
        const data = await response.json();

        if (data.success) {
          setDataPatok(data.data); 
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
        fetchData(userId);
      } else {
        fetchUserId();
      }
    }
  }, [isFocused]);

  const handlePeta = () => {
    if (dataPatok.length === 0) {
      Alert.alert('Peta Tidak Tersedia', 'Tidak ada data untuk ditampilkan pada peta.');
      return;
    }
    console.log('data ke peta', dataPatok)
    navigation.navigate('PETA', { dataPatok }); 
  };

  const detailPatok = (item) => {
    navigation.navigate('TITIK LOKASI', { point: item });
  };

  const handleNavigate = () => {
    navigation.navigate('TAMBAH TITIK');
  };

  const handleEdit = (item) => {
    navigation.navigate('EDIT TITIK', { item });
  };

  const handleDelete = async (id_titik) => {
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
              try {
                const response = await fetch(`${BASE_URL}data/hapusdata/${id_titik}`, {
                  method: 'DELETE',
                });
  
                const result = await response.json();
  
                if (result.success) {
                  Alert.alert('Sukses', 'Data berhasil dihapus');
                  // fetchData()
                  setDataPatok((prevData) => prevData.filter(item => item.id_titik !== id_titik));
                } else {
                  Alert.alert('Gagal', 'Gagal menghapus data');
                }
              } catch (error) {
                console.error('Error menghapus data:', error);
                Alert.alert('Error', 'Terjadi kesalahan saat menghapus data');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error saat memproses konfirmasi penghapusan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memproses penghapusan');
    }
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
  
    const jam = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).replace('.', ':');
  
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.cardgeo, dataPatok.length === 0 && styles.cardgeoEmpty]}>
          {dataPatok.length === 0 ? (
            <Text style={styles.noDataText}>Belum ada data titik</Text>
          ) : (
            dataPatok.map((item, index) => (
              <View key={item.id_titik || index} style={styles.card}>
                <TouchableOpacity onPress={() => detailPatok(item)}>
                  <View style={styles.cardContent}>
                    <Text style={styles.label}>Nama Titik: {item.nama_titik}</Text>
                    <Text style={styles.label2}>
                      Dibuat: {formatTanggal(item.created_at)}
                    </Text>
  
                    <Text style={styles.label2}>
                      Diubah: {
                        new Date(item.updated_at).getTime() !== new Date(item.created_at).getTime()
                          ? formatTanggal(item.updated_at)
                          : '-'
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Image source={require('../assets/icons/pencil.png')} style={styles.buttonImage} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id_titik)}>
                    <Image source={require('../assets/icons/delete.png')} style={styles.buttonImage} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={handlePeta} style={styles.fab}>
        <Image source={require('../assets/icons/mapmarker.png')} style={styles.fabIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonsimpan} onPress={handleNavigate}>
        <Text style={styles.btnText}>TAMBAH DATA</Text>
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
  fab: {
    position: 'absolute',
    bottom: 80, // Jarak dari bawah layar
    right: 40, // Jarak dari kanan layar
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#486C3E', // Warna tombol
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Tambahkan bayangan di Android
  },
  fabIcon: {
    width: 30,
    height: 30,
    // tintColor: '#fff', // Warna ikon
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  cardgeo: {
    backgroundColor: '#dddddd',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: 20,
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 14,
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
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold'
  },
  buttonsimpan: {
    backgroundColor: '#486C3E',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: 'auto',
    activeOpacity: 0.8
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2
    // fontFamily: 'Times New Roman',
  },
});

export default Listpatok;
