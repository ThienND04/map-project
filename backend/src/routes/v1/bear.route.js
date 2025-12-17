const express = require('express');
const bearController = require('../../controllers/bear.controller');

const router = express.Router();

router.get('/years', bearController.getBearYears);
router.get('/search', bearController.searchBear);
router.get('/:id', bearController.getBearDetail);

module.exports = router;