// src/components/LocationPicker.js
import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import AddressSearch from './AddressSearch'; // Import the new component

const LocationPicker = ({ onLocationSelect }) => {
    const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi
    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const map = useMap(); // Hook to get the map instance

    // Set initial marker position to user's current location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setMarkerPos(newPos);
                onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
                if (map) map.panTo(newPos);
            },
            () => console.log("Could not get user location."),
            { enableHighAccuracy: true }
        );
    }, [onLocationSelect, map]);

    const handleMapClick = (event) => {
        const newPos = {
            lat: event.detail.latLng.lat,
            lng: event.detail.latLng.lng,
        };
        setMarkerPos(newPos);
        onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
    };

    // This function is called when a user selects an address from the search
    const handlePlaceSelect = (position) => {
        setMarkerPos(position);
        onLocationSelect({ latitude: position.lat, longitude: position.lng });
        if (map) {
            map.panTo(position);
            map.setZoom(15);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300">Location *</label>
            <p className="text-xs text-gray-400 mb-2">Type an address or click on the map to place a pin.</p>
            
            {/* --- ADD THE ADDRESS SEARCH COMPONENT HERE --- */}
            <div className="mb-4">
                <AddressSearch onPlaceSelect={handlePlaceSelect} />
            </div>

            <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                <Map
                    center={markerPos}
                    zoom={12}
                    mapId="civic-issue-map"
                    onClick={handleMapClick}
                    gestureHandling={'greedy'}
                >
                    <AdvancedMarker position={markerPos} />
                </Map>
            </div>
        </div>
    );
};

export default LocationPicker;