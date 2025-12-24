import { H3HexagonLayer } from '@deck.gl/geo-layers';

interface H3Props {
    selectedYear: number;
    resolution: number;
    bounds: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
    } | null;
    onHover: (info: any) => void;
}

export const getBearH3Layer = (props: H3Props) => {
    console.log('Creating Bear H3 Layer with props:', props);
    const { selectedYear, resolution, bounds, onHover } = props;

    if (!bounds) return null;
    const { minLat, maxLat, minLng, maxLng } = bounds;

    const DATA_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/bears/h3?year=${selectedYear}&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}&resolution=${resolution}`;

    return new H3HexagonLayer({
        id: `bear-h3-layer-${selectedYear}`,
        data: DATA_URL,
        pickable: true,
        wireframe: false,
        filled: true,
        extruded: true, 
        elevationScale: 20,

        getHexagon: (d: any) => d.hex,
        getFillColor: (d: any) => [255, (1 - d.count / 50) * 255, 0], //   mau: do -> vang
        getElevation: (d: any) => d.count,

        updateTriggers: {
            getFillColor: [resolution]
        },

        onHover,
    });
};