import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import path from 'path';

const app = express();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MS LOYALTY BAQ',
      version: '1.0.0',
      description: 'Documentación API MS Loyalty BAQ',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      },
      {
        url: 'https://loyalty-zettas.onrender.com',
        description: 'Server desplegado en Render'
      }
    ],
  },
  apis: ['./src/routes/*.ts'], // Ruta a tus archivos de rutas
};

const specs = swaggerJsdoc(swaggerOptions);

// Imprime la especificación generada para depuración
console.log(JSON.stringify(specs, null, 2));

// Middleware para servir la documentación Swagger
export const setupSwagger = (app: express.Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.use('/api-docs', express.static(path.join(__dirname, 'src')));
};
