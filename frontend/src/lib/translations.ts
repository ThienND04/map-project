export type Language = 'vi' | 'en' | 'ja';

export const translations = {
    vi: {
        // YearSelector
        yearSelector: {
            dataYear: 'Dữ liệu năm',
            dragToSee: 'Kéo để xem sự thay đổi phân bổ gấu theo thời gian',
        },
        // SearchBar
        searchBar: {
            searchPlaceholder: 'Tìm kiếm ...',
            collapse: 'Thu gọn',
            expand: 'Mở rộng',
            noResults: 'Không tìm thấy kết quả phù hợp.',
            unnamedLocation: 'Vị trí không tên',
            bearDataYear: 'Dữ liệu gấu năm',
        },
        // Legend
        legend: {
            title: 'Mật độ gấu (H3)',
            low: 'Thấp',
            medium: 'Trung bình',
            high: 'Cao',
            note: '*Dựa trên số lượng gấu trong vùng lục giác',
        },
        // MapViz / Popup
        map: {
            unnamedBear: 'Gấu chưa có tên',
            year: 'Năm',
        },
        // ViewModeControl
        viewMode: {
            points: 'Điểm',
            h3Density: 'Mật độ H3',
        },
        // BearTooltip
        tooltip: {
            bearCount: 'Số lượng gấu',
            details: 'Chi tiết',
        },
        // Common
        common: {
            loading: 'Đang tải...',
            error: 'Có lỗi xảy ra',
        },
    },
    en: {
        // YearSelector
        yearSelector: {
            dataYear: 'Data year',
            dragToSee: 'Drag to see bear distribution changes over time',
        },
        // SearchBar
        searchBar: {
            searchPlaceholder: 'Search ...',
            collapse: 'Collapse',
            expand: 'Expand',
            noResults: 'No matching results found.',
            unnamedLocation: 'Unnamed location',
            bearDataYear: 'Bear data year',
        },
        // Legend
        legend: {
            title: 'Bear Density (H3)',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            note: '*Based on number of bears in hexagonal area',
        },
        // MapViz / Popup
        map: {
            unnamedBear: 'Unnamed bear',
            year: 'Year',
        },
        // ViewModeControl
        viewMode: {
            points: 'Points',
            h3Density: 'H3 Density',
        },
        // BearTooltip
        tooltip: {
            bearCount: 'Bear count',
            details: 'Details',
        },
        // Common
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
        },
    },
    ja: {
        // YearSelector
        yearSelector: {
            dataYear: 'データ年',
            dragToSee: 'ドラッグして時間経過によるクマの分布変化を確認',
        },
        // SearchBar
        searchBar: {
            searchPlaceholder: '検索 ...',
            collapse: '折りたたむ',
            expand: '展開',
            noResults: '一致する結果が見つかりません。',
            unnamedLocation: '名前のない場所',
            bearDataYear: 'クマデータ年',
        },
        // Legend
        legend: {
            title: 'クマ密度 (H3)',
            low: '低',
            medium: '中',
            high: '高',
            note: '*六角形エリア内のクマの数に基づく',
        },
        // MapViz / Popup
        map: {
            unnamedBear: '名前のないクマ',
            year: '年',
        },
        // ViewModeControl
        viewMode: {
            points: 'ポイント',
            h3Density: 'H3密度',
        },
        // BearTooltip
        tooltip: {
            bearCount: 'クマの数',
            details: '詳細',
        },
        // Common
        common: {
            loading: '読み込み中...',
            error: 'エラーが発生しました',
        },
    },
} as const;

export type TranslationKeys = typeof translations.vi;
