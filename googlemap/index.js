import React ,{ useState, useEffect }from 'react'
import { GOOGLE_MAP_API } from '../config/map';
import {usePlacesAutocomplete, MapModal, useGoogleMapGeocoder } from './usegooglemap';
 



function MapIndex() {
    const [suggestions, fetchSuggestions] = usePlacesAutocomplete();
    const [inputValue, setInputValue]= useState('');
    const [geoCodeAddress, fetchGeoCodeAddress] = useGoogleMapGeocoder()

// console.log("suggestions....", suggestions);
// console.log("geoCodeAddress...", geoCodeAddress);

useEffect(()=>{
setInputValue(geoCodeAddress?.formatted_address)
},[geoCodeAddress])

  return (
    <>
    <input style={{width:'100%'}} type={'text'} value={inputValue} onChange={(e)=>{ fetchSuggestions(e.target.value) }} />
    <MapModal 
    onLocationSelect={(event)=>{console.log("on ok",event)}}
    onLocationChange={(event)=>{
      fetchGeoCodeAddress(event)
      console.log("on change",event)

      
    }}
    
    />
    {`${geoCodeAddress?.formatted_address}`}

    </>
  )
}

export default MapIndex