import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const storeIcon = L.divIcon({
    className: '',
    html: `<div style="background:#10b981;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const customerIcon = L.divIcon({
    className: '',
    html: `<div style="background:#ef4444;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
});

function MapClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function MapFlyTo({ lat, lng }) {
    const map = useMap();
    const prev = useRef(null);

    useEffect(() => {
        if (lat !== null && lng !== null) {
            const key = `${lat},${lng}`;
            if (prev.current !== key) {
                prev.current = key;
                map.flyTo([lat, lng], 15, { duration: 1 });
            }
        }
    }, [lat, lng, map]);

    return null;
}

export default function MapPicker({
    lat,
    lng,
    storeLat,
    storeLng,
    onLocationSelect,
    onSearchAddress,
    tileUrl,
    readOnly = false,
    height = '400px',
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimer = useRef(null);
    const wrapperRef = useRef(null);

    const doSearch = useCallback(async (query) => {
        if (!query || query.length < 3 || !onSearchAddress) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const results = await onSearchAddress(query);
            setSearchResults(results);
            setShowDropdown(results.length > 0);
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, [onSearchAddress]);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => doSearch(searchQuery), 400);
        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, [searchQuery, doSearch]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectResult = (result) => {
        const slat = parseFloat(result.lat);
        const slng = parseFloat(result.lon);
        setSearchQuery(result.display_name);
        setShowDropdown(false);
        onLocationSelect(slat, slng);
    };

    return (
        <div ref={wrapperRef} className="relative" style={{ height }}>
            {/* Search bar overlay */}
            {!readOnly && onSearchAddress && (
                <div className="absolute top-3 left-3 right-3 z-[1000]">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center px-3 py-2.5">
                            <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                placeholder="Cari alamat..."
                                className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
                            />
                            {searching && (
                                <svg className="w-4 h-4 text-gray-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                        </div>
                        {showDropdown && (
                            <ul className="border-t border-gray-100 max-h-52 overflow-y-auto">
                                {searchResults.map((result, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelectResult(result)}
                                        className="px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer border-b border-gray-50 last:border-0 flex items-start gap-2"
                                    >
                                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-2">{result.display_name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <MapContainer
                center={[storeLat, storeLng]}
                zoom={14}
                style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 1 }}
                zoomControl={true}
            >
                <TileLayer
                    url={tileUrl}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {!readOnly && <MapClickHandler onClick={onLocationSelect} />}

                <MapFlyTo lat={lat} lng={lng} />

                {lat !== null && lng !== null && (
                    <Marker position={[lat, lng]} icon={customerIcon} />
                )}

                <Marker position={[storeLat, storeLng]} icon={storeIcon} />

                <Circle
                    center={[storeLat, storeLng]}
                    radius={10000}
                    pathOptions={{
                        color: '#ef4444',
                        weight: 2,
                        fillColor: '#ef4444',
                        fillOpacity: 0.04,
                        dashArray: '6, 4',
                    }}
                />
            </MapContainer>
        </div>
    );
}
