const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bearService = require('../services/bear.service');

// [GET] /bears/years
const getBearYears = catchAsync(async (req, res) => {
    const years = await bearService.getBearYears();
    res.json(years);
});

// [GET] /bears/search?q={query}&year={year}&lang={lang}&page={page}&limit={limit}
const searchBear = catchAsync(async (req, res) => {
    const { q, year, lang, page, limit } = req.query;
    if (!q) return res.status(400).json({ message: "Thiếu từ khóa q" });
    const results = await bearService.search(q, year, lang, page, limit);
    res.json(results);
});

// [GET] /bears/h3?year={year}&minLat={minLat}&maxLat={maxLat}&minLng={maxLng}&resolution={resolution}
const countBearInRange = catchAsync(async (req, res) => {
    console.log("countBearInRange called with query:", req.query);
    const { year, minLat, maxLat, minLng, maxLng, resolution } = req.query;
    const results = await bearService.countInRange(year, minLat, maxLat, minLng, maxLng, resolution);
    res.json(results);
});

// [GET] /bears/:id?lang={lang}
const getBearDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { lang } = req.query;
    const bearDetail = await bearService.getBearDetail(id, lang);
    res.json(bearDetail);
});

module.exports = {
    getBearYears,
    countBearInRange,
    searchBear,
    getBearDetail
}