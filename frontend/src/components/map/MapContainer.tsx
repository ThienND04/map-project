"use client";

import React from "react";
import DeckGL from "@deck.gl/react";
import { _CameraLight, AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useMapData } from "@/hooks/useMapData";
import { INITIAL_VIEW_STATE } from "@/config/mapConfig";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapContainer() {
    const { data, isLoading, error } = useMapData();

    const layers = [
        data &&
        new GeoJsonLayer({
            id: "geojson-layer",
            data,
            pickable: true,
            stroked: true,
            filled: true,
            extruded: false,
            pointType: "circle",
            lineWidthScale: 20,
            lineWidthMinPixels: 2,
            getFillColor: [160, 160, 180, 100], // mau nen trong suot mot chut
            getLineColor: [255, 255, 51, 200],
            getPointRadius: 100,
            getLineWidth: 1,
            getElevation: 30,
        }),
    ].filter(Boolean);

    if (error) {
        return <div className="p-4 text-red-500">Error loading map data: {error.message}</div>;
    }

    return (
        <div className="relative w-full h-screen">
            {isLoading && (
                <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-md shadow-md">
                    Loading data...
                </div>
            )}
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
            >
                <Map
                    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                />
            </DeckGL>
        </div>
    );
}
