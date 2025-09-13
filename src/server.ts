import express from 'express';
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.SERVER_PORT
const app = express();
app.use(express.json());


app.listen(process.env.SERVER_PORT, () => console.log(`Server running on port http://localhost:${port}`));
