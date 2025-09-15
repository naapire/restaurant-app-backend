import express from "express";
import {  deleteUser, getAllUsers, loginUser, signUp, updateUser } from "../controllers/usercontroller.ts";
import { createRestaurant } from "../controllers/restaurantcontrollers.ts";

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/logIn", loginUser);
routes.put('/:id', updateUser);
routes.delete("/:id", deleteUser)
routes.get("/users", getAllUsers);

//Restaurants
routes.post("/createRestaurant", createRestaurant)

export default routes