'use client';

import React, { useCallback, useState } from 'react';
import Map, { MapProvider, Popup } from 'react-map-gl';
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
    console.log("Search results state:", searchResults);

    const [viewState, setViewState] = useState({
        longitude: 138.2529,
        latitude: 36.2048,
        zoom: 5,
        pitch: 0,
        bearing: 0,
        transitionDuration: 0, // Mặc định không transition
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
                // Chỉ vẽ khi tile có dữ liệu
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


                    // Tương tác
                    pickable: true,
                    autoHighlight: true,
                });
            },

            // 3. Xử lý Hover (Giữ nguyên logic của bạn)
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
                    // Log ra để debug xem dữ liệu có những trường nào
                    // console.log("Hover data:", info.object); 

                    setHoverInfo({
                        object: {
                            ...info.object.properties, // Lấy id, year... từ properties
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

    return (
        <MapProvider>
            <div className="relative w-full h-screen">
                <SearchBar
                    year={selectedYear}
                    onSelectLocation={handleSelectLocation}
                    onSearchComplete={(results) => setSearchResults(results)}
                />
                <DeckGL
                    initialViewState={viewState}
                    controller={true}
                    layers={layers}
                    style={{ width: '100%', height: '100%' }}
                    getCursor={({ isHovering }) => isHovering ? 'pointer' : 'default'}
                >
                    <Map
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                        reuseMaps

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