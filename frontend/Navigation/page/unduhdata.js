import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/config';
import LoadingScreen from '../component/loading';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

const UnduhData = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [dataTitik, setDataTitik] = useState([]); 
  const [downloadingId, setDownloadingId] = useState(null);


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

    fetchUserId()
  }, []);

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

  const convertToCSV = (obj) => {
    const headers = Object.keys(obj).join(',');
    const values = Object.values(obj).map(val => {
      // Handle values that may contain commas, quotes, or newlines
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
    return `${headers}\n${values}`;
  };

  const checkAndRequestPermissions = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    if (Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Izin Akses Penyimpanan',
            message: 'Aplikasi membutuhkan akses untuk menyimpan file CSV.',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'Izinkan',
          },
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
          return true;
        } else {
          console.log('Storage permission denied');
          Alert.alert(
            'Izin Ditolak',
            'Untuk mengunduh file, aplikasi membutuhkan izin akses penyimpanan. Silakan aktifkan izin di pengaturan aplikasi.',
            [{ text: 'OK' }]
          );
          return false;
        }
      } catch (err) {
        console.error('Error requesting storage permission:', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const handleDownload = async (item) => {
    setDownloadingId(item.id_titik);
    try {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        return;
      }

      const csvData = convertToCSV(item);
      const fileName = `${item.nama_titik.replace(/\s+/g, '_')}_${Date.now()}.csv`;
      
      let path;
      
      if (Platform.OS === 'android') {
        if (Platform.Version >= 30) { // Android 11+
          // Use scoped storage (app-specific directory)
          path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        } else {
          // Use external storage for older Android versions
          path = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
        }
      } else {
        // For iOS
        path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      }
      
      await RNFS.writeFile(path, csvData, 'utf8');
      
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
      
      console.log(`File saved successfully to: ${path}`);
    } catch (err) {
      console.error('Error saving file:', err);
      Alert.alert(
        'Gagal Mengunduh',
        `Tidak dapat menyimpan file: ${err.message || 'Kesalahan tidak diketahui'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setDownloadingId(null); 
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.cardContainer, dataTitik.length === 0 && styles.centerEmpty]}>
          {dataTitik.length === 0 ? (
            <Text style={styles.noDataText}>Belum ada data titik</Text>
          ) : (
            dataTitik.map((item, index) => (
              <View key={item.id_titik || index} style={styles.card}>
                <View style={styles.row}>
                <View style={styles.infoContainer}>
                <Text style={styles.title}>📍 {item.nama_titik}</Text>
                <Text style={styles.metaText}>
                  Dibuat: {formatTanggal(item.created_at)}
                </Text>
                <Text style={styles.metaText}>
                  Diubah: {
                    new Date(item.updated_at).getTime() !== new Date(item.created_at).getTime()
                      ? formatTanggal(item.updated_at)
                      : '-'
                  }
                </Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(item)}
                  disabled={downloadingId === item.id_titik}
                >
                  {downloadingId === item.id_titik ? (
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
    shadowOffset: { width: 0, height: 2 },
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

export default UnduhData;
