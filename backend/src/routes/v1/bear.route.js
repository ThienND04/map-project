const express = require('express');
const validate = require('../../middlewares/validate');
const bearValidation = require('../../validations/bear.validation');
const bearController = require('../../controllers/bear.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bears
 *   description: Bear data retrieval
 */



/**
 * @swagger
 * /bears/years:
 *   get:
 *     summary: Get available years for bear data
 *     tags: [Bears]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *
 */
router.get('/years', bearController.getBearYears);


/**
 * @swagger
 * /bears/search:
 *   get:
 *     summary: Search for bears
 *     tags: [Bears]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query string
 *         required: true
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter by
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Language for results (e.g., 'en', 'ja')
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bear'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
router.get('/search', validate(bearValidation.searchBear), bearController.searchBear);


/**
 * @swagger
 * /bears/h3:
 *   get:
 *     summary: Count bears within a geographic range using H3 cells
 *     tags: [Bears]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter by
 *       - in: query
 *         name: minLat
 *         schema:
 *           type: number
 *         required: true
 *         description: Minimum latitude
 *       - in: query
 *         name: maxLat
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum latitude
 *       - in: query
 *         name: minLng
 *         schema:
 *           type: number
 *         required: true
 *         description: Minimum longitude
 *       - in: query
 *         name: maxLng
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum longitude
 *       - in: query
 *         name: resolution
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 15
 *         required: true
 *         description: H3 resolution (0-15)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   h3_index:
 *                     type: string
 *                   count:
 *                     type: integer
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

router.get('/h3', validate(bearValidation.countBearInRange), bearController.countBearInRange);


/**
 * @swagger
 * /bears/{id}:
 *   get:
 *     summary: Get bear details
 *     tags: [Bears]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Bear ID
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Language for results (e.g., 'en', 'ja')
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bear'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', validate(bearValidation.getBearDetail), bearController.getBearDetail);

module.exports = router;

