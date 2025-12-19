/**
 * @swagger
 * tags:
 *   - name: Economía Global
 *     description: Dashboards unificados que combinan Argentina + Forex + Crypto en una sola respuesta
 */

/**
 * @swagger
 * /api/economy/global:
 *   get:
 *     tags: [Economía Global]
 *     summary: Dashboard global (Forex + Crypto)
 *     description: |
 *       Dashboard enfocado en mercados internacionales. Combina:
 *       - **Forex**: Divisas internacionales (EUR, JPY, GBP, etc.)
 *       - **Crypto**: Top 5 criptomonedas (Bitcoin, Ethereum, etc.)
 *       
 *       ## Ejemplo de respuesta:
 *       ```json
 *       {
 *         "success": true,
 *         "data": {
 *           "forex": {
 *             "major": { "EUR": 0.85332, "JPY": 155.77, "GBP": 0.74631 },
 *             "latinAmerica": { "BRL": 5.5476, "MXN": 18.0024 },
 *             "timestamp": "2025-12-19T11:15:00.000Z"
 *           },
 *           "crypto": {
 *             "success": true,
 *             "data": [
 *               { "id": "bitcoin", "name": "Bitcoin", "current_price": 87432 },
 *               { "id": "ethereum", "name": "Ethereum", "current_price": 4567 }
 *             ],
 *             "timestamp": "2025-12-19T11:15:00.000Z"
 *           },
 *           "metadata": {
 *             "lastUpdated": "2025-12-19T11:15:00.000Z",
 *             "services": ["forex", "crypto"],
 *             "status": "operational"
 *           }
 *         },
 *         "timestamp": "2025-12-19T11:15:00.000Z"
 *       }
 *       ```
 *     responses:
 *       200:
 *         description: Dashboard global obtenido exitosamente
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
 *                     forex:
 *                       $ref: '#/components/schemas/ForexData'
 *                     crypto:
 *                       $ref: '#/components/schemas/CryptoData'
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         lastUpdated:
 *                           type: string
 *                           format: date-time
 *                         services:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["forex", "crypto"]
 *                         status:
 *                           type: string
 *                           enum: [operational, degraded, offline]
 *                           example: "operational"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T11:15:00.000Z"
 *         examples:
 *           dashboardGlobal:
 *             summary: Dashboard global típico
 *             value:
 *               success: true
 *               data:
 *                 forex:
 *                   major: 
 *                     EUR: 0.85332
 *                     JPY: 155.77
 *                     GBP: 0.74631
 *                   latinAmerica:
 *                     BRL: 5.5476
 *                     MXN: 18.0024
 *                   timestamp: "2025-12-19T11:15:00.000Z"
 *                 crypto:
 *                   success: true
 *                   data:
 *                     - id: "bitcoin"
 *                       name: "Bitcoin"
 *                       current_price: 87432
 *                     - id: "ethereum"
 *                       name: "Ethereum"
 *                       current_price: 4567
 *                   timestamp: "2025-12-19T11:15:00.000Z"
 *                 metadata:
 *                   lastUpdated: "2025-12-19T11:15:00.000Z"
 *                   services: ["forex", "crypto"]
 *                   status: "operational"
 *               timestamp: "2025-12-19T11:15:00.000Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/economy/argentina:
 *   get:
 *     tags: [Economía Global]
 *     summary: Dashboard de economía argentina
 *     description: |
 *       Dashboard completo de la economía argentina. Incluye:
 *       - **Dólares**: Los 7 tipos (blue, oficial, CCL, MEP, tarjeta, mayorista, cripto)
 *       - **Cotizaciones**: Monedas internacionales (EUR, BRL, UYU, CLP)
 *       
 *       ## Ejemplo de respuesta (datos reales):
 *       ```json
 *       {
 *         "success": true,
 *         "data": {
 *           "argentina": {
 *             "dolares": [
 *               { "casa": "blue", "nombre": "Blue", "venta": 1490 },
 *               { "casa": "oficial", "nombre": "Oficial", "venta": 1480 },
 *               { "casa": "contadoconliqui", "nombre": "CCL", "venta": 1543.8 }
 *             ],
 *             "cotizaciones": [
 *               { "moneda": "EUR", "nombre": "Euro", "venta": 1707.68 },
 *               { "moneda": "BRL", "nombre": "Real Brasileño", "venta": 263.53 }
 *             ],
 *             "lastUpdated": "2025-12-18T18:02:14.205Z"
 *           },
 *           "metadata": {
 *             "source": "Local ExchangeService",
 *             "status": "operational"
 *           }
 *         },
 *         "timestamp": "2025-12-18T18:02:14.205Z"
 *       }
 *       ```
 *     responses:
 *       200:
 *         description: Dashboard Argentina obtenido exitosamente
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
 *                     argentina:
 *                       type: object
 *                       properties:
 *                         dolares:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/DollarRate'
 *                         cotizaciones:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/CurrencyRate'
 *                         lastUpdated:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-12-18T18:02:14.205Z"
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         source:
 *                           type: string
 *                           example: "Local ExchangeService"
 *                         status:
 *                           type: string
 *                           example: "operational"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-18T18:02:14.205Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/economy/complete:
 *   get:
 *     tags: [Economía Global]
 *     summary: Dashboard COMPLETO (Global + Argentina)
 *     description: |
 *       Dashboard más completo que integra TODOS los servicios:
 *       - Forex internacional
 *       - Criptomonedas
 *       - Economía argentina (dólares + cotizaciones)
 *       
 *       Ideal para una vista panorámica de todos los mercados.
 *       
 *       ## Ejemplo de uso para frontend:
 *       ```javascript
 *       // Una sola llamada para obtener TODO
 *       fetch('/api/economy/complete')
 *         .then(res => res.json())
 *         .then(data => {
 *           const forex = data.data.global.forex;
 *           const crypto = data.data.global.crypto;
 *           const argentina = data.data.argentina;
 *           
 *           // Actualizar toda la interfaz con una sola respuesta
 *           updateDashboard({ forex, crypto, argentina });
 *         });
 *       ```
 *     responses:
 *       200:
 *         description: Dashboard completo obtenido exitosamente
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
 *                     global:
 *                       type: object
 *                       properties:
 *                         forex:
 *                           $ref: '#/components/schemas/ForexData'
 *                         crypto:
 *                           $ref: '#/components/schemas/CryptoData'
 *                     argentina:
 *                       type: object
 *                       properties:
 *                         dolares:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/DollarRate'
 *                         cotizaciones:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/CurrencyRate'
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         lastUpdated:
 *                           type: string
 *                           format: date-time
 *                         services:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["forex", "crypto", "dolares", "cotizaciones"]
 *                         status:
 *                           type: string
 *                           example: "operational"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T11:15:00.000Z"
 *       500:
 *         description: |
 *           Algunos servicios fallaron. Se retorna un dashboard de emergencia
 *           con datos básicos (_fallback: true).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Some services failed"
 *                 data:
 *                   $ref: '#/components/schemas/EmergencyDashboard'
 *                 _fallback:
 *                   type: boolean
 *                   example: true
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/economy/unified-forex:
 *   get:
 *     tags: [Economía Global]
 *     summary: Forex unificado con ARS integrado
 *     description: |
 *       Versión especial del Forex que integra el dólar argentino (ARS)
 *       junto con las divisas internacionales.
 *       
 *       Útil para aplicaciones que necesitan mostrar ARS junto a EUR, JPY, etc.
 *       
 *       ## Característica única:
 *       Incluye un campo `integratedARS` que agrega el dólar blue argentino
 *       a las tasas de cambio internacionales.
 *     responses:
 *       200:
 *         description: Forex unificado obtenido exitosamente
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
 *                     integratedARS:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 1490
 *                           description: "Valor del dólar blue en ARS"
 *                         source:
 *                           type: string
 *                           example: "Local ArgentinaService"
 *                         type:
 *                           type: string
 *                           example: "blue"
 *                     argentinaFull:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DollarRate'
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/economy/health:
 *   get:
 *     tags: [Health, Economía Global]
 *     summary: Estado del servicio Economy
 *     description: Verifica conectividad con todos los servicios subyacentes
 *     responses:
 *       200:
 *         description: Todos los servicios operativos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Uno o más servicios subyacentes no disponibles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ForexData:
 *       type: object
 *       properties:
 *         major:
 *           $ref: '#/components/schemas/MajorRates'
 *         latinAmerica:
 *           $ref: '#/components/schemas/LatinAmericaRates'
 *         timestamp:
 *           type: string
 *           format: date-time
 *     
 *     CryptoData:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CryptoCurrency'
 *         timestamp:
 *           type: string
 *           format: date-time
 *     
 *     EmergencyDashboard:
 *       type: object
 *       properties:
 *         global:
 *           type: object
 *           properties:
 *             forex:
 *               type: object
 *               properties:
 *                 major:
 *                   type: object
 *                   properties:
 *                     EUR:
 *                       type: number
 *                       example: 0.85
 *                     USD:
 *                       type: number
 *                       example: 1.0
 *                 _fallback:
 *                   type: boolean
 *                   example: true
 *             crypto:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Bitcoin"
 *                       price:
 *                         type: number
 *                         example: 65000
 *                 _fallback:
 *                   type: boolean
 *                   example: true
 *         argentina:
 *           type: object
 *           properties:
 *             dolares:
 *               type: object
 *               properties:
 *                 blue:
 *                   type: number
 *                   example: 1000
 *                 oficial:
 *                   type: number
 *                   example: 850
 *                 _fallback:
 *                   type: boolean
 *                   example: true
 *             cotizaciones:
 *               type: object
 *               properties:
 *                 _fallback:
 *                   type: boolean
 *                   example: true
 *         _fallback:
 *           type: boolean
 *           example: true
 */