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
 *       
 *       ## Ejemplo real de respuesta:
 *       ```json
 *       {
 *         "success": true,
 *         "majorCurrencies": {
 *           "EUR": 0.85332,
 *           "GBP": 0.74631,
 *           "JPY": 155.77,
 *           "CHF": 0.79495,
 *           "CAD": 1.379,
 *           "AUD": 1.5133,
 *           "base": "USD",
 *           "updated": "2025-12-18"
 *         },
 *         "latinAmerica": {
 *           "BRL": 5.5476,
 *           "MXN": 18.0024,
 *           "base": "USD",
 *           "updated": "2025-12-18"
 *         },
 *         "provider": "Frankfurter.app",
 *         "timestamp": "2025-12-19T10:52:26.665Z"
 *       }
 *       ```
 *       
 *       ## Interpretación:
 *       - `"EUR": 0.85332` → 1 USD = 0.85332 EUR
 *       - `"JPY": 155.77` → 1 USD = 155.77 JPY  
 *       - `"BRL": 5.5476` → 1 USD = 5.5476 BRL
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
 *                   type: object
 *                   properties:
 *                     EUR:
 *                       type: number
 *                       example: 0.85332
 *                       description: "1 USD = X EUR"
 *                     GBP:
 *                       type: number
 *                       example: 0.74631
 *                     JPY:
 *                       type: number
 *                       example: 155.77
 *                     CHF:
 *                       type: number
 *                       example: 0.79495
 *                     CAD:
 *                       type: number
 *                       example: 1.379
 *                     AUD:
 *                       type: number
 *                       example: 1.5133
 *                     base:
 *                       type: string
 *                       example: "USD"
 *                     updated:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-18"
 *                 latinAmerica:
 *                   type: object
 *                   properties:
 *                     BRL:
 *                       type: number
 *                       example: 5.5476
 *                       description: "1 USD = X BRL (Real brasileño)"
 *                     MXN:
 *                       type: number
 *                       example: 18.0024
 *                       description: "1 USD = X MXN (Peso mexicano)"
 *                     base:
 *                       type: string
 *                       example: "USD"
 *                     updated:
 *                       type: string
 *                       format: date
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
 *       Versión alternativa que unifica todas las tasas en un solo objeto `data`.
 *       Incluye indicador `cached` que muestra si se usó caché.
 *       
 *       ## Estructura de respuesta:
 *       ```json
 *       {
 *         "success": true,
 *         "data": {
 *           "major": { "EUR": 0.85332, "GBP": 0.74631, ... },
 *           "latinAmerica": { "BRL": 5.5476, "MXN": 18.0024, ... },
 *           "timestamp": "2025-12-19T10:52:57.126Z"
 *         },
 *         "provider": "Frankfurter.app",
 *         "cached": false
 *       }
 *       ```
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
 *                   description: "Indica si la respuesta vino del caché"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/forex/convert:
 *   get:
 *     tags: [Forex]
 *     summary: Conversor de divisas
 *     description: |
 *       Convierte una cantidad de una divisa a otra usando tasas en tiempo real.
 *       
 *       ## Ejemplo de uso:
 *       ```bash
 *       # Convertir 100 USD a EUR
 *       curl "http://localhost:3000/api/economy/forex/convert?amount=100&from=USD&to=EUR"
 *       
 *       # Convertir 50 EUR a USD  
 *       curl "http://localhost:3000/api/economy/forex/convert?amount=50&from=EUR&to=USD"
 *       
 *       # Convertir 1000 USD a BRL (Real brasileño)
 *       curl "http://localhost:3000/api/economy/forex/convert?amount=1000&from=USD&to=BRL"
 *       ```
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
 *         example: 100
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           default: USD
 *           enum: [USD, EUR, GBP, JPY, CHF, CAD, AUD, BRL, MXN]
 *         description: Divisa de origen (código ISO 4217)
 *         example: USD
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           default: EUR
 *           enum: [USD, EUR, GBP, JPY, CHF, CAD, AUD, BRL, MXN]
 *         description: Divisa de destino (código ISO 4217)
 *         example: EUR
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
 *                       description: Cantidad original
 *                     from:
 *                       type: string
 *                       example: "USD"
 *                     to:
 *                       type: string
 *                       example: "EUR"
 *                     rate:
 *                       type: number
 *                       example: 0.8533
 *                       description: "Tasa de conversión (1 from = X to)"
 *                     result:
 *                       type: number
 *                       example: 85.33
 *                       description: "Resultado de la conversión"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-18"
 *         examples:
 *           usdToEur:
 *             summary: 100 USD a EUR
 *             value:
 *               success: true
 *               conversion:
 *                 amount: 100
 *                 from: "USD"
 *                 to: "EUR"
 *                 rate: 0.8533
 *                 result: 85.33
 *                 date: "2025-12-18"
 *           eurToBrl:
 *             summary: 50 EUR a BRL
 *             value:
 *               success: true
 *               conversion:
 *                 amount: 50
 *                 from: "EUR"
 *                 to: "BRL"
 *                 rate: 6.5021
 *                 result: 325.105
 *                 date: "2025-12-18"
 *       400:
 *         description: |
 *           Parámetros inválidos. Posibles errores:
 *           - `amount` no es un número positivo
 *           - Códigos de divisa no soportados
 *           - API de conversión no disponible
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
 *         examples:
 *           healthy:
 *             summary: Servicio funcionando
 *             value:
 *               status: "healthy"
 *               module: "forex"
 *               timestamp: "2025-12-19T10:52:26.665Z"
 *       503:
 *         description: API externa de Forex no disponible
 */

