import type{ Request, Response } from "express";
import db from "../config/db.ts";
import dotenv from "dotenv";


dotenv.config();

export const createRestaurant= async(req: Request, res: Response) : Promise<void> =>{
 try{
    const {restaurant_name, address, location} = req.body as {
        restaurant_name:string,
        address:string,
        location:string
    }

    if (!restaurant_name || !address || !location){
        res.status(400).json({message: "must provide all credentials"});
        return;
    }

    db.query("INSERT INTO restaurants (restaurant_name, address, location)  VALUES (?,?,?)",
        [restaurant_name, address, location],
        (err)=>{
            if(err){
                res.status(400).json({err: err.message});
                return
            }
            res.status(200).json({message: "Restaurant registered sucessfully"})
        }
    );
 }
  catch(error: any){
      res.status(500).json({ error: error.message });
    }
}
