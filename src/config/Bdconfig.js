import { config } from "dotenv"

config()

const BD_HOST = process.env['BD_HOST']
const BD_NAME = process.env['BD_NAME']
const BD_USER = process.env['BD_USER']
const BD_PASS = process.env['BD_PASS']
const BD_PORT = process.env['BD_PORT']

export { BD_HOST, BD_NAME, BD_USER, BD_PASS, BD_PORT }