import express from "express";
import { loginUser, signUp } from "../controllers/usercontroller.ts";

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/logIn", loginUser);

export default routes;
