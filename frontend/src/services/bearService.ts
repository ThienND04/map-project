import { BearSighting } from '@/types/bear';

// Hàm sinh số ngẫu nhiên trong khoảng
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Hàm tạo dữ liệu giả cho 10 năm (khoảng 500 điểm mỗi năm)
export const generateMockData = (countPerYear: number = 200): BearSighting[] => {
    const data: BearSighting[] = [];
    const years = Array.from({ length: 10 }, (_, i) => 2014 + i); // 2014 -> 2023

    years.forEach(year => {
        for (let i = 0; i < countPerYear; i++) {
            // Toạ độ quanh quẩn ở Nhật Bản (Lat: 30-45, Lng: 130-145)
            // Tập trung nhiều ở Hokkaido (Lat > 41) để giống thật
            const isHokkaido = Math.random() > 0.3;
            const lat = isHokkaido ? randomInRange(41.5, 45.0) : randomInRange(33.0, 38.0);
            const lng = isHokkaido ? randomInRange(140.0, 145.0) : randomInRange(132.0, 140.0);

            data.push({
                fid: `${i}`,
                year: year,
                lat: lat,
                lng: lng,
                name: isHokkaido ? 'Hokkaido Region' : 'Honshu Region',
                description: 'Mock bear sighting data'
            });
        }
    });

    return data;
};

export const fetchBearsByYear = async (year: number): Promise<BearSighting[]> => {
    // Trong thực tế, đây là chỗ gọi fetch('api/bears?year=...')

    // giả lập delay 500ms cho giống mạng thật
    return new Promise((resolve) => {
        const allData = generateMockData();
        const filtered = allData.filter(d => d.year === year);
        setTimeout(() => resolve(filtered), 300);
    });
};

// export const fetchBearsByYear = async (year: number): Promise<BearSighting[]> => {
//     // Call backend API here
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bears?year=${year}`);
//     if (!response.ok) throw new Error('Failed to fetch');
//     return response.json();
// };

