import React, { useState, useEffect } from 'react';
import { Map, Droplets, Utensils, Shield, HeartPulse, Route, Sparkles, Navigation as NavigationIcon, LocateFixed } from 'lucide-react';
import Card from '../components/Card';
import { MAP_MARKERS, CROWD_ZONES, PREDEFINED_USER_ROUTES } from '../constants';
import { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup, 
    Circle, 
    Polyline, 
    useMap
} from 'react-leaflet';
import { useI18n, TranslationKey } from '../i18n';

// --- Start: Type-safe aliases for react-leaflet components ---
// This pattern avoids casting to `any` which can hide errors. It ensures
// props are correctly typed. We use a targeted `as any` on Marker as a
// workaround for a defective `icon` prop type in the library.
const SafeMapContainer = MapContainer;
const SafeTileLayer = TileLayer;
const SafePolyline = Polyline;
const SafeMarker = Marker as any;
// --- End: Type-safe aliases ---

// Declare L to satisfy TypeScript for creating custom Leaflet icons, as it's loaded globally by react-leaflet.
declare const L: any;

type RouteType = 'ai' | 'shortest';

// Helper component to programmatically fly to a map location
const MapFlyTo = ({ position }: { position: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 17, { // zoom to 17
                animate: true,
                duration: 1
            });
        }
    }, [position, map]);
    return null;
}


// Helper to create custom colored div icons for amenities
const createAmenityIcon = (color: string, isSelected: boolean) => {
    const size = isSelected ? '1.5rem' : '1rem';
    const border = isSelected ? '3px solid #f97316' : '2px solid white'; // orange-500 for selected
    const zIndex = isSelected ? 1000 : 400; // Bring selected marker to front
    
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: ${size}; height: ${size}; border-radius: 9999px; border: ${border}; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: all 0.2s ease-in-out; z-index: ${zIndex};"></div>`,
        className: '', // Important to clear default styling
        iconSize: isSelected ? [24, 24] : [16, 16],
        iconAnchor: isSelected ? [12, 12] : [8, 8],
    });
};

interface MapViewProps {
    crowdZones: typeof CROWD_ZONES;
    amenities: any[];
    routePath: [number, number][] | null;
    routeColor: string;
    selectedAmenityKey: string | null;
}

const MapView = ({ crowdZones, amenities, routePath, routeColor, selectedAmenityKey }: MapViewProps) => {
    const { t } = useI18n();
    const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);

     useEffect(() => {
        if (selectedAmenityKey) {
            const amenity = amenities.find(a => a.key === selectedAmenityKey);
            if (amenity) {
                setFlyToPosition(amenity.marker.position);
            }
        } else {
            setFlyToPosition(null);
        }
    }, [selectedAmenityKey, amenities]);

    const crowdLevelKeyMap: { [key: string]: string } = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
        'Critical': 'critical',
    };
    const markerTypeKeyMap: { [key: string]: string } = {
        user: 'markerTypeUser',
        temple: 'markerTypeTemple',
        ghat: 'markerTypeGhat',
        police: 'markerTypePolice',
        ambulance: 'markerTypeAmbulance',
        amenity: 'markerTypeAmenity',
    };

    const amenityMarkerNames = amenities.map(a => a.marker.name);

    return (
        <SafeMapContainer center={MAP_MARKERS.mahakaleshwar.position} zoom={16} scrollWheelZoom={true} className="leaflet-container">
            <SafeTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFlyTo position={flyToPosition} />
            {Object.entries(MAP_MARKERS)
                .filter(([, marker]) => !amenityMarkerNames.includes(marker.name))
                .map(([key, marker]) => (
                <Marker key={key} position={marker.position}>
                    <Popup>
                        <div className="font-bold text-gray-700">{t((markerTypeKeyMap[marker.type] || marker.type) as TranslationKey)}</div>
                        <div className="text-gray-600">{marker.name}</div>
                    </Popup>
                </Marker>
            ))}
            {amenities.map(amenity => (
                <SafeMarker 
                    key={amenity.key} 
                    position={amenity.marker.position} 
                    icon={createAmenityIcon(amenity.hexColor, selectedAmenityKey === amenity.key)}
                    zIndexOffset={selectedAmenityKey === amenity.key ? 1000 : 0}
                >
                    <Popup>
                        <div className="font-bold text-gray-700">{t(amenity.key as TranslationKey)}</div>
                        <div className="text-gray-600">{amenity.marker.name}</div>
                    </Popup>
                </SafeMarker>
            ))}
            {crowdZones.map(zone => (
                <Circle
                    key={zone.label}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3 }}
                >
                    <Popup>{t('crowdLevelPopup', { level: t((crowdLevelKeyMap[zone.label] || zone.label) as TranslationKey) })}</Popup>
                </Circle>
            ))}
            {routePath && (
                <SafePolyline pathOptions={{ color: routeColor, weight: 6, opacity: 0.8 }} positions={routePath} />
            )}
        </SafeMapContainer>
    )
}

