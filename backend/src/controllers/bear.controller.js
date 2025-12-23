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

// [GET] /bears/:id?lang={lang}
const getBearDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { lang } = req.query;
    const bearDetail = await bearService.getBearDetail(id, lang);
    res.json(bearDetail);
});

module.exports = {
    getBearYears,
    searchBear,
    getBearDetail
}