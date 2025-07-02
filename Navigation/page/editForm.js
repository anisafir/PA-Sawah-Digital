import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from '../component/customalert';
import {Picker} from '@react-native-picker/picker';
import BASE_URL from '../config/config';
import {RadioButton} from 'react-native-paper';
import styles from '../component/formStyle';
import { handleImagePick, renderImage, handleSearch, formatDate, resetForm, handleInputChange,
  handleDateChange,
  handleAddKoordinat,
  handleRemoveKoordinat,
  handleKoordinatChange,
  handleAddPelaksana,
  handleRemovePelaksana,
  handlePelaksanaChange,
  uploadToCloudinary
 } from '../component/formHelpers';
import FormInput from '../component/formInput';
import LoadingScreen from '../component/loading';

const EditForm = ({route, navigation}) => {
  const {item} = route.params;

  // Form data state
  const [formData, setFormData] = useState({
    namaPemilik: '',
    informasiWilayah: '',
    luasLahan: '',
    jenisTanaman: '',
    masaPanen: '',
    sumberAir: 'Sungai', // Default value
    jarakDariSumberAir: '',
    metodePengairan: 'Irigasi Genangan', // Default value
    dokumentasiUtara: null,
    dokumentasiSelatan: null,
    dokumentasiBarat: null,
    dokumentasiTimur: null,
    titikKoordinat: [''],
    pelaksanaSurvei: [''],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [villages, setVillages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [ketersediaanAir, setKetersediaanAir] = useState('Tercukupi');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [dataPatok, setDataPatok] = useState([]);
  const [isLoading, setisLoading] = useState (true)

  useEffect(() => {
    const fecthAllData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        if (!user_id) throw new Error('User ID not found');
        setUserId(user_id);

        const response = await fetch(`${BASE_URL}data/panggildata/${user_id}`);
        const data = await response.json();

        if (data.success) {
            setDataPatok(data.data);

            setTimeout(() => {
              populateFormData();
            }, 300);
        } else {
            showAlert('Error', data.message || 'Gagal mengambil data titik koordinat');
          }
        } catch (error) {
          console.error('Error:', error);
          showAlert('Error', 'Terjadi kesalahan mengambil data');
        } finally {
          setisLoading(false);
        }
      };
    
      fecthAllData();
    }, []);

  const populateFormData = () => {
    console.log("Populating form data with:", item);

    let koordinatArray = [];
    if (item.titik_koordinat_id) {
      if (typeof item.titik_koordinat_id === 'string') {
        try {
          const parsed = JSON.parse(item.titik_koordinat_id);
          koordinatArray = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
        } catch (e) {
          koordinatArray = [String(item.titik_koordinat_id)];
        }
      } else if (Array.isArray(item.titik_koordinat_id)) {
        koordinatArray = item.titik_koordinat_id.map(String);
      } else {
        koordinatArray = [String(item.titik_koordinat_id)];
      }
    }

    setFormData({
      namaPemilik: item.nama_pemilik || '',
      luasLahan: item.luas_lahan || '',
      jenisTanaman: item.jenis_tanaman || '',
      masaPanen: item.masa_panen || '',
      sumberAir: item.sumber_air || 'Sungai',
      jarakDariSumberAir: item.jarak_sumber_air || '',
      metodePengairan: item.metode_pengairan || 'Irigasi Genangan',
      dokumentasiUtara: item.dokumentasi_utara || null,
      dokumentasiSelatan: item.dokumentasi_selatan || null,
      dokumentasiBarat: item.dokumentasi_barat || null,
      dokumentasiTimur: item.dokumentasi_timur || null,
      titikKoordinat: koordinatArray,
      pelaksanaSurvei: item.pelaksana_survei ? 
        Array.isArray(item.pelaksana_survei) ? 
          item.pelaksana_survei : 
          [item.pelaksana_survei] : 
        [''],
    });

    // Set other state variables
    setSelectedVillage(item.desa || '');
    setSelectedDistrict(item.kecamatan || '');
    setSelectedCity(item.kab_kota || '');
    setSelectedProvince(item.provinsi || '');
    setKetersediaanAir(item.ketersediaan_air || 'Tercukupi');
    setWaktuPelaksanaan(item.waktu_pelaksanaan ? new Date(item.waktu_pelaksanaan) : new Date());
    setSearchQuery(item.desa || '');
  };

  // Village selection handler
  const handleSelectVillage = (item) => {
    setSelectedVillage(item.value);
    setSelectedDistrict(item.district);
    setSelectedCity(item.city);
    setSelectedProvince(item.province);
    setSearchQuery(item.label);
    setShowDropdown(false);
    
    handleInputChange(setFormData, 'informasiWilayah', {
      desa: item.value,
      kecamatan: item.district,
      kabupaten: item.city,
      provinsi: item.province,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectVillage(item)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const dokumentasiList = [
    { key: 'dokumentasiUtara', label: 'Dokumentasi Arah Utara' },
    { key: 'dokumentasiSelatan', label: 'Dokumentasi Arah Selatan' },
    { key: 'dokumentasiBarat', label: 'Dokumentasi Arah Barat' },
    { key: 'dokumentasiTimur', label: 'Dokumentasi Arah Timur' },
  ];

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleSubmit = async () => {
    const requiredFields = ['namaPemilik', 'luasLahan', 'jenisTanaman'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      showAlert('Error', 'Mohon lengkapi semua data yang diperlukan');
      return;
    }
  
    setLoading(true);
    try {
      const imageKeys = ['dokumentasiUtara', 'dokumentasiTimur', 'dokumentasiSelatan', 'dokumentasiBarat'];
      const uploadedImages = {};
      const publicIdArray = [];
  
      for (const key of imageKeys) {  
        const uri = formData[key];
        if (uri && !uri.startsWith('http')) {
          const cloudinaryUrl = await uploadToCloudinary(uri);
          if (!cloudinaryUrl) {
            showAlert('Error', `Gagal upload gambar ${key}`);
            setLoading(false);
            return;
          }

          const snakeKey = key.replace('dokumentasi', 'dokumentasi_').toLowerCase();
          uploadedImages[snakeKey] = cloudinaryUrl.url;
          publicIdArray.push(cloudinaryUrl.public_id);
        } else if (uri) {
          const snakeKey = key.replace('dokumentasi', 'dokumentasi_').toLowerCase();
          uploadedImages[snakeKey] = uri;
        }
      }
  
      const dataToSubmit = {
        nama_pemilik: formData.namaPemilik,
        waktu_pelaksanaan: waktuPelaksanaan.toISOString(),
        desa: selectedVillage,
        kecamatan: selectedDistrict,
        kab_kota: selectedCity,
        provinsi: selectedProvince,
        luas_lahan: formData.luasLahan,
        jenis_tanaman: formData.jenisTanaman,
        masa_panen: formData.masaPanen,
        sumber_air: formData.sumberAir,
        jarak_sumber_air: formData.jarakDariSumberAir,
        ketersediaan_air: ketersediaanAir,
        metode_pengairan: formData.metodePengairan,
        titik_koordinat_id: formData.titikKoordinat,
        pelaksana_survei: formData.pelaksanaSurvei,
        user_id: userId,
        cloudinary_ids: publicIdArray,
        ...uploadedImages,
      };
  
      const response = await fetch(`${BASE_URL}form/updateForm/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
  
      const responseText = await response.text();
      const result = JSON.parse(responseText);
  
      if (response.ok && result.success) {
        showAlert('Sukses', 'Data berhasil diperbarui');
        setTimeout(() => {
            navigation.goBack();
        }, 2000);
      } else {
        console.log('Response from server:', result);
        throw new Error(result.message || `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('Error', `Gagal memperbarui data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <FormInput
        label="Nama Pemilik"
        required
        value={formData.namaPemilik}
        onChangeText={(text) => handleInputChange(setFormData, 'namaPemilik', text)}
        placeholder="Nama pemilik lahan"
      />
      
      <Text style={styles.label}>Waktu Pelaksanaan <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={[styles.input, styles.textInputStyle]}
          value={waktuPelaksanaan ? formatDate(waktuPelaksanaan) : ''}
          editable={false}
          placeholder="Pilih Tanggal"
          placeholderTextColor="#626964"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={waktuPelaksanaan || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange(setShowDatePicker, setWaktuPelaksanaan)}
        />
      )}

      <View style={styles.cardBig}>
        <View style={styles.carddesa}>
          <Text style={styles.label}>Informasi Wilayah <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Cari Desa..."
            placeholderTextColor="#626964"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text, setVillages, setLoading, setShowDropdown, setSearchQuery, showAlert)}
          />
          {/* {loading && <ActivityIndicator size="small" color="#000" style={styles.loader} />} */}

          {showDropdown && (
            <FlatList
              data={villages}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              nestedScrollEnabled={true}
              renderItem={renderItem}
              style={styles.dropdown}
              ListEmptyComponent={() => !loading && <Text style={styles.noResultText}>Tidak ada hasil ditemukan</Text>}
              showsVerticalScrollIndicator= {false}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Informasi Wilayah Terpilih</Text>
          <View style={styles.infoContainer}>
            {[
              {
                label: 'Desa',
                value: selectedVillage
              },
              {
                label: 'Kecamatan',
                value: selectedDistrict
              },
              {
                label: 'Kabupaten/Kota',
                value: selectedCity
              },
              {
                label: 'Provinsi',
                value: selectedProvince
              },
            ].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.infoValue}>{item.value || '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={[{}]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => null}
      ListHeaderComponent={renderHeader()}
      showsVerticalScrollIndicator= {false}
      ListFooterComponent={
        <View>
          <FormInput
            label="Luas Lahan"
            required
            value={formData.luasLahan}
            onChangeText={(text) => handleInputChange(setFormData, 'luasLahan', text)}
            placeholder="contoh: 1000 m²"
            keyboardType="numeric"
            />  

            <FormInput
            label="Jenis Tanaman"
            required
            value={formData.jenisTanaman}
            onChangeText={(text) => handleInputChange(setFormData, 'jenisTanaman', text)}
            placeholder="contoh: Padi"
            />  

            <FormInput
            label="Masa Panen"
            required
            value={formData.masaPanen}
            onChangeText={(text) => handleInputChange(setFormData, 'masaPanen', text)}
            placeholder="contoh: 3 Bulan"
            />  

            <Text style={styles.label}>Sumber Air</Text>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.sumberAir}
              onValueChange={(itemValue) => handleInputChange(setFormData, 'sumberAir', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              <Picker.Item label="Sungai" value="Sungai" />
              <Picker.Item label="Jaringan Irigasi Primer" value="Jaringan Irigasi Primer" />
              <Picker.Item label="Jaringan Irigasi Sekunder" value="Jaringan Irigasi Sekunder" />
              <Picker.Item label="Jaringan Irigasi Tersier" value="Jaringan Irigasi Tersier" />
              <Picker.Item label="Sumur Bor/Pompa" value="Sumur Bor/Pompa" />
              <Picker.Item label="Mata Air" value="Mata Air" />
              <Picker.Item label="Danau/Waduk" value="Danau/Waduk" />
              <Picker.Item label="Kolam Penampung Air Hujan" value="Kolam Penampung Air Hujan" />
            </Picker>
            </View>

            <FormInput
            label="Jarak dari Sumber Air"
            required
            value={formData.jarakDariSumberAir}
            onChangeText={(text) => handleInputChange(setFormData, 'jarakDariSumberAir', text)}
            placeholder="contoh: 100 meter"
            keyboardType='numeric'
            />  

            <Text style={styles.label}>Ketersediaan Air</Text>
            <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <RadioButton
                value="Tercukupi"
                status={ketersediaanAir === 'Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Tercukupi</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="Kurang Tercukupi"
                status={ketersediaanAir === 'Kurang Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Kurang Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Kurang Tercukupi</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="Tidak Tercukupi"
                status={ketersediaanAir === 'Tidak Tercukupi' ? 'checked' : 'unchecked'}
                onPress={() => setKetersediaanAir('Tidak Tercukupi')}
                style={{transform: [{scale: 0.8}]}}
              />
              <Text style={styles.radioLabel}>Tidak Tercukupi</Text>
            </View>
            </View>

            <Text style={styles.label}>Metode Pengairan</Text>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.metodePengairan}
              onValueChange={(itemValue) => handleInputChange(setFormData, 'metodePengairan', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              <Picker.Item label="Irigasi Genangan" value="Irigasi Genangan" />
              <Picker.Item label="Irigasi Curah" value="Irigasi Curah" />
              <Picker.Item label="Irigasi Alur" value="Irigasi Alur" />
            </Picker>
            </View>

            <Text style={styles.label}>Titik Koordinat</Text>
            {formData.titikKoordinat.map((item, index) => (
              <View key={index} style={styles.pickerContainer}>
                <Picker
                  selectedValue={item}
                  onValueChange={(value) => handleKoordinatChange(setFormData, formData, index, value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  enabled={!loading}>
                  <Picker.Item label="Pilih Titik Koordinat" value="" enabled={false}/>
                  {dataPatok.map((patok) => patok && patok.id_titik ? (
                    <Picker.Item 
                      key={String(patok.id_titik)} 
                      label={`${patok.nama_titik || ''}`} 
                      value={String(patok.id_titik)} 
                    />
                  ) : null)}
                </Picker>
              </View>
            ))}
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleRemoveKoordinat(setFormData, formData)}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleAddKoordinat(setFormData)}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
            </View>

            <Text style={styles.label}>Pelaksana Survei</Text>
            {formData.pelaksanaSurvei.map((item, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Nama Pelaksana Survei ${index + 1}`}
              value={item}
              onChangeText={value => handlePelaksanaChange(setFormData, formData, index, value)}
              placeholderTextColor="#626964"
            />
            ))}
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleRemovePelaksana(setFormData, formData)}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => handleAddPelaksana(setFormData)}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
            </View>

            {dokumentasiList.map(({ key, label }) => (
            <View key={key}>
              <Text style={styles.labelFoto}>{label}</Text>
              <TouchableOpacity
                onPress={() => handleImagePick(key, setFormData)}
                style={styles.imageUpload}>
                {renderImage(formData[key])}
              </TouchableOpacity>
            </View>
            ))}
            <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>PERBARUI</Text>
            )}
            </TouchableOpacity>

            <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={closeAlert}
            />
        </View>
      }
      />
  );
};

export default EditForm;