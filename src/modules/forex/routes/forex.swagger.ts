/**
 * @swagger
 * tags:
 *   - name: Forex
 *     description: Divisas internacionales (EUR/USD, USD/JPY, BRL, MXN, etc.) - Tasas en tiempo real desde Frankfurter.app
 */

/**
 * @swagger
 * /api/forex/global:
 *   get:
 *     tags: [Forex]
 *     summary: Tasas de cambio globales organizadas
 *     description: |
 *       Obtiene las tasas de cambio agrupadas en dos categorías:
 *       1. **Monedas principales**: EUR, GBP, JPY, CHF, CAD, AUD (base USD)
 *       2. **Latinoamérica**: BRL, MXN (base USD)
 *     responses:
 *       200:
 *         description: Tasas organizadas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 majorCurrencies:
 *                   $ref: '#/components/schemas/MajorRates'
 *                 latinAmerica:
 *                   $ref: '#/components/schemas/LatinAmericaRates'
 *                 provider:
 *                   type: string
 *                   example: "Frankfurter.app"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T10:52:26.665Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/all:
 *   get:
 *     tags: [Forex]
 *     summary: Todas las tasas en formato unificado
 *     description: |
 *       Unifica todas las tasas en un solo objeto `data`.
 *       Incluye indicador `cached` que muestra si se usó caché.
 *     responses:
 *       200:
 *         description: Todas las tasas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     major:
 *                       $ref: '#/components/schemas/MajorRates'
 *                     latinAmerica:
 *                       $ref: '#/components/schemas/LatinAmericaRates'
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-19T10:52:57.126Z"
 *                 provider:
 *                   type: string
 *                   example: "Frankfurter.app"
 *                 cached:
 *                   type: boolean
 *                   example: false
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/convert:
 *   get:
 *     tags: [Forex]
 *     summary: Conversor de divisas
 *     description: Convierte una cantidad de una divisa a otra usando tasas en tiempo real.
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: false
 *         schema:
 *           type: number
 *           default: 1
 *           minimum: 0.01
 *           maximum: 1000000
 *         description: Cantidad a convertir (default 1)
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           default: USD
 *           enum: [USD, EUR, GBP, JPY, CHF, CAD, AUD, BRL, MXN]
 *         description: Divisa de origen
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           default: EUR
 *           enum: [USD, EUR, GBP, JPY, CHF, CAD, AUD, BRL, MXN]
 *         description: Divisa de destino
 *     responses:
 *       200:
 *         description: Conversión exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 conversion:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                       example: 100
 *                     from:
 *                       type: string
 *                       example: "USD"
 *                     to:
 *                       type: string
 *                       example: "EUR"
 *                     rate:
 *                       type: number
 *                       example: 0.8533
 *                     result:
 *                       type: number
 *                       example: 85.33
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-18"
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/health:
 *   get:
 *     tags: [Health, Forex]
 *     summary: Estado del servicio Forex
 *     description: Verifica conectividad con Frankfurter.app API
 *     responses:
 *       200:
 *         description: Servicio Forex operativo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: API externa de Forex no disponible
 */

/**
 * @swagger
 * /api/forex/trend/{currency}:
 *   get:
 *     tags: [Forex, History]
 *     summary: Tendencia diaria de una divisa
 *     parameters:
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: BRL
 *     responses:
 *       200:
 *         description: Tendencia calculada correctamente
 *       404:
 *         description: No hay suficientes datos históricos
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/history/{currency}:
 *   get:
 *     tags: [Forex, History]
 *     summary: Histórico OHLC de una divisa
 *     parameters:
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: EUR
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-02-01"
 *     responses:
 *       200:
 *         description: Histórico OHLC obtenido exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/trends:
 *   get:
 *     tags: [Forex, History]
 *     summary: Todas las monedas frente a USD con su tendencia diaria
 *     description: Devuelve todas las monedas disponibles comparando cierre de hoy vs ayer.
 *     responses:
 *       200:
 *         description: Tendencias calculadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForexTrendsResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MajorRates:
 *       type: object
 *       properties:
 *         EUR:
 *           type: number
 *           example: 0.85332
 *         GBP:
 *           type: number
 *           example: 0.74631
 *         JPY:
 *           type: number
 *           example: 155.77
 *         CHF:
 *           type: number
 *           example: 0.79495
 *         CAD:
 *           type: number
 *           example: 1.379
 *         AUD:
 *           type: number
 *           example: 1.5133
 *         base:
 *           type: string
 *           example: "USD"
 *         updated:
 *           type: string
 *           format: date
 *           example: "2025-12-18"
 *
 *     LatinAmericaRates:
 *       type: object
 *       properties:
 *         BRL:
 *           type: number
 *           example: 5.5476
 *         MXN:
 *           type: number
 *           example: 18.0024
 *         base:
 *           type: string
 *           example: "USD"
 *         updated:
 *           type: string
 *           format: date
 *           example: "2025-12-18"
 *
 *     ForexTrend:
 *       type: object
 *       properties:
 *         currency:
 *           type: string
 *           example: BRL
 *         today:
 *           type: number
 *           example: 5.5294
 *         yesterday:
 *           type: number
 *           example: 5.5295
 *         change:
 *           type: number
 *           example: -0.0001
 *         changePercent:
 *           type: number
 *           example: -0.01
 *         pairDirection:
 *           type: string
 *           enum: [up, down, flat]
 *           example: down
 *         currencyDirection:
 *           type: string
 *           enum: [up, down, flat]
 *           example: up
 *
 *     ForexTrendsResponse:
 *       type: object
 *       properties:
 *         base:
 *           type: string
 *           example: USD
 *         updated:
 *           type: string
 *           format: date-time
 *           example: "2025-12-23T12:00:00.000Z"
 *         trends:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ForexTrend'
 */
