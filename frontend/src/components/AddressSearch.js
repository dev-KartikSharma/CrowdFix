
import React, { useState, useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

const useDebounce = (callback, delay) => {
    const timeoutIdRef = useRef(null);
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, []);
    return (...args) => {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

const AddressSearch = ({ onPlaceSelect }) => {
    const places = useMapsLibrary('places');
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [placesService, setPlacesService] = useState(null); // To get place details
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const map = document.createElement('div'); // A dummy div for the PlacesService

    useEffect(() => {
        if (places) {
            setAutocompleteService(new places.AutocompleteService());
            setPlacesService(new places.PlacesService(map)); // Initialize PlacesService
        }
    }, [places]);

    const fetchSuggestions = (value) => {
        if (!autocompleteService || !value) {
            setSuggestions([]);
            return;
        }
        autocompleteService.getPlacePredictions({ input: value }, (predictions) => {
            setSuggestions(predictions || []);
        });
    };

    const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 300);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedFetchSuggestions(value);
    };

    const handleSuggestionClick = (placeId, description) => {
        if (!placesService) return;

        
        placesService.getDetails({ placeId, fields: ['geometry'] }, (placeDetails, status) => {
            if (status === 'OK' && placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
                const position = {
                    lat: placeDetails.geometry.location.lat(),
                    lng: placeDetails.geometry.location.lng()
                };
                onPlaceSelect(position, description); 
                setInputValue(description); 
                setSuggestions([]); 
            } else {
                console.error('Failed to get place details:', status);
            }
        });
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type an address to search..."
                className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map(({ place_id, description }) => (
                        <li
                            key={place_id}
                            onClick={() => handleSuggestionClick(place_id, description)}
                            className="p-3 text-white cursor-pointer hover:bg-gray-600"
                        >
                            {description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressSearch;