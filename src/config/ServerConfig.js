import { config } from "dotenv";

config()

const APP = process.env['APP_NAME']
const HOST = process.env['SERVER_HOST']
const PORT = process.env['SERVER_PORT']

export { APP, HOST, PORT}