// src/config/swagger/index.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import swaggerDefinition from "./swagger.config";
import { config } from "../../config";

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    "./src/modules/**/*.swagger.ts", // ← AÑADIR ESTA LÍNEA (archivos de documentación separados)
    "./src/modules/**/routes/*.routes.ts", // Rutas de módulos económicos
    "./src/modules/**/controllers/*.ts", // Controladores (para JSDoc en métodos)
    "./src/routes/*.routes.ts", // Rutas legacy
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application): void {
  // Ruta principal de Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Despertar Digital API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
      customfavIcon: "/favicon.ico",
    })
  );

  // Ruta para el spec en JSON (útil para integraciones)
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // ✅ USAR config.backendUrl DINÁMICAMENTE
  const swaggerUrl = `${config.backendUrl}/api-docs`;
  const jsonSpecUrl = `${config.backendUrl}/api-docs.json`;

  console.log(`📚 Swagger UI disponible en: ${swaggerUrl}`);
  console.log(`📄 Swagger JSON spec en: ${jsonSpecUrl}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
}
