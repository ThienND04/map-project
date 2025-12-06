const axios = require('axios');
const db = require('../utils/db'); // Assuming you have a db connection utility

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
  const query = `SELECT id, name, ST_AsGeoJSON(geom) as geometry FROM your_table WHERE name ILIKE $1`;
  const { rows } = await db.query(query, [`%${q}%`]);
  return rows;
};

/**
 * Group 3: Spatial Analysis (PostGIS Spatial Functions)
 */

const getNearbyFeatures = async (lat, lng, radius) => {
  const query = `
    SELECT id, name, ST_AsGeoJSON(geom) as geometry
    FROM your_table
    WHERE ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )
  `;
  const { rows } = await db.query(query, [lng, lat, radius]);
  return rows;
};

const getFeaturesInPolygon = async (poly_id) => {
    const query = `
      SELECT p.id, p.name, ST_AsGeoJSON(p.geom) as geometry
      FROM points_table p
      JOIN polygons_table poly ON ST_Contains(poly.geom, p.geom)
      WHERE poly.id = $1;
    `;
    const { rows } = await db.query(query, [poly_id]);
    return rows;
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
