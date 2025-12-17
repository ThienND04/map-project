const catchAsync = require("../utils/catchAsync");
const httpStatus = require('http-status');
const db = require('../config/postgres');

// [GET] /health
const healthCheck = catchAsync(async (req, res) => {
    const result = await db.query('SELECT NOW()');
    res.status(httpStatus.default.OK).send({
      status: 'OK',
      message: 'Database connection is healthy',
      time: result.rows[0].now
    });
});

module.exports = {
    healthCheck,
};