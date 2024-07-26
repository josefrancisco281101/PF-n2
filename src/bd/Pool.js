import mysql from "mysql2/promise";
import {
  BD_HOST,
  BD_NAME,
  BD_USER,
  BD_PASS,
  BD_PORT,
} from "../config/Bdconfig.js";
const pool = mysql.createPool({
  host: BD_HOST,
  database: BD_NAME,
  user: BD_USER,
  password: BD_PASS,
  port: BD_PORT,
});

export default pool;
