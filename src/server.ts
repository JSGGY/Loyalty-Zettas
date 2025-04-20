import express from 'express';
import { setupSwagger } from './swagger';
import qualificationRoutes from './routes/qualificationRoutes'; // Asegúrate de que este sea el nombre correcto del archivo y exportación
import { handleError } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Configura Swagger
setupSwagger(app);

// Configura las rutas
app.use('/api', qualificationRoutes); // Usa el enrutador para manejar las rutas bajo '/api'

app.get('/loyalty', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Loyalty funcionando correctamente' });
});

app.get('/external-donations', async (req, res) => {
  try {
    const response = await fetch('http://26.76.200.87:3000/api/connect');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al consumir la API externa:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las donaciones' });
  }
});

// Middleware para manejar rutas no encontradas (404)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Middleware para manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(res, 500, 'Something went wrong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
