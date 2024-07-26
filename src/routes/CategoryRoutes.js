import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controller/CategoryController.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", index);

categoryRoutes.get("/:id", show);

categoryRoutes.post("/", store);

categoryRoutes.put("/:id", update);

categoryRoutes.delete("/:id", destroy);
