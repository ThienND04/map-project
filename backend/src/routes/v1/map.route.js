const express = require('express');
const mapController = require('../../controllers/map.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Map
 *   description: Các API liên quan đến bản đồ, GeoServer và phân tích không gian
 */

/**
 * @swagger
 * /map/layers/{layerName}/geojson:
 *   get:
 *     summary: Lấy dữ liệu GeoJSON của một lớp bản đồ
 *     tags: [Map]
 *     parameters:
 *       - in: path
 *         name: layerName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên layer (ví dụ gadm41_VNM_1)
 *     responses:
 *       200:
 *         description: GeoJSON FeatureCollection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/layers/:layerName/geojson', mapController.getLayerAsGeoJSON);

/**
 * @swagger
 * /map/tiles/{layerName}/{z}/{x}/{y}.pbf:
 *   get:
 *     summary: Lấy Vector Tiles (MVT) để render hiệu năng cao
 *     tags: [Map]
 *     parameters:
 *       - in: path
 *         name: layerName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: z
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: x
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: y
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Binary PBF data
 *         content:
 *           application/x-protobuf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/tiles/:layerName/:z/:x/:y.pbf', mapController.getTile);

// Group 2: Interaction
router.get('/features/:layerName/:id', mapController.getFeatureById);
router.get('/search', mapController.searchFeatures);

// Group 3: Spatial Analysis
router.get('/analysis/nearby', mapController.getNearbyFeatures);
router.get('/analysis/in-polygon', mapController.getFeaturesInPolygon);

// Group 4: Metadata
router.get('/config/layers', mapController.getLayersConfig);

module.exports = router;