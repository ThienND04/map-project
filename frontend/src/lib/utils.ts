import { BearSighting } from '@/types/bear';
import { Language } from '@/lib/translations';

export const getH3Resolution = (zoom: number): number => {
    if (zoom <= 4) return 2; 
    if (zoom <= 5) return 3;
    if (zoom <= 6) return 4; 
    if (zoom <= 7) return 5; 
    if (zoom <= 8) return 6; 
    if (zoom <= 10) return 7;
    if (zoom <= 12) return 8;
    return 9; 
};


export const getBearName = (bear: BearSighting, lang: Language): string => {
    const nameKey = `name_${lang}` as keyof BearSighting;
    return (bear[nameKey] as string) || bear.name || '';
};


export const getBearDescription = (bear: BearSighting, lang: Language): string => {
    const descKey = `description_${lang}` as keyof BearSighting;
    return (bear[descKey] as string) || bear.description || '';
};