/**
 * @swagger
 * /api/forex/trend/{currency}:
 *   get:
 *     tags: [Forex, History]
 *     summary: Tendencia diaria de una divisa
 *     description: |
 *       Compara el **precio de cierre de hoy vs ayer**
 *       y devuelve la dirección de la tendencia.
 *
 *       Ideal para:
 *       - Flecha verde / roja
 *       - Indicadores rápidos
 *
 *       📌 **Base:** USD  
 *       📌 **Fuente:** Base de datos histórica propia
 *     parameters:
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: BRL
 *         description: Código ISO 4217 de la divisa
 *     responses:
 *       200:
 *         description: Tendencia calculada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currency:
 *                   type: string
 *                   example: BRL
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-22T00:00:00.000Z"
 *                 today:
 *                   type: number
 *                   example: 5.5294
 *                 yesterday:
 *                   type: number
 *                   example: 5.5295
 *                 change:
 *                   type: number
 *                   example: -0.0001
 *                 changePercent:
 *                   type: number
 *                   example: -0.01
 *                 direction:
 *                   type: string
 *                   enum: [up, down, flat]
 *                   example: down
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
 *     description: |
 *       Devuelve datos históricos diarios **OHLC** (Open, High, Low, Close)
 *       almacenados en la base de datos.
 *
 *       Este endpoint es ideal para:
 *       - Gráficos de velas (candlestick)
 *       - Análisis histórico
 *
 *       📌 **Base:** USD  
 *       📌 **Fuente:** Base de datos histórica propia
 *     parameters:
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: EUR
 *         description: Código ISO 4217 de la divisa (EUR, BRL, JPY, etc.)
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2023-01-01
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2023-02-01
 *         description: Fecha final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Histórico OHLC obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currency:
 *                   type: string
 *                   example: EUR
 *                 count:
 *                   type: number
 *                   example: 32
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       open:
 *                         type: number
 *                         example: 0.93756
 *                       high:
 *                         type: number
 *                         example: 0.95238
 *                       low:
 *                         type: number
 *                         example: 0.91718
 *                       close:
 *                         type: number
 *                         example: 0.92311
 *       400:
 *         description: Divisa no especificada o invál*


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
 *           description: "Euro (Eurozone)"
 *         GBP:
 *           type: number
 *           example: 0.74631
 *           description: "Libra esterlina (Reino Unido)"
 *         JPY:
 *           type: number
 *           example: 155.77
 *           description: "Yen japonés (Japón)"
 *         CHF:
 *           type: number
 *           example: 0.79495
 *           description: "Franco suizo (Suiza)"
 *         CAD:
 *           type: number
 *           example: 1.379
 *           description: "Dólar canadiense (Canada)"
 *         AUD:
 *           type: number
 *           example: 1.5133
 *           description: "Dólar australiano (Australia)"
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
 *           description: "Real brasileño (Brasil)"
 *         MXN:
 *           type: number
 *           example: 18.0024
 *           description: "Peso mexicano (México)"
 *         base:
 *           type: string
 *           example: "USD"
 *         updated:
 *           type: string
 *           format: date
 *           example: "2025-12-18"
 */