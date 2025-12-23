import { BearSighting } from '@/types/bear';

export interface SearchBarProps {
    year: number;
    lang?: string;
    onSelectLocation: (location: BearSighting) => void;
    onSearchComplete?: (results: BearSighting[]) => void;
}