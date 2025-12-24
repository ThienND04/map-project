'use client';

import React, { useCallback, useState } from 'react';
import Map, { MapProvider, NavigationControl, Popup } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { BearSighting } from '@/types/bear';
import 'mapbox-gl/dist/mapbox-gl.css';
import BearTooltip from '@/components/map/BearTooltip';
import { info } from 'console';
import { GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { FlyToInterpolator } from '@deck.gl/core';
import SearchBar from '@/components/ui/SearchBar';
import Colors from '@/constants/colors';
import { ZoomControls } from '../ui/ZoomControls';

interface MapVizProps {
    selectedYear: number;
}

interface HoverInfo {
    object: BearSighting;
    x: number;
    y: number;
}

const MapViz: React.FC<MapVizProps> = ({ selectedYear }) => {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
    const [selectedBear, setSelectedBear] = useState<BearSighting | null>(null);
    const [searchResults, setSearchResults] = useState<BearSighting[]>([]);

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

    const DATA_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/map/tiles/japan_bears_${selectedYear}/{z}/{x}/{y}.pbf`;

    const layers = [
        new MVTLayer<BearSighting>({
            id: `bear-mvt-layer-${selectedYear}`,
            data: DATA_URL,

            binary: true,

            minZoom: 0,
            maxZoom: 23,

            renderSubLayers: (props) => {
                if (!props.data) return null;

                return new GeoJsonLayer(props, {
                    ...props,

                    id: `${props.id}-geojson`,
                    data: props.data,

                    pointRadiusUnits: 'pixels', 
                    getPointRadius: 4,       

                    getFillColor: d => {
                        if (selectedBear && d.properties.fid === selectedBear.fid) {
                            return new Uint8ClampedArray(Colors.COLOR_SELECTED);
                        }

                        const isFound = searchResults.some(result => parseInt(result.fid) === d.properties.fid);
                        if (isFound) {
                            return new Uint8ClampedArray(Colors.COLOR_FOUND);
                        }

                        return new Uint8ClampedArray(Colors.COLOR_DEFAULT);
                    },
                    getLineColor: [0, 0, 0],
                    getLineWidth: 1,

                    pickable: true,
                    autoHighlight: true,
                });
            },

            pickable: true,
            onClick: (info) => {
                if (info.object && info.coordinate) {

                    const [lng, lat] = info.coordinate;

                    const bearData: BearSighting = {
                        ...info.object.properties,

                        longitude: lng,
                        latitude: lat,
                    };

                    console.log("Dữ liệu gấu đã xử lý:", bearData);
                    if (selectedBear && bearData.fid === selectedBear.fid) {
                        setSelectedBear(null);
                        return;
                    }
                    setSelectedBear(bearData);
                } else {
                    setSelectedBear(null);
                }
            },
            onHover: (info) => {
                if (info.object) {

                    setHoverInfo({
                        object: {
                            ...info.object.properties, 
                            latitude: info.coordinate?.[1] || 0,
                            longitude: info.coordinate?.[0] || 0
                        } as BearSighting,
                        x: info.x,
                        y: info.y
                    });
                } else {
                    setHoverInfo(null);
                }
            },
            updateTriggers: {
                getFillColor: [selectedBear, searchResults]
            }
        })
    ];

    const handleZoomIn = () => {
        setViewState(v => ({
            ...v,
            zoom: Math.min(v.zoom + 1, 20), // Max zoom 20
            transitionDuration: 300,        // Hiệu ứng mượt trong 300ms
            transitionInterpolator: new FlyToInterpolator()
        }));
    };

    const handleZoomOut = () => {
        setViewState(v => ({
            ...v,
            zoom: Math.max(v.zoom - 1, 0),  // Min zoom 0
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
                <ZoomControls 
                    onZoomIn={handleZoomIn} 
                    onZoomOut={handleZoomOut}
                />
                <DeckGL
                    viewState={viewState}
                    onViewStateChange={({ viewState }) => setViewState(viewState as any)}
                    controller={true}
                    layers={layers}
                    style={{ width: '100%', height: '100%' }}
                    getCursor={({ isHovering }) => isHovering ? 'pointer' : 'default'}
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
                    >
                        {selectedBear &&
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