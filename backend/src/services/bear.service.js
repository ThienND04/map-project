const axios = require('axios');
const db = require('../config/postgres');

const getYears = async () => {
    const query = 'SELECT DISTINCT "Year" FROM japan_bears ORDER BY "Year" desc;';
    return db.query(query).then(res => res.rows.map(row => row.Year));
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
            ST_X(geom) as lng, 
            ST_Y(geom) as lat,
            ${nameColumn} as name, 
            ${descColumn} as description
        FROM japan_bears 
        WHERE (
            ${nameColumn} ILIKE $1 OR 
            ${descColumn} ILIKE $1
        )
    `;

    const params = [`%${keyword}%`];
    let paramIndex = 2; // Start with 2 because $1 is used for keyword

    if (year) {
        query += ` AND year = $${paramIndex ++}`;
        params.push(year);
        console.log(paramIndex)
    }
    
    query += `ORDER BY year desc
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    console.log("Executing Search Query:", query, "with params:", params);

    const result = await db.query(query, params);
    console.log("Search Query Result:", result.rows);
    return result.rows;
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
            ST_X(geom) as lng, 
            ST_Y(geom) as lat,
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
    getBearDetail,
    createBear
};