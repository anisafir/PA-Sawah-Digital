import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  PermissionsAndroid, 
  Platform
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFS from 'react-native-fs';

const data = [
  {
    url: Image.resolveAssetSource(require('../assets/panduan/01.png')).uri,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/02.png')).uri,
    width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/03.png')).uri,
    width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/04.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/05.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/06.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/07.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/08.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/09.png')).uri,
   width: 1080,
    height: 1920,
  },
  {
    url: Image.resolveAssetSource(require('../assets/panduan/10.png')).uri,
   width: 1080,
    height: 1920,
  },
];

// const downloadPDF = async (fileUrl, fileName, setIsLoading) => {
//   try {
//     setIsLoading(true);
//     let destPath = '';

//     if (Platform.OS === 'android') {
//       // Cek versi Android
//       const androidVersion = Platform.constants?.Release;

//       if (parseInt(androidVersion, 10) >= 11) {
//         // Android 11+ (Scoped Storage)
//         destPath = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
//         console.log('Menggunakan DocumentDirectoryPath:', destPath);
//       } else {
//         // Android 10 ke bawah
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Izin Akses Penyimpanan',
//             message: 'Aplikasi butuh izin untuk menyimpan file PDF ke penyimpanan lokal',
//             buttonNeutral: 'Tanya Nanti',
//             buttonNegative: 'Tolak',
//             buttonPositive: 'Izinkan',
//           }
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert('Izin ditolak', 'Tidak bisa menyimpan file tanpa izin');
//           setIsLoading(false);
//           return;
//         }

//         destPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
//         console.log('Menggunakan DownloadDirectoryPath:', destPath);
//       }
//     } else {
//       destPath = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
//     }

//     const download = RNFS.downloadFile({
//       fromUrl: fileUrl,
//       toFile: destPath,
//     });

//     const result = await download.promise;

//     if (result.statusCode === 200) {
//       Alert.alert('Sukses', `File berhasil disimpan di:\n${destPath}`);
//     } else {
//       Alert.alert('Gagal', `Gagal mengunduh file: ${result.statusCode}`);
//     }
//   } catch (error) {
//     console.error('Download error:', error);
//     Alert.alert('Error', `Terjadi kesalahan saat mengunduh: ${error.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };


// const dataPDF = [
//   {
//     url: 'https://drive.google.com/uc?export=download&id=1QUE0Z8l7ZBC3b0gcYtJqqfaDenCqr0fZ',
//     title: 'DOWNLOAD PANDUAN',
//   },
// ];


const PanduanAlat = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={data}
        enableSwipeDown={true}
        backgroundColor="#fff"
        renderIndicator={(currentIndex, allSize) => (
          <View style={styles.indicatorContainer}>
            <Text
              style={
                styles.indicatorText
              }>{`${currentIndex} / ${allSize}`}</Text>
          </View>
        )}
      />
{/* 
      <View style={styles.buttonContainer}>
        {dataPDF.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => downloadPDF(item.url, 'buku_panduan', setIsLoading)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{item.title}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#486C3E',
    marginVertical: 10,
    borderRadius: 5,
    marginTop: -10,
    // paddingBottom: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  indicatorText: {
    color: 'black', // Ini akan membuat teks 1/10 menjadi hitam
    fontSize: 16,
  },
});

export default PanduanAlat;