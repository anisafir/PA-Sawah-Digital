import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/config';
import LoadingScreen from '../component/loading';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

const UnduhPeta = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataTitik, setDataTitik] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

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
        const response = await fetch(`${BASE_URL}form/panggilform/${userId}`);
        const data = await response.json();

        if (data.success) {
          setDataTitik(data.data);
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

    fetchUserId();
  }, []);

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

  const downloadPDF = async (id) => {
    if (!id) {
      Alert.alert('Error', 'Form ID tidak ditemukan.');
      return;
    }

    setDownloadingId(id);
    try {
      const response = await fetch(`${BASE_URL}form/downloadpdf/${id}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengunduh PDF');
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
  
      let fileName = `pemetaan_sawah${id}.pdf`;
      let filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      let fileExists = await RNFS.exists(filePath);
      let count = 1;
  
      while (fileExists) {
        fileName = `pemetaan_sawah${id}(${count}).pdf`;
        filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        fileExists = await RNFS.exists(filePath);
        count++;
      }
  
      await RNFS.writeFile(filePath, base64Data, 'base64');
  
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          `File disimpan di Download/${fileName}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      } else {
        Alert.alert('Sukses', `File disimpan: ${fileName}`);
      }
    } catch (error) {
      console.error('Error saat mengunduh PDF:', error);
      Alert.alert('Peringatan', 'Gagal mengunduh PDF. Pastikan data sudah diisi.');
    } finally {
      setDownloadingId(null)
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.cardContainer,
            dataTitik.length === 0 && styles.centerEmpty,
          ]}>
          {dataTitik.length === 0 ? (
            <Text style={styles.noDataText}>Belum ada data titik</Text>
          ) : (
            dataTitik.map((item, index) => (
              <View key={item.id || index} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.title}>Pemilik: {item.nama_pemilik}</Text>
                    <Text style={styles.metaText}>
                      Dibuat: {formatTanggal(item.created_at)}
                    </Text>
                    <Text style={styles.metaText}>
                      Diubah:{' '}
                      {new Date(item.updated_at).getTime() !==
                      new Date(item.created_at).getTime()
                        ? formatTanggal(item.updated_at)
                        : '-'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadPDF(item.id)}
                    disabled={downloadingId === item.id}>
                    {downloadingId === item.id ? (
                      <ActivityIndicator size="small" color="#333" />
                    ) : (
                      <Text style={styles.downloadText}>⬇ Unduh Data</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  scrollContent: {
    padding: 20,
  },
  cardContainer: {
    flexGrow: 1,
    gap: 12,
  },
  centerEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  metaText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  downloadButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  downloadText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default UnduhPeta;
