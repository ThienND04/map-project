const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    message: { 
        status: 429, 
        message: "Bạn thao tác quá nhanh, vui lòng thử lại sau 1 phút." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    apiLimiter,
};