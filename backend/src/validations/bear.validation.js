const z = require('zod');

const searchBear = {
    query: z.object({
        q: z.string(),
        year: z.coerce.number().int().optional(),
        lang: z.string().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
    }),
};

const countBearInRange = {
    query: z.object({
        year: z.coerce.number().int().optional(),
        minLat: z.coerce.number().min(-90).max(90),
        maxLat: z.coerce.number().min(-90).max(90),
        minLng: z.coerce.number().min(-180).max(180),
        maxLng: z.coerce.number().min(-180).max(180),
        resolution: z.coerce.number().int().min(0).max(15),
    }),
};

const getBearDetail = {
    params: z.object({
        id: z.coerce.number().int(),
    }),
    query: z.object({
        lang: z.string().optional(),
    }),
};

module.exports = {
    searchBear,
    countBearInRange,
    getBearDetail,
};
