import React, { useState, useEffect, useRef } from 'react';
import { GOOGLE_MAP_API } from '../config/map';

const useGoogleMaps = (callbackName) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&callback=${callbackName}&libraries=places`;
    script.async = true;
    // script.defer = true;

    script.addEventListener('load', () => {
      setScriptLoaded(true);
    });

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [callbackName]);

  return scriptLoaded;
};


export const usePlacesAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);


  const isGoogleMapsScriptLoaded = useGoogleMaps('initMap');

  const fetchSuggestions = (input) => {
    if (isGoogleMapsScriptLoaded) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "ca" },
          types: ["premise"],
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(results);
          }
        }
      );
    }
  };

  return [suggestions, fetchSuggestions];
};


export const useGoogleMapGeocoder = () => {
  const isGoogleMapsScriptLoaded = useGoogleMaps('initMap');
  const [geoCodeAddress, setGeoCodeAddress] = useState(null);

  const fetchGeoCodeAddress = (address) =>{
    if (isGoogleMapsScriptLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: address }, (results, status) => {
        if (status === 'OK') {
          setGeoCodeAddress(results[0]);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          setGeoCodeAddress(null);
        }
      });
    }
  }

  return [geoCodeAddress, fetchGeoCodeAddress];


};



export const MapModal = ({ onLocationSelect, onLocationChange }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [position, setPosition] = useState({ lat: 37.7749, lng: -122.4194 }); // default position of the marker
  const mapRef = useRef(null);


  const isGoogleMapsScriptLoaded = useGoogleMaps('initMap');

  useEffect(() => {
    if (isGoogleMapsScriptLoaded) {
      const options = {
        center: position,
        zoom: 12,
      };
      const map = new window.google.maps.Map(mapRef.current, options);
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
      });
      setMap(map);
      setMarker(marker);
    }
  }, [isGoogleMapsScriptLoaded]);


  useEffect(() => {
    if (marker) {
      window.google.maps.event.addListener(marker, 'dragend', () => {
        const newPosition = { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() };
        setPosition(newPosition);
        map.panTo(newPosition);
        onLocationChange(newPosition);
      });
    }
  }, [marker, map]);

  const handleLocationSelect = () => {
    onLocationSelect(position);
  };

  return (
    <div>
      <div ref={mapRef} style={{ height: '300px' }}></div>
      <button onClick={handleLocationSelect}>Select Location</button>
    </div>
  );
};
