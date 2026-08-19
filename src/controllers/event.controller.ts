import { Request,Response } from "express";
import {Model}  from "mongoose"


export function createEvent <T>(model: Model<T>){
    return {

        // POST /ID:
        create: async (req: Request, res: Response) => {
            try {
              const data = await model.create(req.body);
              res.status(201).json({ message: "Created", data });
            } catch (error) {
              res.status(400).json({ message: "Failed to create", error: (error as Error).message });
            }
          }
    }
}