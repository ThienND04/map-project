"use client";

import React, { useCallback, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { _CameraLight, AmbientLight, PointLight, LightingEffect, MapViewState, FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MVTLayer } from "@deck.gl/geo-layers";
import { Map } from "react-map-gl";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import { useMapData } from "@/hooks/useMapData";
import { INITIAL_VIEW_STATE } from "@/config/mapConfig";
import MapControls from "../ui/MapControls";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const LAYER_CONFIGS = [
    {
        id: "province-layer",
        type: "geojson",
        label: "Cấp Tỉnh",
        minZoom: 0,
        maxZoom: 10,
        dataSource: "gadm41_VNM_1",
        color: [80, 90, 100, 160],
        lineColor: [255, 215, 0, 200],
    },
    {
        id: "district-mvt-layer",
        type: "mvt",
        getPolygonOffset: ({ layerIndex }: { layerIndex: number }) => [0, layerIndex * 100], //Loại bỏ các polygon quá nhỏ (nhỏ hơn 1px) để GPU đỡ phải vẽ thừa
        label: "Cấp Huyện",
        minZoom: 10,
        maxZoom: 13,
        url: `${API_BASE}/map/tiles/gadm41_VNM_2/{z}/{x}/{-y}.pbf`,
        color: [60, 100, 120, 160],
        lineColor: [255, 215, 0, 200],
    },
    {
        id: "commune-mvt-layer",
        type: "mvt",
        getPolygonOffset: ({ layerIndex }: { layerIndex: number }) => [0, layerIndex * 100], //Loại bỏ các polygon quá nhỏ (nhỏ hơn 1px) để GPU đỡ phải vẽ thừa
        label: "Cấp Xã",
        minZoom: 13,
        maxZoom: 20,
        url: `${API_BASE}/map/tiles/gadm41_VNM_3/{z}/{x}/{-y}.pbf`,
        color: [160, 160, 180, 100],
        lineColor: [255, 215, 0, 200],
    }
];

export default function MapContainer() {
    const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE as MapViewState);
    const zoomInt = Math.floor(viewState.zoom);

    const { data: provinceData } = useMapData(process.env.PROVINCE_LAYER || "gadm41_VNM_1");
    const dataMap: Record<string, any> = {
        "province-layer": provinceData,
    };

    const layers = useMemo(() => {
        return LAYER_CONFIGS.map((config) => {
            const isVisible = viewState.zoom >= config.minZoom && viewState.zoom < config.maxZoom;

            if (!isVisible) return null;

            // Render MVT Layer
            if (config.type === "mvt") {
                return new MVTLayer({
                    id: config.id,
                    data: config.url,
                    pickable: true,
                    stroked: true,
                    filled: true,
                    extruded: false,
                    binary: true,
                    lineWidthUnits: 'pixels',
                    refinementStrategy: 'no-overlap',
                    maxRequests: 5,
                    getLineWidth: 1,
                    getLineColor: config.lineColor as [number, number, number, number],
                    getFillColor: config.color as [number, number, number, number],
                    onHover: (info) => console.log(`${config.label} Info:`, info.object?.properties),
                    minZoom: config.minZoom,
                    maxZoom: config.maxZoom,
                    maxCacheSize: 300
                });
            }

            // Render GeoJSON Layer
            if (config.type === "geojson" && dataMap[config.id]) {
                return new GeoJsonLayer({
                    id: config.id,
                    data: dataMap[config.id],
                    pickable: true,
                    stroked: true,
                    filled: true,
                    extruded: false,
                    lineWidthUnits: 'pixels',
                    getLineWidth: 1.5,
                    getLineColor: config.lineColor as [number, number, number, number],
                    getFillColor: config.color as [number, number, number, number],
                });
            }

            return null;
        }).filter(Boolean); // Lọc bỏ các giá trị null
    }, [zoomInt, provinceData]);

    const currentLayerLabel = LAYER_CONFIGS.find(
        c => viewState.zoom >= c.minZoom && viewState.zoom < c.maxZoom
    )?.label || "Unknown";

    const handleZoom = useCallback((amount: number) => {
        setViewState(current => ({
            ...current,
            // Cộng/Trừ zoom và giới hạn trong khoảng 0-22
            zoom: Math.min(Math.max(current.zoom + amount, 0), 22),
            
            // QUAN TRỌNG: Tạo hiệu ứng trôi mượt mà trong 300ms
            transitionDuration: 300,
            transitionInterpolator: new FlyToInterpolator()
        }));
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-100">
            {/* <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded shadow font-mono text-sm">
                <p>Zoom: <b>{viewState.zoom.toFixed(2)}</b></p>
                <p>Current Layer: <b className="text-green-600">{currentLayerLabel}</b></p>
            </div> */}

            <DeckGL
                viewState={viewState}
                onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
                controller={{
                    doubleClickZoom: true,
                    touchRotate: true,
                    // inertia: true, 
                    scrollZoom: {
                        speed: 0.05, 
                        smooth: true, 
                    },
                    // Tinh chỉnh quán tính kéo thả
                    // dragPan: { inertia: 500 }
                }}
                useDevicePixels={false}
                layers={layers}
            >
                <Map
                    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                />
            </DeckGL>
            <div className="absolute bottom-10 right-4 z-10">
                <MapControls 
                    onZoomIn={() => handleZoom(1)} 
                    onZoomOut={() => handleZoom(-1)} 
                />
            </div>
        </div>
    );
}
