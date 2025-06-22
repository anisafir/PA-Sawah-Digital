import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import BASE_URL from '../config/config';

const EditTitik = ({ route, navigation }) => {
  const { item } = route.params;
  const [formData, setFormData] = useState({
    namaTitik: '',
    longitude: '',
    latitude: '',
    tinggiEllipsoid: '',
    akurasi: '',
    zona: '', 
    titikId: '',
    userId: '',
  });

  const [utmCoords, setUtmCoords] = useState({
    utmX: '',
    utmY: '',
    utmZone: '',
    utmLetter: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Data titik yang diterima:', item);
    setFormData({
      namaTitik: item.nama_titik,
      longitude: item.koordinat_bujur,
      latitude: item.koordinat_lintang,
      tinggiEllipsoid: item.tinggi_ellipsoid,
      akurasi: item.akurasi,
      zona: item.zona,
      titikId: item.id_titik,
      userId: item.user_id
    });
    
    setUtmCoords({
        utmX: item.utm_x || '',
        utmY: item.utm_y || '',
        zona: item.zona || '',  
      });
  }, [item]);

  const handleSave = async () => {
    if (!formData.namaTitik) {
      Alert.alert('Validasi', 'Nama titik tidak boleh kosong');
      return;
    }    
  
    const dataToSave = {
      user_id: formData.userId,
      nama_titik: formData.namaTitik,
      id_titik: formData.titikId,
    };
  
    try {
      setIsLoading(true)
      const response = await fetch(`${BASE_URL}data/updateTitik/${formData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
  
      const result = await response.json();
  
      if (result.success) {
        Alert.alert('Informasi', 'Data berhasil disimpan');
        navigation.goBack();
      } else {
        Alert.alert('Informasi', 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Informasi', 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.cardgeo}>
          <Text style={styles.labeltitik}>Nama Titik</Text>
          <TextInput
            style={styles.input}
            placeholder="Isikan nama titik pengukuran"
            placeholderTextColor="#ccc"
            value={formData.namaTitik}
            onChangeText={(text) =>
              setFormData((prevState) => ({ ...prevState, namaTitik: text }))
            }
          />
          <View style={styles.card}>
            <Text style={styles.label}>Bujur: </Text>
            <Text style={styles.label}>
            {formData.longitude 
                ? `${formData.longitude}` 
                : 'Memuat ...'}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Lintang: </Text>
            <Text style={styles.label}>
            {formData.latitude 
                ? `${formData.latitude}` 
                : 'Memuat ...'}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>UTM X: </Text>
            <Text style={styles.label}>{utmCoords.utmX || 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>UTM Y: </Text>
            <Text style={styles.label}>{utmCoords.utmY || 'Memuat ...'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Tinggi Ellipsoid: </Text>
            <Text style={styles.label}>
                {formData.tinggiEllipsoid ? `${formData.tinggiEllipsoid} m` : 'Memuat ...'}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Akurasi: </Text>
            <Text style={styles.label}>
                {formData.akurasi ? `${formData.akurasi} m` : 'Memuat ...'}
            </Text>
          </View>
            <View style={styles.card}>
            <Text style={styles.label}>Zona: </Text>
            <Text style={styles.label}>
            {formData.zona ? `${formData.zona}` : 'Memuat ...'}
            </Text>
            </View>
        </View>
        <TouchableOpacity style={styles.buttonsimpan} onPress={handleSave}>
          {
            isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ): (
              <Text style={styles.btnText}>PERBARUI</Text>
            )
          }
         
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
      backgroundColor: '#f5f5f5',
      marginTop: -5,
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      width: '98%',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card1: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 10,
      width: '98%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardgeo: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      width: '96%',
      justifyContent: 'center',
    },
    cardgeo1: {
      backgroundColor: '#ccc',
      padding: 20,
      borderRadius: 10,
      width: '95%',
      justifyContent: 'center',
    },
    label: {
      fontSize: 14,
      color: '#333',
    },
    label2: {
      fontSize: 14,
      color: '#ccc',
    },
    buttonsimpan: {
      backgroundColor: '#486C3E',
      paddingVertical: 15,
      marginHorizontal: 20,
      marginTop: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: 340,
    },
    btnText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    input: {
      borderColor: '#ccc',
      padding: 10,
      paddingLeft: 15, 
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      width: '98%',
      color: '#000',
    },
    labeltitik: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
    },
    imageUpload: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
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
        backgroundColor: '#fff',
        color: '#000',
      },
    pickerItem: {
      fontSize: 1, 
      color: '#333',
    },
  });

export default EditTitik;
