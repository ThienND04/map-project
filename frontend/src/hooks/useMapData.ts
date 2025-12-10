"use client";

import { useState, useEffect, use } from "react";
import { MAP_DATA_ENDPOINT } from "@/config/mapConfig";
import { FeatureCollection } from "geojson";
import useSWR from "swr";

export function useMapData(layerName: string) {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/map/layers/${layerName}/geojson`, async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    });
    return { data, isLoading, error };
}
