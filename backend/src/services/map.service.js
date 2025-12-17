const axios = require('axios');
const db = require('../config/postgres');

const GEOSERVER_URL = 'http://localhost:8080/geoserver';
const WORKSPACE = 'map-project';

/**
 * Group 1: Visualization (GeoServer Proxy)
 */

const getLayerAsGeoJSON = async (layerName) => {
    const url = `${GEOSERVER_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${WORKSPACE}:${layerName}&outputFormat=application/json`;
    const response = await axios.get(url);
    return response.data;
};

const getTile = async (layerName, z, x, y) => {
    const url = `${GEOSERVER_URL}/gwc/service/tms/1.0.0/${WORKSPACE}:${layerName}@EPSG:900913@pbf/${z}/${x}/${y}.pbf`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
};

/**
 * Group 2: Interaction (PostGIS Direct Query)
 */

const getFeatureById = async (layerName, id) => {
    const query = `SELECT * FROM ${layerName} WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

const searchFeatures = async (q) => {
    try {
        const LAYER_NAME = 'gadm41_VNM_3';
        console.log(`Tìm kiếm với từ khóa: ${q}`);
        
        // Tạo bộ lọc: Tìm q trong Tên Tỉnh HOẶC Tên Huyện HOẶC Tên Xã
        // Sử dụng ILIKE để không phân biệt hoa thường
        const cqlFilter = `name_1 ILIKE '%${q}%' OR name_2 ILIKE '%${q}%' OR name_3 ILIKE '%${q}%'`;

        const response = await axios.get(`${GEOSERVER_URL}/${WORKSPACE}/ows`, {
            params: {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                typeName: `${WORKSPACE}:${LAYER_NAME}`,
                outputFormat: 'application/json',
                CQL_FILTER: cqlFilter,
                maxFeatures: 20 
            }
        });
        console.log("Request URL:", response.request.res.responseUrl);

        // Kiểm tra dữ liệu trả về
        if (!response.data || !response.data.features) return [];
        console.log("Dữ liệu tìm kiếm:", response.data);

        return response.data.features.map(feature => {
            const p = feature.properties;
            return {
                id: feature.id,
                // Tạo một cái tên đầy đủ để hiển thị cho đẹp
                // Ví dụ: "Yen Hoa, Cau Giay, Ha Noi"
                display_name: `${p.name_3}, ${p.name_2}, ${p.name_1}`,
                province: p.name_1,
                district: p.name_2,
                commune: p.name_3,
                geometry: feature.geometry
            };
        });

    } catch (error) {
        console.error("Lỗi tìm kiếm:", error.message);
        throw new Error('Search failed');
    }
};

const getNearbyFeatures = async (lat, lng, radius) => {
    const url = `${GEOSERVER_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&CQL_FILTER=DWITHIN(geom, POINT(${lng} ${lat}), ${radius}, meters)`;
    const response = await axios.get(url);
    return response.data.features.map(feature => ({
        id: feature.id,
        name: feature.properties.name,
        geometry: feature.geometry
    }));
};

const getFeaturesInPolygon = async (poly_id) => {
    const polygonUrl = `${GEOSERVER_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&CQL_FILTER=id=${poly_id}`;
    const polygonResponse = await axios.get(polygonUrl);
    const polygon = polygonResponse.data.features[0].geometry;

    const url = `${GEOSERVER_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&CQL_FILTER=WITHIN(geom, ${JSON.stringify(polygon)})`;
    const response = await axios.get(url);
    return response.data.features.map(feature => ({
        id: feature.id,
        name: feature.properties.name,
        geometry: feature.geometry
    }));
};

/**
 * Group 4: Metadata
 */

const getLayersConfig = async () => {
    // This could be a static JSON or a database query
    return [
        { id: 'gadm41_VNM_1', name: 'Vietnam Provinces', type: 'polygon', color: '#FF5733' },
        { id: 'points_of_interest', name: 'Points of Interest', type: 'point', color: '#33CFFF' },
    ];
};

module.exports = {
    getLayerAsGeoJSON,
    getTile,
    getFeatureById,
    searchFeatures,
    getNearbyFeatures,
    getFeaturesInPolygon,
    getLayersConfig,
};
