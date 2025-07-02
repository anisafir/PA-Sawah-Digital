import {Alert, Image, StyleSheet} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import BASE_URL from '../config/config';

export const handleImagePick = (name, setFormData) => {
  Alert.alert(
    'Pilih Sumber Gambar',
    'Ambil gambar dari:',
    [
      {
        text: 'Kamera',
        onPress: () => {
          const options = {
            mediaType: 'photo',
            includeBase64: false,
          };
          launchCamera(options, response => {
            if (response.didCancel) {
              console.log('Anda membatalkan pengambilan foto');
            } else if (response.errorCode) {
              console.log('Gagal mengambil foto:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              const uri = response.assets[0].uri;
              setFormData(prevState => ({...prevState, [name]: uri}));
            }
          });
        },
      },
      {
        text: 'Galeri',
        onPress: () => {
          const options = {
            mediaType: 'photo',
            includeBase64: false,
          };
          launchImageLibrary(options, response => {
            if (response.didCancel) {
              console.log('Anda membatalkan pemilihan gambar');
            } else if (response.errorCode) {
              console.log('Gagal memilih gambar:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              const uri = response.assets[0].uri;
              setFormData(prevState => ({...prevState, [name]: uri}));
            }
          });
        },
      },
      {
        text: 'Batal',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};

export const renderImage = imageUri => {
  if (imageUri) {
    return <Image source={{uri: imageUri}} style={styles.imagePreview} />;
  }
  return (
    <Image
      source={require('../assets/icons/camera.png')}
      style={styles.imageIcon}
    />
  );
};

export const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', 'ml_default'); 
  data.append('folder', 'foto');

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dqnbrwkuv/image/upload', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('Cloudinary Error Response:', json);
      return null;
    }

    return {
      url: json.secure_url,
      public_id: json.public_id
    };
  } catch (err) {
    console.error('Upload gagal:', err);
    return null;
  }
};



export const handleSearch = async (text, setVillages, setLoading, setShowDropdown, setSearchQuery, showAlert) => {
  setSearchQuery(text);
  if (text.trim() === '' || text.length < 3) {
    setVillages([]);
    setLoading(false);
    setShowDropdown(false);
    return;
  }

  setLoading(true);
  setShowDropdown(true);

  try {
    const response = await fetch(`${BASE_URL}helper/wilayah/search?search=${text}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.data.length > 0) {
        const formattedVillages = data.data.slice(0, 10).map((item) => ({
          label: `${item.desa_kelurahan} (${item.kecamatan}, ${item.kabupaten}, ${item.provinsi})`,
          value: item.desa_kelurahan,
          village: item.kode_desa,
          district: item.kecamatan,
          city: item.kabupaten,
          province: item.provinsi,
        }));
        setVillages(formattedVillages);
      } else {
        setVillages([]);
      }
    } else {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error searching village:', error.message);
    setVillages([]);
    showAlert('Error', 'Gagal mengambil data pencarian desa. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const resetForm = (
  setFormData,
  setKetersediaanAir,
  setWaktuPelaksanaan,
  setSelectedVillage,
  setSelectedDistrict,
  setSelectedCity,
  setSelectedProvince,
  setSearchQuery
) => {
  setFormData({
    namaPemilik: '',
    informasiWilayah: '',
    luasLahan: '',
    jenisTanaman: '',
    masaPanen: '',
    jenisPupuk: '',
    sumberAir: 'Sungai',
    jarakDariSumberAir: '',
    metodePengairan: 'Irigasi Genangan',
    catatanLapangan: '',
    dokumentasiUtara: null,
    dokumentasiSelatan: null,
    dokumentasiBarat: null,
    dokumentasiTimur: null,
    titikKoordinat: [''],
    pelaksanaSurvei: [''],
  });

  setKetersediaanAir('Tercukupi');
  setWaktuPelaksanaan(new Date());
  setSelectedVillage('');
  setSelectedDistrict('');
  setSelectedCity('');
  setSelectedProvince('');
  setSearchQuery('');
};

export const handleInputChange = (setFormData, field, value) => {
  setFormData(prevForm => ({
    ...prevForm,
    [field]: value,
  }));
};

export const handleDateChange = (setShowDatePicker, setWaktuPelaksanaan) => (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    setWaktuPelaksanaan(selectedDate);
  }
};

export const handleAddKoordinat = (setFormData) => {
  setFormData(prevForm => ({
    ...prevForm,
    titikKoordinat: [...prevForm.titikKoordinat, '']
  }));
};

export const handleRemoveKoordinat = (setFormData, formData) => {
  if (formData.titikKoordinat.length > 1) {
    setFormData(prevForm => ({
      ...prevForm,
      titikKoordinat: prevForm.titikKoordinat.slice(0, -1)
    }));
  }
};

export const handleKoordinatChange = (setFormData, formData, index, value) => {
  const updatedKoordinat = [...formData.titikKoordinat];
  updatedKoordinat[index] = value;
  setFormData(prevForm => ({
    ...prevForm,
    titikKoordinat: updatedKoordinat,
  }));
};

export const handleAddPelaksana = (setFormData) => {
  setFormData(prevForm => ({
    ...prevForm,
    pelaksanaSurvei: [...prevForm.pelaksanaSurvei, '']
  }));
};

export const handleRemovePelaksana = (setFormData, formData) => {
  if (formData.pelaksanaSurvei.length > 1) {
    setFormData(prevForm => ({
      ...prevForm,
      pelaksanaSurvei: prevForm.pelaksanaSurvei.slice(0, -1)
    }));
  }
};

export const handlePelaksanaChange = (setFormData, formData, index, value) => {
  const updatedPelaksana = [...formData.pelaksanaSurvei];
  updatedPelaksana[index] = value;
  setFormData(prevForm => ({
    ...prevForm,
    pelaksanaSurvei: updatedPelaksana,
  }));
};


const styles = StyleSheet.create({
  imageIcon: {
    width: 50,
    height: 50,
  },
  imagePreview: {
    width: 75,
    height: 100,
  },
});



