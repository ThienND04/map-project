export interface BearSighting {
    fid: string;
    latitude: number; // latitude
    longitude: number; // longitude
    year: number;
    name: string;
    description: string;
    // Multi-language fields
    name_vi?: string;
    name_en?: string;
    name_ja?: string;
    description_vi?: string;
    description_en?: string;
    description_ja?: string;
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}

export interface HoverInfo {
    object: BearSighting;
    x: number;
    y: number;
    type: string;
}

export type MapViewMode = 'POINTS' | 'H3_DENSITY';