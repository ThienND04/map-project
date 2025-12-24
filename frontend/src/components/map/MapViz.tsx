'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { MapProvider, MapRef, NavigationControl, Popup } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { BearSighting, HoverInfo, MapViewMode } from '@/types/bear';
import 'mapbox-gl/dist/mapbox-gl.css';
import BearTooltip from '@/components/map/BearTooltip';
import { FlyToInterpolator } from '@deck.gl/core';
import SearchBar from '@/components/ui/SearchBar';
import { ZoomControls } from '@/components/ui/ZoomControls';
import { getBearH3Layer } from '@/components/map/layers/BearH3Layer';
import { getBearPointsLayer } from '@/components/map/layers/BearPointsLayer';
import { ViewModeControl } from '@/components/ui/ViewModeControl';
import { getH3Resolution } from '@/lib/utils';
import Legend from './Legend';

interface MapVizProps {
    selectedYear: number;
}

const MapViz: React.FC<MapVizProps> = ({ selectedYear }) => {
    const [viewMode, setViewMode] = useState<MapViewMode>('POINTS');
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [selectedBear, setSelectedBear] = useState<BearSighting | null>(null);
    const [searchResults, setSearchResults] = useState<BearSighting[]>([]);

    const mapRef = useRef<MapRef>(null);
    const [currentBounds, setCurrentBounds] = useState<{
        minLat: number, maxLat: number, minLng: number, maxLng: number
    } | null>(null);

    // goi khi map dung di chuyen
    const updateBounds = useCallback((mapInstance?: any) => {
        const map = mapInstance || mapRef.current?.getMap();
        console.log('Map instance found:', !!map);
        if (map) {
            const bounds = map.getBounds();

            setCurrentBounds({
                minLng: bounds.getWest(),
                minLat: bounds.getSouth(),
                maxLng: bounds.getEast(),
                maxLat: bounds.getNorth(),
            });
        }
    }, []);

    const [viewState, setViewState] = useState({
        longitude: 138.2529,
        latitude: 36.2048,
        zoom: 5,
        pitch: 0,
        bearing: 0,
        transitionDuration: 0,
        transitionInterpolator: undefined as any
    });

    const handleSelectLocation = useCallback((location: any) => {
        console.log("Selected location from search:", location);
        if (location.latitude && location.longitude) {
            setViewState(prev => ({
                ...prev,
                longitude: location.longitude,
                latitude: location.latitude,
                zoom: 12, // Zoom gần vào điểm tìm thấy
                transitionDuration: 2000, // Bay trong 2 giây
                transitionInterpolator: new FlyToInterpolator()
            }));

            setSelectedBear(location);
        }
    }, []);

    useEffect(() => {
        if (!currentBounds && mapRef.current) {
            updateBounds();
        }
    }, [mapRef.current]);

    const layers = useMemo(() => {
        const layerList = [];

        if (viewMode === 'POINTS') {
            layerList.push(
                getBearPointsLayer({
                    selectedYear,
                    selectedBear,
                    searchResults,
                    onClick: (info) => {
                        if (info.object && info.coordinate) {
                            const [lng, lat] = info.coordinate;
                            const bearData = { ...info.object.properties, longitude: lng, latitude: lat };

                            if (selectedBear && bearData.fid === selectedBear.fid) {
                                setSelectedBear(null);
                            } else {
                                setSelectedBear(bearData);
                            }
                        } else {
                            setSelectedBear(null);
                        }
                    },
                    onHover: (info) => {
                        if (info.object) {
                            const [lng, lat] = info.coordinate || [0, 0];
                            const bearData = { ...info.object.properties, longitude: lng, latitude: lat };
                            setHoverInfo({
                                object: bearData,
                                x: info.x,
                                y: info.y,
                                type: 'POINTS'
                            });
                        } else {
                            setHoverInfo(null);
                        }
                    }
                })
            );
        } else if (viewMode === 'H3_DENSITY') {
            const resolution = getH3Resolution(viewState.zoom);
            layerList.push(
                getBearH3Layer({
                    selectedYear,
                    resolution: resolution, 
                    bounds: currentBounds, 
                    onHover: (info) => {
                        if (info.object) {
                            // console.log('H3 Hover Info:', info.object);
                            const [lng, lat] = info.coordinate || [0, 0];
                            const bearData = { ...info.object, longitude: lng, latitude: lat };
                            // console.log('H3 Bear Data:', bearData);
                            setHoverInfo({
                                object: bearData,
                                x: info.x,
                                y: info.y,
                                type: 'H3' 
                            });
                        } else {
                            setHoverInfo(null);
                        }
                    }
                })
            );
        }

        return layerList;
    }, [viewMode, selectedYear, selectedBear, searchResults, viewState.zoom, currentBounds]);

    const handleZoomIn = () => {
        setViewState(v => ({
            ...v,
            zoom: Math.min(v.zoom + 1, 20), // Max zoom 20
            transitionDuration: 300,        
            transitionInterpolator: new FlyToInterpolator()
        }));
    };

    const handleZoomOut = () => {
        setViewState(v => ({
            ...v,
            zoom: Math.max(v.zoom - 1, 0), 
            transitionDuration: 300,
            transitionInterpolator: new FlyToInterpolator()
        }));
    };

    return (
        <MapProvider>
            <div className="relative w-full h-screen">
                <SearchBar
                    year={selectedYear}
                    onSelectLocation={handleSelectLocation}
                    onSearchComplete={(results) => setSearchResults(results)}
                />
                <ViewModeControl mode={viewMode} onChange={setViewMode} />
                <ZoomControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                />
                { viewMode === 'H3_DENSITY' && <Legend maxCount={50} />}
                <DeckGL
                    viewState={viewState}
                    onViewStateChange={({ viewState }) => setViewState(viewState as any)}
                    controller={true}
                    layers={layers}
                    style={{ width: '100%', height: '100%' }}
                    getCursor={({ isHovering }) => isHovering ? 'pointer' : 'default'}
                    onInteractionStateChange={(interactionState) => {
                        if (!interactionState.isDragging && !interactionState.isZooming && !interactionState.isPanning) {
                            updateBounds();
                        }
                    }}
                >
                    <Map
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                        reuseMaps
                        {...viewState}

                        onMove={evt => setViewState(prev => ({
                            ...prev,
                            ...evt.viewState
                        }))}
                        onMoveEnd={(evt) => {
                            updateBounds(evt.target); 
                        }}
                        onLoad={(evt) => {
                            updateBounds(evt.target); 
                        }}
                    >
                        {viewMode === 'POINTS' && selectedBear &&
                            typeof selectedBear.latitude === 'number' &&
                            typeof selectedBear.longitude === 'number' &&
                            !isNaN(selectedBear.latitude) &&
                            !isNaN(selectedBear.longitude) && (
                                <Popup
                                    longitude={selectedBear.longitude}
                                    latitude={selectedBear.latitude}
                                    anchor="bottom"
                                    onClose={() => setSelectedBear(null)}
                                    closeOnClick={false}
                                    offset={10}
                                >
                                    <div style={{ color: 'black', padding: '5px' }}>
                                        <h3 className="font-bold text-sm">
                                            {selectedBear.name || "Gấu chưa có tên"}
                                        </h3>
                                        {selectedBear.description && (
                                            <p className="text-xs mt-1">{selectedBear.description}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Năm: {selectedBear.year || selectedYear}
                                        </p>
                                    </div>
                                </Popup>
                            )}
                    </Map>
                    {hoverInfo && <BearTooltip info={hoverInfo} />}
                </DeckGL>
            </div>
        </MapProvider>
    );
};

export default MapViz;