'use client';

import React, { useState } from 'react';
import Map from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { BearSighting } from '@/types/bear';
import 'mapbox-gl/dist/mapbox-gl.css';
import BearTooltip from '@/components/map/BearTooltip';
import { info } from 'console';
import { GeoJsonLayer, ScatterplotLayer } from 'deck.gl';

// View mặc định nhìn vào Nhật Bản
const INITIAL_VIEW_STATE = {
    longitude: 138.2529,
    latitude: 36.2048,
    zoom: 5,
    pitch: 0,
    bearing: 0
};

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
    console.log('Selected Year in MapViz:', selectedYear);

    const DATA_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/map/tiles/japan_bears_${selectedYear}/{z}/{x}/{y}.pbf`;
    // const DATA_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/map/tiles/{z}/{x}/{y}?year=${selectedYear}`;

    const layers = [
        new MVTLayer<BearSighting>({
            id: `bear-mvt-layer-${selectedYear}`,
            data: DATA_URL,

            binary: false,
            
            // 1. Sửa lỗi warning: dùng getPointRadius thay vì getRadius
            // Nhưng khi dùng renderSubLayers thì cái này không còn quan trọng ở layer cha nữa
            minZoom: 0,
            maxZoom: 23,
            
            // 2. QUAN TRỌNG NHẤT: Ép kiểu hiển thị cho dữ liệu Point
            // Nếu không có hàm này, MVTLayer sẽ bối rối không biết vẽ điểm thế nào
            renderSubLayers: (props) => {
                // Chỉ vẽ khi tile có dữ liệu
                if (!props.data) return null;
            
                return new GeoJsonLayer(props, {
                    // 1. Kế thừa props là BẮT BUỘC (chứa ma trận biến đổi tọa độ)
                    ...props,
                    
                    id: `${props.id}-geojson`,
                    data: props.data,
                    
                    // 2. Styling cho điểm (Point)
                    pointRadiusUnits: 'pixels', // Dùng pixels cho dễ kiểm soát size
                    getPointRadius: 4,          // Bán kính 4px
                    
                    // Màu sắc
                    getFillColor: [255, 140, 0], // Màu cam
                    getLineColor: [0, 0, 0],
                    getLineWidth: 1,
                    
                    // 3. QUAN TRỌNG: Không cần khai báo getPosition
                    // GeoJsonLayer tự động hiểu d.geometry.coordinates + Ma trận tile
                    
                    // Tương tác
                    pickable: true,
                    autoHighlight: true,
                });
            },

            // 3. Xử lý Hover (Giữ nguyên logic của bạn)
            pickable: true,
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
            }
        })
    ];

    return (
        <div className="relative w-full h-screen">
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                style={{ width: '100%', height: '100%' }} // Đảm bảo full màn hình
                getCursor={({isHovering}) => isHovering ? 'pointer' : 'default'}
            >
                <Map
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    reuseMaps // Tối ưu hiệu năng khi re-render
                />
                {hoverInfo && <BearTooltip info={hoverInfo} />}
            </DeckGL>
        </div>
    );
};

export default MapViz;