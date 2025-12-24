import { BearSighting } from '@/types/bear';
import axiosClient from '@/lib/axiosClient';

export const searchBearData = async (query: string, year: number, lang: string, page: number = 1, limit: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/bears/search?q=${encodeURIComponent(query)}&year=${year}&lang=${lang}&page=${page}&limit=${limit}`;

    const res = await axiosClient.get(url);
    // const res = await fetch(url);
    const data = res.data;
    return data;
}