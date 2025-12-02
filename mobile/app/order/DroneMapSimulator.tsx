import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Platform, StyleSheet, Image } from 'react-native';
import MapView, { Marker, AnimatedRegion, Polyline } from 'react-native-maps';

export default function DroneMapSimulator({ fromLat, fromLng, toLat, toLng, duration = 30, onFinish }:
  { fromLat: number; fromLng: number; toLat: number; toLng: number; duration?: number; onFinish?: () => void }){
  const mapRef = useRef<MapView | null>(null);
  const markerRef = useRef<any>(null);

  // AnimatedRegion for marker movement
  const coordinate = useRef(new AnimatedRegion({
    latitude: fromLat,
    longitude: fromLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })).current;

  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    // animate marker to destination over `duration` seconds
    const toCoordinate = { latitude: toLat, longitude: toLng };
    // compute simple bearing to rotate the drone icon
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;
    const bearing = (() => {
      try {
        const φ1 = toRad(fromLat);
        const φ2 = toRad(toLat);
        const Δλ = toRad(toLng - fromLng);
        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
      } catch (e) { return 0; }
    })();

    setBearing(bearing);

    try {
      // AnimatedRegion has timing(). Use non-native driver for maps.
      (coordinate as any).timing({
        ...toCoordinate,
        duration: Math.max(3000, duration * 1000),
        useNativeDriver: false,
      }).start((res: { finished?: boolean }) => {
        if (res?.finished) {
          try { onFinish && onFinish(); } catch (e) {}
        } else {
          // Ensure finish callback if animation didn't report finished
          try { onFinish && onFinish(); } catch (e) {}
        }
      });
    } catch (e) {
      // fallback: setValue then animate map and call onFinish after timeout
      try { (coordinate as any).setValue(toCoordinate); } catch (_) {}
      setTimeout(() => { try { onFinish && onFinish(); } catch (e) {} }, Math.max(3000, duration * 1000));
    }

    // animate map to center between points and follow marker
    const center = { latitude: (fromLat + toLat) / 2, longitude: (fromLng + toLng) / 2, latitudeDelta: Math.abs(fromLat - toLat) * 3 || 0.02, longitudeDelta: Math.abs(fromLng - toLng) * 3 || 0.02 };
    if (mapRef.current) {
      try { mapRef.current.animateToRegion(center, 800); } catch (e) {}
    }
  }, [fromLat, fromLng, toLat, toLng, duration]);

  // If MapView is not linked/installed this will crash at runtime — expect user to install react-native-maps
  return (
    <View style={{ height: 300, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: (fromLat + toLat) / 2,
          longitude: (fromLng + toLng) / 2,
          latitudeDelta: Math.max(0.01, Math.abs(fromLat - toLat) * 2),
          longitudeDelta: Math.max(0.01, Math.abs(fromLng - toLng) * 2),
        }}
      >
        {/* straight line between A and B */}
        <Polyline
          coordinates={[{ latitude: fromLat, longitude: fromLng }, { latitude: toLat, longitude: toLng }]}
          strokeColor="#4b8cff"
          strokeWidth={3}
        />

        <Marker coordinate={{ latitude: fromLat, longitude: fromLng }} title="Start" />
        <Marker coordinate={{ latitude: toLat, longitude: toLng }} title="Destination" />

        {/* Animated drone marker with rotation using a simple vector-like icon */}
        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate as any}
          anchor={{ x: 0.5, y: 0.5 }}
          flat={true}
          rotation={bearing}
        >
          <View style={styles.iconWrap} pointerEvents="none">
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3211/3211277.png' }}
              style={{ width: 42, height: 42 }}
              resizeMode="contain"
            />
          </View>
        </Marker.Animated>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4b8cff',
  },
});