const getDistance = (pos1: [number, number], pos2: [number, number]) => {
    // 1. Robust input validation to prevent any possibility of NaN inputs.
    if (!pos1 || !pos2 || !Array.isArray(pos1) || !Array.isArray(pos2) || pos1.length < 2 || pos2.length < 2) {
        return 0;
    }
    const lat1 = Number(pos1[0]);
    const lon1 = Number(pos1[1]);
    const lat2 = Number(pos2[0]);
    const lon2 = Number(pos2[1]);
    if (!isFinite(lat1) || !isFinite(lon1) || !isFinite(lat2) || !isFinite(lon2)) {
        return 0;
    }

    // 2. Haversine formula calculation
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    // 3. Clamp 'a' to handle potential floating point errors where a might be slightly > 1
    a = Math.max(0, Math.min(1, a));
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // 4. Final check to ensure a valid, finite number is always returned.
    return isFinite(distance) ? Math.round(distance) : 0;
}

const NavigationPage = () => {
    const [crowdZones, setCrowdZones] = useState(CROWD_ZONES);
    const [startPoint, setStartPoint] = useState('user');
    const [endPoint, setEndPoint] = useState('mahakaleshwar');
    const [selectedRoute, setSelectedRoute] = useState<RouteType>('ai');
    const [customRouteActive, setCustomRouteActive] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
    
    const { t } = useI18n();
    const isAiRoutesAvailable = startPoint === 'user';

    const crowdLevelKeyMap: { [key: string]: string } = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
        'Critical': 'critical',
    };

    const destinationOptions = Object.entries(MAP_MARKERS).map(([key, marker]) => ({
        value: key,
        label: marker.name,
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            setCrowdZones(prevZones => 
                prevZones.map(zone => ({
                    ...zone,
                    radius: Math.max(20, zone.radius + (Math.random() - 0.5) * 10)
                }))
            );
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCustomRouteActive(false); // Deactivate custom routes on selection change
        if (isAiRoutesAvailable) {
            setSelectedRoute('ai'); // Reset to AI route for standard path
        }
    }, [startPoint, endPoint, isAiRoutesAvailable]);
    
    
    let activeRoutePath: [number, number][] | null = null;
    let activeRouteColor: string = '';
    let activeRouteData: { name: string, description: string } | null = null;
    const startMarker = MAP_MARKERS[startPoint];
    const endMarker = MAP_MARKERS[endPoint];

    if (isAiRoutesAvailable && startMarker && endMarker) {
        const routeSet = PREDEFINED_USER_ROUTES[endPoint];
        if (routeSet) {
            const route = routeSet[selectedRoute];
            activeRoutePath = route.path;
            activeRouteColor = route.color;
            activeRouteData = {
                name: t(route.name as TranslationKey),
                description: t(route.description as TranslationKey, { start: startMarker.name, end: endMarker.name }),
            };
        } else {
            // Fallback for user-to-X routes that are not predefined (e.g., police stations)
            // Show a simple L-shaped path as a schematic representation
            const startPos = startMarker.position;
            const endPos = endMarker.position;
            activeRoutePath = [startPos, [startPos[0], endPos[1]], endPos];
            activeRouteColor = selectedRoute === 'shortest' ? '#8b5cf6' : '#3b82f6';
            activeRouteData = { 
                name: t(selectedRoute === 'shortest' ? 'shortestPathRouteName' : 'aiRecommendedRouteName'), 
                description: t('directPathDesc', { start: startMarker.name, end: endMarker.name }) 
            };
        }
    } else if (customRouteActive && startMarker && endMarker) {
        // For custom routes not starting from user location, create an L-shaped path
        activeRoutePath = [startMarker.position, [startMarker.position[0], endMarker.position[1]], endMarker.position];
        activeRouteColor = '#10b981'; // A default green for custom direct paths
        activeRouteData = {
            name: t('directPath'),
            description: t('directPathDesc', { start: startMarker.name, end: endMarker.name }),
        };
    }


    const handleFindRoute = () => {
        if (startPoint === endPoint) {
            alert("Start and end points cannot be the same.");
            return;
        }
        if (!isAiRoutesAvailable) {
            setCustomRouteActive(true);
        }
    };
    
    const userPosition = MAP_MARKERS.user.position;
    const amenities = [
        { key: 'waterStation', icon: Droplets, colorClass: 'text-cyan-500', hexColor: '#06b6d4', marker: MAP_MARKERS.waterStation1 },
        { key: 'foodStall', icon: Utensils, colorClass: 'text-yellow-500', hexColor: '#eab308', marker: MAP_MARKERS.foodStall1 },
        { key: 'policeStationAmenity', icon: Shield, colorClass: 'text-blue-500', hexColor: '#3b82f6', marker: MAP_MARKERS.policeStation1 },
        { key: 'ambulanceAmenity', icon: HeartPulse, colorClass: 'text-red-500', hexColor: '#ef4444', marker: MAP_MARKERS.ambulance1 },
    ];

    return (
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:h-full">
            <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                    <Map size={32} className="text-orange-500" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('navigationTitle')}</h1>
                </div>

                <Card>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-3">{t('routePlanning')}</h3>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="start-dest" className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('startDestination')}</label>
                            <select
                                id="start-dest"
                                value={startPoint}
                                onChange={e => setStartPoint(e.target.value)}
                                className="w-full mt-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
                            >
                                {destinationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="end-dest" className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('endDestination')}</label>
                            <select
                                id="end-dest"
                                value={endPoint}
                                onChange={e => setEndPoint(e.target.value)}
                                className="w-full mt-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
                            >
                                 {destinationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('chooseYourRoute')}</label>
                         <div className="flex space-x-2 mt-2">
                            <button 
                                onClick={() => setSelectedRoute('ai')}
                                disabled={!isAiRoutesAvailable}
                                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedRoute === 'ai' && isAiRoutesAvailable ? 'bg-blue-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                            >
                                <Sparkles size={20} />
                                <span>{t('aiRecommended')}</span>
                            </button>
                            <button 
                                onClick={() => setSelectedRoute('shortest')}
                                disabled={!isAiRoutesAvailable}
                                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedRoute === 'shortest' && isAiRoutesAvailable ? 'bg-violet-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                            >
                                <Route size={20} />
                                <span>{t('shortestPath')}</span>
                            </button>
                        </div>
                        {!isAiRoutesAvailable && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('aiRoutesNotAvailable')}</p>
                        )}
                    </div>
                    
                    { !isAiRoutesAvailable &&
                        <div className="mt-4">
                            <button 
                                onClick={handleFindRoute}
                                className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                            >
                                <LocateFixed size={20} className="mr-2" />
                                {t('findRoute')}
                            </button>
                        </div>
                    }

                    { (isAiRoutesAvailable || customRouteActive) && activeRouteData && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{activeRouteData.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{activeRouteData.description}</p>
                        </div>
                    )}
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800 dark:text-white">{t('crowdLevels')}</h3>
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-sm font-semibold text-red-500">{t('live')}</span>
                        </div>
                    </div>
                    <div className="flex justify-around">
                        {CROWD_ZONES.map(zone => (
                            <div key={zone.label} className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full`} style={{backgroundColor: zone.color}}></div>
                                <span className="text-sm font-semibold mt-1 text-gray-700 dark:text-gray-300">{t((crowdLevelKeyMap[zone.label] || zone.label) as TranslationKey)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                
                 <Card>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-3">{t('nearbyAmenities')}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {amenities.map(amenity => {
                            const Icon = amenity.icon;
                            const distance = getDistance(userPosition, amenity.marker.position);
                            const isSelected = selectedAmenity === amenity.key;
                            return (
                                <button 
                                    key={amenity.key} 
                                    onClick={() => setSelectedAmenity(prev => prev === amenity.key ? null : amenity.key)}
                                    className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-all ${isSelected ? 'bg-orange-100 dark:bg-orange-900/50 ring-2 ring-orange-500' : 'bg-gray-100 dark:bg-gray-700'}`}
                                >
                                    <Icon size={20} className={amenity.colorClass} />
                                    <div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{t(amenity.key as TranslationKey)}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('distanceAway', { distance })}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            </div>
            
            <div className="hidden lg:block lg:col-span-2 h-full">
                <Card className="h-full w-full !p-0 overflow-hidden">
                    <MapView 
                        crowdZones={crowdZones} 
                        amenities={amenities} 
                        routePath={activeRoutePath} 
                        routeColor={activeRouteColor || ''}
                        selectedAmenityKey={selectedAmenity}
                    />
                </Card>
            </div>
            
            <div className="lg:hidden h-96 w-full mt-4">
                 <Card className="h-full w-full !p-0 overflow-hidden">
                    <MapView 
                        crowdZones={crowdZones} 
                        amenities={amenities} 
                        routePath={activeRoutePath} 
                        routeColor={activeRouteColor || ''}
                        selectedAmenityKey={selectedAmenity}
                    />
                </Card>
            </div>
        </div>
    );
};

export default NavigationPage;