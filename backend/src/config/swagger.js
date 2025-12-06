const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GIS Map API Documentation',
            version: '1.0.0',
            description: 'API tài liệu cho dự án Web GIS (Node.js + GeoServer + PostGIS)',
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Development Server',
            },
        ],
    },
    apis: ['./src/routes/v1/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;