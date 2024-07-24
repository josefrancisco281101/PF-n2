import { Router } from "express"
import { index, show, store, update, destroy } from "../controller/UserController.js"

export const userRoutes = Router()

userRoutes.get('/', index)

userRoutes.get('/:id', show)

userRoutes.post('/', store)

userRoutes.put('/:id', update)

userRoutes.delete('/:id', destroy)