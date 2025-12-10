const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const mapService = require('../services/map.service');

// [GET] /map/layers/:layerName/geojson 
const getLayerAsGeoJSON = catchAsync(async (req, res) => {
    const { layerName } = req.params;
    const geojsonData = await mapService.getLayerAsGeoJSON(layerName);
    res.json(geojsonData);
});

// [GET] /map/tiles/:layerName/:z/:x/:y.pbf
const getTile = catchAsync(async (req, res) => {
    const { layerName, z, x, y } = req.params;
    const tileData = await mapService.getTile(layerName, z, x, y);
    res.setHeader('Content-Type', 'application/x-protobuf');
    res.status(httpStatus.default.OK).send(tileData);
});

const getFeatureById = catchAsync(async (req, res) => {
    const { layerName, id } = req.params;
    const feature = await mapService.getFeatureById(layerName, id);
    res.json(feature);
});

const searchFeatures = catchAsync(async (req, res) => {
    const { q } = req.query;
    const features = await mapService.searchFeatures(q);
    res.json(features);
});

const getNearbyFeatures = catchAsync(async (req, res) => {
    const { lat, lng, radius } = req.query;
    const features = await mapService.getNearbyFeatures(lat, lng, radius);
    res.json(features);
});

const getFeaturesInPolygon = catchAsync(async (req, res) => {
    const { poly_id } = req.query;
    const features = await mapService.getFeaturesInPolygon(poly_id);
    res.json(features);
});

const getLayersConfig = catchAsync(async (req, res) => {
    const layers = await mapService.getLayersConfig();
    res.json(layers);
});

module.exports = {
    getLayerAsGeoJSON,
    getTile,
    getFeatureById,
    searchFeatures,
    getNearbyFeatures,
    getFeaturesInPolygon,
    getLayersConfig,
};