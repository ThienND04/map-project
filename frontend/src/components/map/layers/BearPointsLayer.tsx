import { MVTLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { BearSighting } from '@/types/bear';
import Colors from '@/constants/colors';

interface Props {
    selectedYear: number;
    selectedBear: BearSighting | null;
    searchResults: BearSighting[];
    onHover: (info: any) => void;
    onClick: (info: any) => void;
}

export const getBearPointsLayer = (props: Props) => {
    const { selectedYear, selectedBear, searchResults, onHover, onClick } = props;
    const DATA_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/map/tiles/japan_bears_${selectedYear}/{z}/{x}/{y}.pbf`;

    return new MVTLayer<BearSighting>({
        id: `bear-mvt-layer-${selectedYear}`,
        data: DATA_URL,
        binary: true,
        minZoom: 0,
        maxZoom: 23,
        pickable: true,
        onHover,
        onClick,
        
        renderSubLayers: (subProps) => {
            if (!subProps.data) return null;
            return new GeoJsonLayer(subProps, {
                ...subProps,
                id: `${subProps.id}-geojson`,
                data: subProps.data,
                pointRadiusUnits: 'pixels',
                getPointRadius: 6,
                getFillColor: (d: any) => {
                    if (selectedBear && d.properties.fid === parseInt(selectedBear.fid)) return new Uint8ClampedArray(Colors.COLOR_SELECTED);
                    const isFound = searchResults.some(result => parseInt(result.fid) === d.properties.fid);
                    return isFound ? new Uint8ClampedArray(Colors.COLOR_FOUND) : new Uint8ClampedArray(Colors.COLOR_DEFAULT);
                },
                getLineColor: [0, 0, 0],
                getLineWidth: 1,
                pickable: true,
                autoHighlight: true,
            });
        },
        updateTriggers: {
            getFillColor: [selectedBear, searchResults]
        }
    });
};