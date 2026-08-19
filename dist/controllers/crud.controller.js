"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrudController = void 0;
// Factory CRUD generik — dipakai semua entity (category, location, event, dst).
// ponytail: skip yup validation, andalkan Mongoose schema (required/enum/min).
//           add per-entity yup kalau butuh aturan lintas-field.
function createCrudController(model, populate = []) {
    return {
        // GET /?page=1&limit=10&search=foo
        findAll: (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(1, Number(req.query.page) || 1);
                const limit = Math.min(100, Number(req.query.limit) || 10);
                const search = req.query.search;
                const filter = search
                    ? { name: { $regex: search, $options: "i" } }
                    : {};
                let query = model.find(filter).skip((page - 1) * limit).limit(limit);
                populate.forEach((p) => (query = query.populate(p)));
                const [data, total] = yield Promise.all([
                    query.exec(),
                    model.countDocuments(filter),
                ]);
                res.status(200).json({
                    message: "Data fetched",
                    data,
                    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
                });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch", error: error.message });
            }
        }),
        // GET /:id
        findOne: (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query = model.findById(req.params.id);
                populate.forEach((p) => (query = query.populate(p)));
                const data = yield query.exec();
                if (!data)
                    return res.status(404).json({ message: "Not found" });
                res.status(200).json({ message: "Data fetched", data });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch", error: error.message });
            }
        }),
        // POST /
        create: (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.create(req.body);
                res.status(201).json({ message: "Created", data });
            }
            catch (error) {
                res.status(400).json({ message: "Failed to create", error: error.message });
            }
        }),
        // PUT /:id
        update: (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!data)
                    return res.status(404).json({ message: "Not found" });
                res.status(200).json({ message: "Updated", data });
            }
            catch (error) {
                res.status(400).json({ message: "Failed to update", error: error.message });
            }
        }),
        // DELETE /:id
        remove: (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.findByIdAndDelete(req.params.id);
                if (!data)
                    return res.status(404).json({ message: "Not found" });
                res.status(200).json({ message: "Deleted", data });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to delete", error: error.message });
            }
        }),
    };
}
exports.createCrudController = createCrudController;
