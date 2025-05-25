import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';

const dmsToDecimal = (dms) => {
  if (!dms || typeof dms !== 'string') return null;
  let isNegative = false;

  if (dms.includes('LS') || dms.includes('BB')) {
    isNegative = true; 
  }

  dms = dms.replace(/(LS|LU|BT|BB)/, '').trim();
  const parts = dms.replace(/[^\d\w\.°'"]+/g, ' ').trim().split(/\s+/);

  const degrees = parseFloat(parts[0].replace('°', ''));
  const minutes = parseFloat(parts[1].replace('\'', ''));
  const seconds = parseFloat(parts[2].replace('\"', ''));
  let decimal = degrees + minutes / 60 + seconds / 3600;

  if (isNegative) {
    decimal = -decimal;
  }

  return decimal;
};

const Titiklokasi = ({ route }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  const point = route.params?.point || {};
  
  const koordinatBujur = point.koordinat_bujur || point.longitude || point.long;
  const koordinatLintang = point.koordinat_lintang || point.latitude || point.lat;
  
  const longitude = koordinatBujur ? dmsToDecimal(koordinatBujur) : 0;
  const latitude = koordinatLintang ? dmsToDecimal(koordinatLintang, true) : 0;
  
  useEffect(() => {
    
    if (!koordinatBujur || !koordinatLintang) {
      setError('Data koordinat tidak lengkap');
    }
  }, [longitude, latitude, koordinatBujur, koordinatLintang]);

  const generateMapHTML = () => {
    const validLongitude = isNaN(longitude) ? 106.8456 : longitude;
    const validLatitude = isNaN(latitude) ? -6.2088 : latitude;
    
    const pointName = point.nama_titik || 'Titik Lokasi';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OpenLayers Map</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.2.1/ol.css" />
          <style>
            #map { height: 100vh; width: 100%; }
            
            /* Layer switcher dropdown */
            .layer-switcher {
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: white;
              padding: 8px;
              border-radius: 4px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              z-index: 1000;  /* Ensure dropdown is above the map */
            }
            
            /* Style for coordinates display */
            .coordinates-display {
              position: absolute;
              bottom: 20px;
              left: 20px;
              background-color: white;
              padding: 10px;
              border-radius: 4px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              z-index: 1000;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="layer-switcher">
            <select id="basemap-select">
              <option value="osm">OpenStreetMap</option>
              <option value="esriStreet">Esri Street</option>
              <option value="esriImagery">Esri Imagery</option>
              <option value="rbi">Rupa Bumi Indonesia</option>
            </select>
          </div>
          <div class="coordinates-display" id="coordinates">
            Lat: -, Long: -
          </div>
          <script src="https://cdn.jsdelivr.net/npm/ol@v10.2.1/dist/ol.js"></script>
          <script>
            // Basemap layers
            const basemaps = {
              'osm': new ol.layer.Tile({
                source: new ol.source.OSM()
              }),
              'esriStreet': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
                })
              }),
              'esriImagery': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                })
              }),
              'rbi': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/tile/{z}/{y}/{x}'
                })
              })
            };
  
            // Create map and add default basemap
            const map = new ol.Map({
              target: 'map',
              layers: [basemaps['osm']],  // Default basemap
              view: new ol.View({
                center: ol.proj.fromLonLat([${validLongitude}, ${validLatitude}]),
                zoom: 18,
                rotation: 0  // Default rotation (north up)
              })
            });
  
            // Add point feature
            const pointFeature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([${validLongitude}, ${validLatitude}])),
              name: '${pointName}'
            });
  
            const vectorLayer = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [pointFeature]
              }),
              style: new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 6,
                  fill: new ol.style.Fill({ color: 'blue' }),
                  stroke: new ol.style.Stroke({ color: 'white', width: 2 })
                }),
                text: new ol.style.Text({
                  text: pointFeature.get('name'),
                  font: 'bold 12px sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  offsetY: -20
                })
              })
            });
            map.addLayer(vectorLayer);
  
            // Layer switcher logic
            const basemapSelect = document.getElementById('basemap-select');
            basemapSelect.addEventListener('change', function() {
              const selectedBasemap = basemapSelect.value;
              map.getLayers().setAt(0, basemaps[selectedBasemap]);
            });

            function updateCenterCoordinates() {
              const center = ol.proj.toLonLat(map.getView().getCenter());
              const lat = center[1].toFixed(6);
              const lon = center[0].toFixed(6);
              document.getElementById('coordinates').innerText = \`Lat: \${lat}, Long: \${lon}\`;
            }
            
            // Update coordinates initially
            updateCenterCoordinates();
            
            // Setup listeners for map movements
            map.on('moveend', updateCenterCoordinates);
            
            // Also update when user is actively dragging
            map.on('pointerdrag', updateCenterCoordinates);
            
            // Inform React Native that map has loaded
            window.ReactNativeWebView.postMessage('mapLoaded');
          </script>
        </body>
      </html>
    `;
  };
  
  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'mapLoaded') {
      setMapLoaded(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <WebView
        originWhitelist={['*']}
        source={{ html: generateMapHTML() }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffeeee',
    borderBottomWidth: 1,
    borderBottomColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  }
});

export default Titiklokasi;