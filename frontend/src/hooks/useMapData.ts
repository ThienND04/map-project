"use client";

import { useState, useEffect } from "react";
import { MAP_DATA_ENDPOINT } from "@/config/mapConfig";
import { FeatureCollection } from "geojson";

interface UseMapDataResponse {
    data: FeatureCollection | null;
    isLoading: boolean;
    error: Error | null;
}

export function useMapData(): UseMapDataResponse {
    const [data, setData] = useState<FeatureCollection | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(MAP_DATA_ENDPOINT);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const geoJsonData: FeatureCollection = await response.json();
                setData(geoJsonData);
            } catch (e) {
                setError(e instanceof Error ? e : new Error("An unknown error occurred"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
}
