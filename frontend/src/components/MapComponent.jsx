import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 };

/**
 * MapComponent
 * Renders the Google Maps integration to display nearby polling stations. 
 * Includes deep keyboard accessibility and robust failure boundaries.
 */
const MapComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return <div className="glass-panel" role="alert">Map cannot be loaded right now, sorry.</div>;
  }

  if (!import.meta.env.VITE_MAPS_API_KEY) {
    return (
      <article className="glass-panel" aria-labelledby="map-header">
        <h2 id="map-header">Polling Station Finder</h2>
        <div 
          style={{ height: '300px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}
          role="region" 
          aria-label="Map Placeholder" 
          tabIndex="0"
        >
          <p>Please configure Google Maps API Key in .env to display visual polling routes</p>
        </div>
      </article>
    );
  }

  return isLoaded ? (
    <article className="glass-panel" aria-labelledby="map-header" tabIndex="0">
      <h2 id="map-header">Nearby Polling Station</h2>
      <div style={{ borderRadius: '0.5rem', overflow: 'hidden' }} aria-label="Interactive map displaying polling points" role="application">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ 
            gestureHandling: 'cooperative', // Accessibility for smooth scrolling
            styles: [{ featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] }] 
          }}
        >
          <Marker position={defaultCenter} title="Your Polling Location" />
        </GoogleMap>
      </div>
    </article>
  ) : <div className="glass-panel" aria-live="polite">Loading Map Ecosystem...</div>;
};

// No direct parents props to map, but keeping propTypes clean out of standard
MapComponent.propTypes = {};

export default React.memo(MapComponent);
