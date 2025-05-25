import React, { useState } from 'react';
import proj4 from 'proj4'; // Tetap dipakai untuk referensi, bisa dihapus jika tidak diperlukan
import * as utm from 'utm'; // Pastikan Anda telah menginstal library 'utm'

const CoordinateConverter = (gngga) => {
  const convertToDecimal = (coord, direction) => {
    const degrees = parseInt(coord.slice(0, coord.indexOf(".") - 2));
    const minutes = parseFloat(coord.slice(coord.indexOf(".") - 2)) / 60;
    let decimal = degrees + minutes;
    if (direction === "S" || direction === "W") decimal *= -1;
    return decimal;
  };

  const parseGNGGA = (gnggaString) => {
    if (!gnggaString) return { latitude: null, longitude: null, error: "GNGGA data is empty" };
    const dataParts = gnggaString.split(",");
    if (dataParts.length < 6) return { latitude: null, longitude: null, error: "Invalid GNGGA format" };

    const latitudeRaw = dataParts[2];
    const latitudeDirection = dataParts[3];
    const longitudeRaw = dataParts[4];
    const longitudeDirection = dataParts[5];

    if (!latitudeRaw || !latitudeDirection || !longitudeRaw || !longitudeDirection) {
      return { latitude: null, longitude: null, error: "Missing coordinate data" };
    }

    const latitude = convertToDecimal(latitudeRaw, latitudeDirection);
    const longitude = convertToDecimal(longitudeRaw, longitudeDirection);
    const formattedLatitude = formatCoordinate(latitude);
    const formattedLongitude = formatCoordinate(longitude);

    return { latitude: formattedLatitude, longitude: formattedLongitude, error: null };
  };

  const formatCoordinate = (coordinate) => {
    return coordinate.toFixed(10);
  };

  return parseGNGGA(gngga);
};

const conferalt = async (gngst) => {
  const comming_data = gngst ? gngst.split(',') : null;
  const Accuracy = (value, decimalPlaces) => parseFloat(parseFloat(value).toFixed(decimalPlaces));

  if (comming_data && comming_data.length >= 9) {
    const x = parseFloat(comming_data[6] || '0');
    const y = parseFloat(comming_data[7] || '0');
    const z = parseFloat(comming_data[8] || '0');
    const rmse = (x + y + z) / 3;
    return Accuracy(rmse, 3);
  }

  return false;
};

const NmeaParser = async (gngga, gngst = null) => {
  const pasTolonglat = await CoordinateConverter(gngga);
  const parsGngg = gngga.split(',');

  if (pasTolonglat.error == null) {
    try {
      const latitude = parseFloat(pasTolonglat.latitude);
      const longitude = parseFloat(pasTolonglat.longitude);
      
      // Menggunakan fungsi baru untuk konversi UTM
      const { easting, northing } = utm.fromLatLon(latitude, longitude);
      const utmZone = getUTMZone(longitude);
      const utmLetter = getUTMZoneLetter(latitude);

      // Konversi ke DMS dan penambahan informasi lainnya
      const latitudeDMS = toDMS(latitude);
      const longitudeDMS = toDMS(longitude);
      const elevation = parsGngg[9];

      const accuracy = gngst ? await conferalt(gngst) : null;

      return {
        // error: null,
        latitude: pasTolonglat.latitude,
        longitude: pasTolonglat.longitude,
        utmX: easting,
        utmY: northing,
        utmZone: `${utmZone}${utmLetter}`,
        latitudeDMS,
        longitudeDMS,
        elevation,
        accuracy: accuracy || null,
      };
    } catch (error) {
      console.log(error);
      return { error: "Error during UTM conversion" };
    }
  } else {
    return { error: pasTolonglat.error };
  }
};

// Fungsi-fungsi tambahan
const getUTMZone = (longitude) => Math.floor((longitude + 180) / 6) + 1;
const getUTMZoneLetter = (latitude) => (latitude >= 0 ? 'N' : 'S');

const toDMS = (decimal, isLatitude) => {
  const absDecimal = Math.abs(decimal);
  const degrees = Math.floor(absDecimal);
  const minutes = Math.floor((absDecimal - degrees) * 60);
  const seconds = ((absDecimal - degrees) * 60 - minutes) * 60;

  let direction;
  if (isLatitude) {
    direction = decimal >= 0 ? 'LU' : 'LS';
  } else {
    direction = decimal >= 0 ? 'BT' : 'BB';
  }

  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction}`;
};

const parseCoordinates = (input) => {
  const regex = /^(-?\d+)°\s(\d+)'?\s([\d.]+)"?\s(\w+)$/;
  const match = input.match(regex);

  if (match) {
    const [_, degrees, minutes, seconds, direction] = match;
    return {
      degrees,
      minutes: `${minutes}'`,
      seconds,
      direction,
    };
  }
  return null;
};

// Ekspor kedua fungsi
export { CoordinateConverter, conferalt, NmeaParser,parseCoordinates };
