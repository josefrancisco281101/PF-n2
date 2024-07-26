import { Router } from "express"
import { index, show, store, update, destroy } from "../controller/CommentController.js"

export const commentRoutes = Router()

commentRoutes.get('/', index)

commentRoutes.get('/:id', show)

commentRoutes.post('/', store)

commentRoutes.put('/:id', update)

commentRoutes.delete('/:id', destroy)