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

export const getAllRestaurant= (req:Request, res: Response) : void=>{
db.query("SELECT restaurant_name, address, location FROM restaurants ",(err, results)=>{
    if (err){
        res.status(400).json({err:err.message})
        return
    } res.json(results);
})

}

export const getRestaurantById = async(req: Request, res: Response):Promise <any> => {
  const { id } = req.params; 

  db.query(
    "SELECT restaurant_name, address, location FROM restaurants WHERE id = ?",
    [id],
    (err, results:[]) => {
      if (err) {
        res.status(400).json({ err: err.message });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ message: "Restaurant not found" });
        return;
      }

     return res.json(results); 
    }
  );
};

export const updateRestaurant = (req: Request, res: Response): void => {
  const { id } = req.params;

  const { restaurant_name, address, location } = req.body as {
    restaurant_name: string;
    address: string;
    location: string;
  };

  db.query(
    "UPDATE restaurants SET restaurant_name = ?, address = ?, location = ? WHERE id = ?",
    [restaurant_name, address, location, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ message: "Restaurant updated successfully" });
    }
  );
};

export const deleteRestaurant= (req:Request, res:Response) : void =>{
    const {id}= req.params;

    db.query("DELETE FROM restaurants WHERE id =?", 
        [id],
       (err)=>{
        if(err){
            res.status(400).json({err:err.message});
            return ;
        } res.json({message:"Restaurant deleted sucessfully"})
       }
    )
}
        

    



