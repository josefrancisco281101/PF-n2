import swaggerAutogen from "swagger-autogen";

import { HOST } from "./src/config/ServerConfig.js";

const doc = {
  info: {
    title: "blogging",
    description:
      "API RESTful, plataforma de blogging interactiva, Esta plataforma permitirá a los usuarios registrar cuentas, crear publicaciones, comentar en publicaciones de otros usuarios, explorar publicaciones por categorías y buscar publicaciones por título.",
  },

  host: HOST,
  servers: [
    {
      url: "http://localhost:3000/api/v1",
    },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/index.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc).then(async () => {
  await import("./src/index.js");
});
