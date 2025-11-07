import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Management System",
      version: "1.0.0",
      description: "API documentation for Restaurant and User Management",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // adjust if your API base path is different
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // 👈 where swagger will look for docs
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📑 Swagger docs available at http://localhost:${port}/api-docs`);
};
