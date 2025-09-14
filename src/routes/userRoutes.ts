import express from "express";
import { loginUser, signUp, updateUser } from "../controllers/usercontroller.ts";

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/logIn", loginUser);
routes.put('/:id', updateUser);

export default routes;
