// src/screens/MapScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
// import socket from "../services/socket"; // uncomment when backend URL is set

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [watching, setWatching] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    let subscriber = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Location permission is required to share driver location.");
          return;
        }

        // Get one-time current position
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setLocation(current.coords);

        // Start continuous location watch
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,       // every 5 seconds
            distanceInterval: 5,     // or when moved 5 meters
          },
          (pos) => {
            const coords = pos.coords;
            setLocation(coords);

            // animate map to follow driver
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }, 500);
            }

            // Example: emit to backend via socket (uncomment once backend ready)
            // socket.emit("driver-location", { driverId: "DRIVER_1", lat: coords.latitude, lon: coords.longitude, ts: Date.now() });
            
            // Debug log visible in Metro/DevTools
            console.log("Driver location:", coords);
          }
        );

        setWatching(true);
      } catch (err) {
        console.warn("Location error:", err);
      }
    })();

    return () => {
      if (subscriber) subscriber.remove();
      setWatching(false);
    };
  }, []);

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="You (Driver)"
          description="Live position"
        />
      </MapView>
      <View style={styles.coords}>
        <Text>Lat: {location.latitude.toFixed(6)}</Text>
        <Text>Lng: {location.longitude.toFixed(6)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  coords: {
    position: "absolute",
    bottom: 14,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 6,
  },
});
