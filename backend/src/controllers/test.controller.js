const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const geoserverTest = require("../services/geoserver.service");


const test1 = catchAsync(async (req, res) => {
    console.log("Debug httpStatus:", httpStatus);
    const result = await geoserverTest();
    console.log("result: ", result);
    console.log(`status cpde: ${httpStatus}`);
    res.status(httpStatus.default.OK).send(JSON.stringify(result));
})

module.exports = {test1};