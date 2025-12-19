// src/config/swagger/swagger.config.ts
import { SwaggerDefinition } from "swagger-jsdoc";
import { config } from "../../config";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Despertar Digital API - Economía Global",
    version: "1.0.0",
    description: `
API completa para datos económicos en tiempo real.
Incluye economía argentina, forex internacional, criptomonedas, bolsas mundiales y más.

##  Módulos disponibles:
- **Argentina**: Dólar blue, oficial, CCL, MEP, MERVAL
- **Forex**: Divisas internacionales (EUR/USD, USD/JPY, etc.)
- **₿ Crypto**: Criptomonedas (Bitcoin, Ethereum, etc.)
- ** Stocks**: Bolsas mundiales (S&P 500, NASDAQ, etc.)
- ** Commodities**: Oro, petróleo, commodities
- ** Economy**: Dashboard/resumen global

##  Autenticación
Actualmente las APIs son públicas. En futuras versiones se agregará API Key.

##  Formatos
Todas las respuestas son en JSON con UTF-8.
    `,
    contact: {
      name: "Despertar Digital",
      url: "https://despertardigital.es",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  // Verifica que esto esté en swagger.config.ts
  servers: [
    {
      url: config.backendUrl, // ← Debe usar la variable, no "http://localhost:3000"
      description:
        process.env.NODE_ENV === "production"
          ? "Servidor de producción"
          : "Servidor de desarrollo",
    },
  ],
  tags: [
    {
      name: "Economía Argentina",
      description: "Dólar blue, oficial, CCL, MEP, MERVAL y economía local",
    },
    {
      name: "Forex",
      description: "Divisas internacionales y tipos de cambio",
    },
    {
      name: "Criptomonedas",
      description: "Precios de criptomonedas en tiempo real",
    },
    {
      name: "Economía Global",
      description: "Dashboard y resumen de todos los mercados",
    },
    {
      name: "Health",
      description: "Estado de salud de la API",
    },
  ],
  components: {
    schemas: {
      // Agrega esto en la sección components.schemas:
      DollarRate: {
        type: "object",
        properties: {
          moneda: { type: "string", example: "USD" },
          casa: { type: "string", example: "blue" },
          nombre: { type: "string", example: "Blue" },
          compra: { type: "number", example: 1480 },
          venta: { type: "number", example: 1500 },
          fechaActualizacion: {
            type: "string",
            format: "date-time",
            example: "2025-12-18T13:05:00.000Z",
          },
        },
      },
      CurrencyRate: {
        type: "object",
        properties: {
          moneda: { type: "string", example: "EUR" },
          casa: { type: "string", example: "oficial" },
          nombre: { type: "string", example: "Euro" },
          compra: { type: "number", example: 1693.48 },
          venta: { type: "number", example: 1707.68 },
          fechaActualizacion: {
            type: "string",
            format: "date-time",
            example: "2025-12-17T16:57:00.000Z",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Error al obtener datos",
          },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T12:00:00Z",
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "healthy",
          },
          timestamp: {
            type: "string",
            format: "date-time",
          },
          module: {
            type: "string",
            example: "argentina",
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: "Recurso no encontrado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      ServerError: {
        description: "Error interno del servidor",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  paths: {}, // Se llenará automáticamente con swagger-jsdoc
};

export default swaggerDefinition;
