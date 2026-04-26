import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapComponent from '../src/components/MapComponent';

// Mocking the Google Maps Hook natively for Testing 100% Coverage
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
  GoogleMap: ({ children }) => <div data-testid="google-map-mock">{children}</div>,
  Marker: () => <div data-testid="map-marker-mock" />
}));

describe('MapComponent Fallbacks & Validation', () => {
    test('Renders Map Placeholder when VITE_MAPS_API_KEY is completely missing', () => {
        // Temporarily clear explicit env
        const originalEnv = process.env.VITE_MAPS_API_KEY;
        delete process.env.VITE_MAPS_API_KEY;

        render(<MapComponent />);

        // Should hit graceful fallback instead of crashing
        expect(screen.getByText(/Please configure Google Maps API Key/i)).toBeInTheDocument();
        
        // Restore
        process.env.VITE_MAPS_API_KEY = originalEnv;
    });

    test('Renders valid Google Map when loaded', () => {
        process.env.VITE_MAPS_API_KEY = 'mock_key';
        
        render(<MapComponent />);
        
        // Ensure interactive map container is generated successfully
        expect(screen.getByLabelText(/Interactive map displaying polling points/i)).toBeInTheDocument();
    });
});
