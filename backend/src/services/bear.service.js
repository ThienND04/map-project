const axios = require('axios');
const db = require('../config/postgres');
const h3 = require('h3-js');

const getYears = async () => {
    const query = 'SELECT DISTINCT year FROM japan_bears ORDER BY year desc;';
    return db.query(query).then(res => res.rows.map(row => row.year));
};

const search = async (
    keyword,
    year,
    lang = 'ja',
    page = 1,
    limit = 10
) => {
    let nameColumn = "name";
    let descColumn = "description";

    if (lang !== "ja") {
        nameColumn += `_${lang}`;
        descColumn += `_${lang}`;
    }

    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            fid, 
            year, 
            ST_X(geom) as longitude, 
            ST_Y(geom) as latitude,
            ${nameColumn} as name, 
            ${descColumn} as description,
            COUNT(*) OVER() as total_count
        FROM japan_bears 
        WHERE (
            ${nameColumn} ILIKE $1 OR 
            ${descColumn} ILIKE $1
        )
    `;

    const params = [`%${keyword}%`];
    let paramIndex = 2; 

    if (year) {
        query += ` AND year = $${paramIndex++}`;
        params.push(year);
        console.log(paramIndex)
    }

    query += ` ORDER BY year desc
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    console.log("Executing Search Query:", query, "with params:", params);

    const result = await db.query(query, params);
    console.log("Search Query Result:", result.rows);
    return result.rows;
};

const countInRange = async (
    year, minLat, maxLat, minLng, maxLng, resolution
) => {

    let query = `
        SELECT ST_X(geom) as lng, ST_Y(geom) as lat 
        FROM japan_bears 
        WHERE year = $1
        AND geom && ST_MakeEnvelope($2, $3, $4, $5, 4326)
    `;
    const params = [
        year,
        parseFloat(minLng),
        parseFloat(minLat),
        parseFloat(maxLng),
        parseFloat(maxLat)
    ];

    const result = await db.query(query, params);
    console.log("Search Query Result:", result.rows);

    const rawPoints = result.rows;

    const hexMap = {};
    const resLevel = parseInt(resolution); 

    rawPoints.forEach((point) => {
        const hexId = h3.latLngToCell(point.lat, point.lng, resLevel);
        hexMap[hexId] = (hexMap[hexId] || 0) + 1;
    });

    const aggregatedData = Object.entries(hexMap).map(([hex, count]) => ({
        hex,   
        count 
    }));

    return aggregatedData;
};

const getBearDetail = async (id, lang = "ja") => {
    let nameColumn = "name";
    let descColumn = "description";
    if (lang !== "ja") {
        nameColumn += `_${lang}`;
        descColumn += `_${lang}`;
    }
    const query = `
        SELECT 
            fid, 
            year, 
            ST_X(geom) as longitude, 
            ST_Y(geom) as latitude,
            ${nameColumn} as name,
            ${descColumn} as description
        FROM japan_bears 
        WHERE fid = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const createBear = async (data) => {
    const translated = await translateBearData(data.name, data.description);

    const name_en = translated?.name_en || '';
    const desc_en = translated?.description_en || '';
    const name_vi = translated?.name_vi || '';
    const desc_vi = translated?.description_vi || '';

    const query = `
        INSERT INTO bears (name, description, name_en, description_en, name_vi, description_vi, year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const values = [
        data.name,
        data.description,
        name_en, desc_en, name_vi, desc_vi,
        data.year
    ];

    const res = await db.query(query, values);
    return res.rows[0];
};


module.exports = {
    getBearYears: getYears,
    search,
    countInRange,
    getBearDetail,
    createBear
};