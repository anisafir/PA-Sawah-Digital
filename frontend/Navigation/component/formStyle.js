import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    // fontFamily: 'Alkalami-Regular',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 10,
    paddingHorizontal: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#811414',
  },
  inputContainer: {
    marginBottom: 5,
    // marginTop: 10,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    paddingTop: 5,
    marginBottom: 0,
    marginLeft: 20,
    marginRight: 20,
    color: 'black',
    // fontFamily: 'Alkalami-Regular',
  },
  labelFoto: {
    fontSize: 15,
    paddingTop: 5,
    marginBottom: -3,
    marginLeft: 20,
    marginRight: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    marginBottom: 7,
    marginHorizontal: 20,
    borderRadius: 5,
    color: 'black',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#486C3E',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: 'bold',
    // fontFamily: 'Alkalami-Regular',
  },
  circleButton: {
    backgroundColor: '#ccc', // Warna abu
    width: 30, // Lebar lingkaran
    height: 30, // Tinggi lingkaran
    borderRadius: 25, // Membuat tombol berbentuk bulat
    justifyContent: 'center', // Isi berada di tengah secara vertikal
    alignItems: 'center', // Isi berada di tengah secara horizontal
    alignSelf: 'center', // Memposisikan tombol di tengah secara horizontal
    marginBottom: 15, // Spasi bawah
    marginTop: 5,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 10,
    marginTop: 5,
    marginBottom: 7,
    color: '#333',
  },
  container23: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  circleButton: {
    width: 30, // Ukuran lingkaran
    height: 30, // Ukuran lingkaran
    borderRadius: 25, // Setengah dari width/height untuk membentuk lingkaran sempurna
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'center',
    marginBottom: 15,
    marginHorizontal: 10,
  },
  circleButtonText: {
    fontSize: 15,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input3: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fad6a7',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    color: '#333',
  },
  picker: {
    height: 60,
  },
  pickerItem: {
    fontSize: 15,
    color: 'black'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 0,
    marginVertical:5,
    marginHorizontal: 20,
    borderRadius: 5,
    paddingHorizontal: 5, 
    color: 'black',
  },
  radioGroup: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{scale: 0.9}],
  },
  radioLabel: {
    fontSize: 15,
    color: 'black',
    marginRight: -10,
    marginLeft: -5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    width: 120,
  },
  infoContainer: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  colon: {
    fontSize: 15,
    marginHorizontal: 5,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
  },
  loader: {
    marginTop: 10,
    alignSelf: 'center',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultText: {
    fontSize: 15,
  },
  noResultText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    padding: 20,
  },
  dropdown: {
    maxHeight: 350,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  noResultText: {
    padding: 5,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    color: '#333',
  },
});

export default styles;
