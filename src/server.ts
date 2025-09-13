import express from 'express';
import dotenv from 'dotenv'
import routes from './routes/userRoutes.ts';
dotenv.config()

const port = process.env.SERVER_PORT
const app = express();
app.use(express.json());

app.use('/api/users', routes);

app.listen(process.env.SERVER_PORT, () => console.log(`Server running on port http://localhost:${port}`));
