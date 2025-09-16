import express from "express";
import dotenv from "dotenv";
import routes from "./routes/userRoutes.ts";
import { swaggerDocs } from "./config/swagger.ts";
dotenv.config();

const port = Number(process.env.SERVER_PORT) || 5000 ;
const app = express();
app.use(express.json());

app.use("/api", routes);

swaggerDocs(app, port)

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
