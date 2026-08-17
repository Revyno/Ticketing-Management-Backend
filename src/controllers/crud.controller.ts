import { Request, Response } from "express";
import { Model } from "mongoose";

// Factory CRUD generik — dipakai semua entity (category, location, event, dst).
// ponytail: skip yup validation, andalkan Mongoose schema (required/enum/min).
//           add per-entity yup kalau butuh aturan lintas-field.
export function createCrudController<T>(model: Model<T>, populate: string[] = []) {
  return {
    // GET /?page=1&limit=10&search=foo
    findAll: async (req: Request, res: Response) => {
      try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = req.query.search as string | undefined;

        const filter = search
          ? { name: { $regex: search, $options: "i" } }
          : {};

        let query = model.find(filter).skip((page - 1) * limit).limit(limit);
        populate.forEach((p) => (query = query.populate(p)));

        const [data, total] = await Promise.all([
          query.exec(),
          model.countDocuments(filter),
        ]);

        res.status(200).json({
          message: "Data fetched",
          data,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch", error: (error as Error).message });
      }
    },

    // GET /:id
    findOne: async (req: Request, res: Response) => {
      try {
        let query = model.findById(req.params.id);
        populate.forEach((p) => (query = query.populate(p)));
        const data = await query.exec();
        if (!data) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Data fetched", data });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch", error: (error as Error).message });
      }
    },

    // POST /
    create: async (req: Request, res: Response) => {
      try {
        const data = await model.create(req.body);
        res.status(201).json({ message: "Created", data });
      } catch (error) {
        res.status(400).json({ message: "Failed to create", error: (error as Error).message });
      }
    },

    // PUT /:id
    update: async (req: Request, res: Response) => {
      try {
        const data = await model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!data) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Updated", data });
      } catch (error) {
        res.status(400).json({ message: "Failed to update", error: (error as Error).message });
      }
    },

    // DELETE /:id
    remove: async (req: Request, res: Response) => {
      try {
        const data = await model.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Deleted", data });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete", error: (error as Error).message });
      }
    },
  };
}
