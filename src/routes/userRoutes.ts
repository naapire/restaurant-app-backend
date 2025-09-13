import express from "express";
import { signUp } from "../controllers/usercontroller.ts";

const routes = express.Router();

routes.post("/signup", signUp);

export default routes;
