/**
 * @swagger
 * tags:
 *   - name: Economía Argentina
 *     description: Dólar blue (~1490 ARS), oficial (~1480 ARS), CCL, MEP, tarjeta, mayorista - Datos en tiempo real
 */

/**
 * @swagger
 * /api/economy/argentina/dolares:
 *   get:
 *     tags: [Economía Argentina]
 *     summary: 7 tipos de dólar argentino
 *     description: |
 *       Precios actualizados de todos los dólares en Argentina.
 *       Actualización automática cada 5-10 minutos.
 *       
 *       ## Tipos incluidos:
 *       - **Blue** (informal): ~1490 ARS
 *       - **Oficial** (Banco Nación): ~1480 ARS
 *       - **CCL** (Contado con Liquidación): ~1543 ARS
 *       - **MEP** (Bolsa): ~1501 ARS
 *       - **Tarjeta**: ~1924 ARS
 *       - **Mayorista**: ~1453 ARS
 *       - **Cripto**: ~1541 ARS
 *     responses:
 *       200:
 *         description: Array con los 7 tipos de dólar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   moneda:
 *                     type: string
 *                     example: "USD"
 *                     description: Siempre "USD"
 *                   casa:
 *                     type: string
 *                     example: "blue"
 *                     enum: [blue, oficial, bolsa, contadoconliqui, mayorista, cripto, tarjeta]
 *                   nombre:
 *                     type: string
 *                     example: "Blue"
 *                     enum: [Blue, Oficial, Bolsa, "Contado con liquidación", Mayorista, Cripto, Tarjeta]
 *                   compra:
 *                     type: number
 *                     example: 1470
 *                     description: Precio de compra
 *                   venta:
 *                     type: number
 *                     example: 1490
 *                     description: Precio de venta (el más usado)
 *                   fechaActualizacion:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-18T17:00:00.000Z"
 *         examples:
 *           blueOnly:
 *             summary: Solo dólar blue
 *             value: [
 *               {
 *                 "moneda": "USD",
 *                 "casa": "blue",
 *                 "nombre": "Blue",
 *                 "compra": 1470,
 *                 "venta": 1490,
 *                 "fechaActualizacion": "2025-12-18T17:00:00.000Z"
 *               }
 *             ]
 *           allTypes:
 *             summary: Todos los tipos (ejemplo real)
 *             value: [
 *               {"moneda":"USD","casa":"blue","nombre":"Blue","compra":1470,"venta":1490,"fechaActualizacion":"2025-12-18T17:00:00.000Z"},
 *               {"moneda":"USD","casa":"oficial","nombre":"Oficial","compra":1430,"venta":1480,"fechaActualizacion":"2025-12-18T11:38:00.000Z"},
 *               {"moneda":"USD","casa":"bolsa","nombre":"Bolsa","compra":1499.5,"venta":1501.5,"fechaActualizacion":"2025-12-18T17:00:00.000Z"}
 *             ]
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/economy/argentina/cotizaciones:
 *   get:
 *     tags: [Economía Argentina]
 *     summary: Monedas internacionales (EUR, BRL, UYU, CLP)
 *     description: Cotizaciones oficiales del Banco Nación para conversión
 *     responses:
 *       200:
 *         description: 4 monedas internacionales + USD oficial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   moneda:
 *                     type: string
 *                     example: "EUR"
 *                     enum: [USD, EUR, BRL, CLP, UYU]
 *                   casa:
 *                     type: string
 *                     example: "oficial"
 *                     description: Siempre "oficial" (Banco Nación)
 *                   nombre:
 *                     type: string
 *                     example: "Euro"
 *                     enum: [Dólar, Euro, "Real Brasileño", "Peso Chileno", "Peso Uruguayo"]
 *                   compra:
 *                     type: number
 *                     example: 1693.48
 *                   venta:
 *                     type: number
 *                     example: 1707.68
 *                   fechaActualizacion:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-18T13:56:00.000Z"
 */

/**
 * @swagger
 * /api/economy/argentina:
 *   get:
 *     tags: [Economía Argentina]
 *     summary: Endpoint raíz / redirección
 *     description: Redirige automáticamente a /cotizaciones
 *     responses:
 *       200:
 *         description: Redirección implícita
 *       302:
 *         description: Redirección explícita (algunos clients)
 */

/**
 * @swagger
 * /api/economy/argentina/health:
 *   get:
 *     tags: [Health, Economía Argentina]
 *     summary: Estado del servicio Argentina
 *     description: Verifica conectividad con APIs de dólar y cotizaciones
 *     responses:
 *       200:
 *         description: Servicio operativo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Uno o más servicios externos caídos
 */