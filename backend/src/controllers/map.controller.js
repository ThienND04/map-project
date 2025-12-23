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


module.exports = {
    getLayerAsGeoJSON,
    getTile,
};