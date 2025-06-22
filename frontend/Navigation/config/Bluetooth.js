import React, {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
import TcpSocket from 'react-native-tcp-socket';
import currentDate from '../Helpers/curren_date.js';
import NtripClient from 'react-native-ntrip-client';
import {useDispatch, useSelector} from 'react-redux';
import {PermissionsAndroid, Platform, Alert} from 'react-native';

import RNBluetoothClassic from 'react-native-bluetooth-classic';

import AsyncStorageHelper from '../Helpers/asyncLocalStorage.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setStreamData,
  clearStreamData,
  clearAllStreams,
} from '../config/streamSlice.js';

const SearchDevice = async () => {
  try {
    const granted = await requestAccessFineLocationPermission();
    if (!granted) {
      throw new Error(`Access fine location was not granted`);
    }
    console.log('scaan start');
    const discoveredDevices = await RNBluetoothClassic.startDiscovery();
    return discoveredDevices;
  } catch (error) {
    console.log('error serach', error);
    return {error: error};
  }
};

const requestAccessFineLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access fine location required for discovery',
      message:
        'In order to perform discovery, you must enable/allow ' +
        'fine location access.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const ConnectDevice = async (data, dispach) => {
  try {
    if (data.id) {
      const connectTodevice = await RNBluetoothClassic.connectToDevice(data.id);
      if (connectTodevice) {
        try {
          await AsyncStorageHelper.setItem('data_device', JSON.stringify(data));
          await AsyncStorageHelper.setItem(
            'date_connect',
            JSON.stringify(currentDate()),
          );
          const RequestRead = await ReadingData(connectTodevice, dispach);
          return true;
        } catch (error) {
          console.log('Error setting data_device and date_connect:', error);
          return {error: error};
        }
      }
    }
    throw new Error('An error occurred during device connection');
  } catch (error) {
    return {error: error};
  }
};

const ReadingData = async (device, dispach) => {
  device.onDataReceived(data => {
    const commingData = data.data;
    // console.log(commingData);
    if (commingData.startsWith('$GNGGA')) {
      dispach(setStreamData({streamId: 'GNGGA', data: commingData}));
    }
    if (commingData.startsWith('$GNGSA')) {
      dispach(setStreamData({streamId: 'GNGSA', data: commingData}));
    }
    if (commingData.startsWith('$GNGST')) {
      dispach(setStreamData({streamId: 'GNGST', data: commingData}));
    }
    if (commingData.startsWith('$GNSSINFO')) {
      dispach(setStreamData({streamId: 'GNSSINFO', data: commingData}));
    }
  });
};

const writingData = async (device) => {
  console.log('Jalankan NTRIP');
  try {
    const host = 'nrtk.big.go.id';
    const port = '2001';
    const username = 'tgi456';
    const password = 'tgi456';
    const mountpoint = 'max-rtcm3';
    const perintah2 =
          "*cors," +
          host +
          "," +
          port +
          "," +
          username +
          "," +
          password +
          "," +
          mountpoint +
          ",\n";
    device.write(perintah2,null,handleError()
    );

    setTimeout(() => {
      var perintah = "ntrip\n";
      device.write(perintah);
    }, 1000);
  } catch (error) {
    console.log('error ntrip ', error);
  }
};

const connectWifiReq = async (data) => {
  // console.log(data);
  const getDevices = await AsyncStorageHelper.getItem('data_device');
  const deviceConnect = JSON.parse(getDevices);
  const device = await RNBluetoothClassic.connectToDevice(deviceConnect.id);
  var perintah = '*wifi,' + data.ssid + ',' + data.password + ',\n';
  console.log(perintah);
  device.write(perintah, null,handleError());
  setTimeout(() => {
    writingData(device);
  }, 5000);
};

const handleError = async (err) => {
  console.log(err);


// Komponen untuk memutuskan perangkat Bluetooth
const DisconnectedDevice = async (dispatch) => {
  const connectedDevice = await AsyncStorageHelper.getItem('data_device');
  const getDevice = JSON.parse(connectedDevice);
  if (getDevice.id) {
    try {
      const response = await RNBluetoothClassic.disconnectFromDevice(
        getDevice.id,
      );
      if (response) {
        await AsyncStorageHelper.removeItem('data_device');
        dispatch(clearAllStreams());
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      // Alert.alert('Disconnection error', 'An error occurred while disconnecting.');
    }
  }
};

// Komponen untuk memeriksa ketersediaan Bluetooth
const CheckAvailable = async () => {
  const permissionsGranted = await requestPermissions();
  if (!permissionsGranted) {
    return false; // Stop execution if permissions are not granted
  }

  try {
    const available = await RNBluetoothClassic.isBluetoothAvailable();
    if (!available) {
      console.warn('Bluetooth is not available on this device.');
      return false;
    }

    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    if (!enabled) {
      await RNBluetoothClassic.requestBluetoothEnabled();
    } else {
      console.log('Bluetooth is already enabled.');
      return true;
    }
  } catch (err) {
    console.error('Error initializing Bluetooth:', err);
    return false;
  }

  return false;
};

const showdevicePair = async () => {
  try {
    const listDevice = await RNBluetoothClassic.getBondedDevices();
    return listDevice;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

export {
  SearchDevice,
  ConnectDevice,
  DisconnectedDevice,
  CheckAvailable,
  showdevicePair,
  writingData,
  connectWifiReq,
};
