import { Router } from "express";

import { setup, serve } from "swagger-ui-express";

import swaggerDocument from "../../swagger-output.json" assert { type: "json" };

export const docRoutes = Router();

docRoutes.use("/", serve);
docRoutes.get(
  "/",
 

  setup(swaggerDocument)
);
