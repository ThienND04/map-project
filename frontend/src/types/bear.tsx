export interface BearSighting {
    fid: string;
    latitude: number; // latitude
    longitude: number; // longitude
    year: number;
    name: string;
    description: string;
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}