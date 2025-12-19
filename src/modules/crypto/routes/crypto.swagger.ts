/**
 * @swagger
 * tags:
 *   - name: Criptomonedas
 *     description: Precios de criptomonedas en tiempo real (Bitcoin, Ethereum, etc.) - Datos desde CoinGecko API
 */

/**
 * @swagger
 * /api/crypto/top:
 *   get:
 *     tags: [Criptomonedas]
 *     summary: Top criptomonedas por capitalización de mercado
 *     description: |
 *       Retorna las principales criptomonedas ordenadas por capitalización de mercado.
 *       Datos en tiempo real desde CoinGecko API (actualización cada 5-10 minutos).
 *       
 *       ## Campos incluidos:
 *       - `id`: Identificador único (ej: "bitcoin")
 *       - `symbol`: Símbolo (ej: "btc")
 *       - `name`: Nombre completo (ej: "Bitcoin")
 *       - `current_price`: Precio actual en USD
 *       - `market_cap`: Capitalización de mercado en USD
 *       - `market_cap_rank`: Posición en ranking mundial
 *       - `price_change_percentage_24h`: Variación % en 24 horas
 *       
 *       ## Ejemplo de uso:
 *       ```bash
 *       # Top 10 (default)
 *       curl "http://localhost:3000/api/crypto/top"
 *       
 *       # Top 20
 *       curl "http://localhost:3000/api/crypto/top?limit=20"
 *       
 *       # Top 5
 *       curl "http://localhost:3000/api/crypto/top?limit=5"
 *       ```
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Número de criptomonedas a retornar (1-100)
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de criptomonedas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                   description: Número de criptomonedas retornadas
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CryptoCurrency'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T11:15:00.000Z"
 *                 cached:
 *                   type: boolean
 *                   example: false
 *                   description: Indica si los datos vienen del caché
 *         examples:
 *           top10:
 *             summary: Top 10 criptomonedas
 *             value:
 *               success: true
 *               count: 10
 *               data:
 *                 - id: "bitcoin"
 *                   symbol: "btc"
 *                   name: "Bitcoin"
 *                   current_price: 87432
 *                   market_cap: 1712345678901
 *                   market_cap_rank: 1
 *                   price_change_percentage_24h: 2.15
 *                 - id: "ethereum"
 *                   symbol: "eth"
 *                   name: "Ethereum"
 *                   current_price: 4567
 *                   market_cap: 549876543210
 *                   market_cap_rank: 2
 *                   price_change_percentage_24h: -1.23
 *               timestamp: "2025-12-19T11:15:00.000Z"
 *               cached: false
 *       400:
 *         description: Parámetro limit inválido (fuera del rango 1-100)
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/crypto/top5:
 *   get:
 *     tags: [Criptomonedas]
 *     summary: Top 5 criptomonedas (endpoint optimizado)
 *     description: |
 *       Versión optimizada que siempre retorna las 5 principales criptomonedas.
 *       Ideal para dashboards y widgets que necesitan datos rápidos.
 *       
 *       ## Ejemplo de uso:
 *       ```bash
 *       curl "http://localhost:3000/api/crypto/top5"
 *       ```
 *     responses:
 *       200:
 *         description: Top 5 criptomonedas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   maxItems: 5
 *                   minItems: 5
 *                   items:
 *                     $ref: '#/components/schemas/CryptoCurrency'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T11:15:00.000Z"
 *         examples:
 *           top5Response:
 *             summary: Respuesta típica del top 5
 *             value:
 *               success: true
 *               data:
 *                 - id: "bitcoin"
 *                   symbol: "btc"
 *                   name: "Bitcoin"
 *                   current_price: 87432
 *                   market_cap: 1712345678901
 *                   market_cap_rank: 1
 *                   price_change_percentage_24h: 2.15
 *                 - id: "ethereum"
 *                   symbol: "eth"
 *                   name: "Ethereum"
 *                   current_price: 4567
 *                   market_cap: 549876543210
 *                   market_cap_rank: 2
 *                   price_change_percentage_24h: -1.23
 *                 - id: "tether"
 *                   symbol: "usdt"
 *                   name: "Tether"
 *                   current_price: 1.00
 *                   market_cap: 98765432109
 *                   market_cap_rank: 3
 *                   price_change_percentage_24h: 0.01
 *                 - id: "binancecoin"
 *                   symbol: "bnb"
 *                   name: "BNB"
 *                   current_price: 324.56
 *                   market_cap: 49876543210
 *                   market_cap_rank: 4
 *                   price_change_percentage_24h: 0.45
 *                 - id: "solana"
 *                   symbol: "sol"
 *                   name: "Solana"
 *                   current_price: 189.23
 *                   market_cap: 39876543210
 *                   market_cap_rank: 5
 *                   price_change_percentage_24h: 3.21
 *               timestamp: "2025-12-19T11:15:00.000Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/crypto/{id}:
 *   get:
 *     tags: [Criptomonedas]
 *     summary: Detalles de una criptomoneda específica
 *     description: |
 *       Obtiene información detallada de una criptomoneda por su ID.
 *       
 *       ## IDs populares (case insensitive):
 *       - `bitcoin` o `btc` → Bitcoin
 *       - `ethereum` o `eth` → Ethereum
 *       - `tether` o `usdt` → Tether
 *       - `binancecoin` o `bnb` → BNB
 *       - `solana` o `sol` → Solana
 *       
 *       ## Ejemplo de uso:
 *       ```bash
 *       # Bitcoin por ID
 *       curl "http://localhost:3000/api/crypto/bitcoin"
 *       
 *       # Ethereum por símbolo
 *       curl "http://localhost:3000/api/crypto/eth"
 *       
 *       # Solana
 *       curl "http://localhost:3000/api/crypto/solana"
 *       ```
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           ID de la criptomoneda (ej: "bitcoin") o símbolo (ej: "btc").
 *           Case insensitive.
 *         examples:
 *           bitcoin:
 *             value: bitcoin
 *             summary: Bitcoin (por ID)
 *           btc:
 *             value: btc
 *             summary: Bitcoin (por símbolo)
 *           ethereum:
 *             value: ethereum
 *             summary: Ethereum
 *     responses:
 *       200:
 *         description: Detalles de la criptomoneda obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CryptoCurrencyDetailed'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-19T11:15:00.000Z"
 *         examples:
 *           bitcoinDetails:
 *             summary: Detalles de Bitcoin
 *             value:
 *               success: true
 *               data:
 *                 id: "bitcoin"
 *                 symbol: "btc"
 *                 name: "Bitcoin"
 *                 current_price: 87432
 *                 market_cap: 1712345678901
 *                 market_cap_rank: 1
 *                 price_change_percentage_24h: 2.15
 *                 price_change_percentage_7d: 5.32
 *                 price_change_percentage_30d: 12.45
 *                 price_change_percentage_1y: 45.67
 *                 ath: 98765
 *                 ath_change_percentage: -11.45
 *                 atl: 67.81
 *                 atl_change_percentage: 128900.12
 *                 last_updated: "2025-12-19T11:14:00.000Z"
 *               timestamp: "2025-12-19T11:15:00.000Z"
 *       404:
 *         description: Criptomoneda no encontrada
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
 *                   example: "Cryptocurrency not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/crypto/health:
 *   get:
 *     tags: [Health, Criptomonedas]
 *     summary: Estado del servicio Criptomonedas
 *     description: Verifica conectividad con CoinGecko API
 *     responses:
 *       200:
 *         description: Servicio Criptomonedas operativo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *         examples:
 *           healthy:
 *             summary: Servicio funcionando
 *             value:
 *               status: "healthy"
 *               module: "crypto"
 *               timestamp: "2025-12-19T11:15:00.000Z"
 *               endpoints:
 *                 - "/top"
 *                 - "/top5"
 *                 - "/:id"
 *                 - "/health"
 *       503:
 *         description: CoinGecko API no disponible
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CryptoCurrency:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "bitcoin"
 *           description: Identificador único (usado en /{id})
 *         symbol:
 *           type: string
 *           example: "btc"
 *           description: Símbolo (3-5 caracteres)
 *         name:
 *           type: string
 *           example: "Bitcoin"
 *           description: Nombre completo
 *         current_price:
 *           type: number
 *           example: 87432
 *           description: Precio actual en USD
 *         market_cap:
 *           type: number
 *           example: 1712345678901
 *           description: Capitalización de mercado en USD
 *         market_cap_rank:
 *           type: integer
 *           example: 1
 *           description: Posición en ranking (1 = mayor capitalización)
 *         price_change_percentage_24h:
 *           type: number
 *           example: 2.15
 *           description: Cambio porcentual en las últimas 24 horas
 *     
 *     CryptoCurrencyDetailed:
 *       allOf:
 *         - $ref: '#/components/schemas/CryptoCurrency'
 *         - type: object
 *           properties:
 *             price_change_percentage_7d:
 *               type: number
 *               example: 5.32
 *               description: Cambio porcentual en los últimos 7 días
 *             price_change_percentage_30d:
 *               type: number
 *               example: 12.45
 *               description: Cambio porcentual en los últimos 30 días
 *             price_change_percentage_1y:
 *               type: number
 *               example: 45.67
 *               description: Cambio porcentual en el último año
 *             ath:
 *               type: number
 *               example: 98765
 *               description: All Time High (precio máximo histórico)
 *             ath_change_percentage:
 *               type: number
 *               example: -11.45
 *               description: Porcentaje desde el ATH (-11.45% = 11.45% por debajo del máximo)
 *             atl:
 *               type: number
 *               example: 67.81
 *               description: All Time Low (precio mínimo histórico)
 *             atl_change_percentage:
 *               type: number
 *               example: 128900.12
 *               description: Porcentaje desde el ATL (128900.12% = subió 1289x desde el mínimo)
 *             last_updated:
 *               type: string
 *               format: date-time
 *               example: "2025-12-19T11:14:00.000Z"
 *               description: Última actualización de los datos
 */