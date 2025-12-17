const axios = require("axios");

const GEOSERVER_URL = "http://localhost:8080/geoserver";
const WORKSPACE = 'map-project';
const layerName = "gadm41_VNM_1"

const geoserverTest = async () => {
    try {
        // Gọi WFS để lấy GeoJSON
        const url = `${GEOSERVER_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${WORKSPACE}:${layerName}&outputFormat=application/json`;

        console.log("Calling GeoServer:", url); // Log ra để debug nếu lỗi

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching map data");
    }
}

module.exports = geoserverTest;

