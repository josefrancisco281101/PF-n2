import express from 'express'
import cors from 'cors'
import { HOST, PORT } from "./config/ServerConfig.js";

import { router } from "./routes/index.js";


const app = express();

app.use(cors());
app.use(express.json());
router(app);

app.listen(PORT, () => {
  console.log(`HOST: ${HOST}`);
});
