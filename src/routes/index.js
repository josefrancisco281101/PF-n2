import { Router } from "express";

import { userRoutes } from "./UserRoutes.js";
import { postRoutes } from "./PostRoutes.js";
import {categoryRoutes } from "./CategoryRoutes.js"
import { docRoutes } from './DocRoutes.js'
import { commentRoutes} from './CommentRoutes.js'
const API_router = Router();

export const router = (app) => {

  app.use('/api/v1', API_router);
  
  API_router.use("/api-docs", docRoutes)
  API_router.use("/user", userRoutes )
  API_router.use("/post", postRoutes )
  API_router.use("/category", categoryRoutes )
  API_router.use("/comment", commentRoutes )
  
}