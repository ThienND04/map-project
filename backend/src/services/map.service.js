const axios = require('axios');
const db = require('../config/postgres');

const getLayerAsGeoJSON = async (layerName) => {
    const url = `${process.env.GEOSERVER_URL}/${process.env.WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${process.env.WORKSPACE}:${layerName}&outputFormat=application/json`;
    const response = await axios.get(url);
    return response.data;
};

const getTile = async (layerName, z, x, y) => {
    // đảo ngược trục Y
    const tmsY = (1 << z) - y - 1;
    const url = `${process.env.GEOSERVER_URL}/gwc/service/tms/1.0.0/${process.env.WORKSPACE}:${layerName}@EPSG:900913@pbf/${z}/${x}/${tmsY}.pbf`;
    console.log("Fetching tile from URL:", url);
    const response = await axios.get(url, 
        { 
            responseType: 'arraybuffer',
            decompress: false,
            headers: {
                'Accept-Encoding': 'identity', 
                'User-Agent': 'Node.js Proxy'
            }
        });
    return response.data;
};


module.exports = {
    getLayerAsGeoJSON,
    getTile,
};
