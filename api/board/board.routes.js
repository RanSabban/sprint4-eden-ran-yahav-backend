import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, addBoardMsg, removeBoardMsg } from './board.controller.js'

export const boardRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

boardRoutes.get('/', log, getBoards)
boardRoutes.get('/:id', getBoardById)
// boardRoutes.post('/', requireAuth, requireAdmin, addBoard)
boardRoutes.post('/', addBoard)
boardRoutes.put('/:id', updateBoard)
// boardRoutes.delete('/:id', requireAuth, requireAdmin, removeBoard)
boardRoutes.delete('/:id' , removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)

boardRoutes.post('/:id/msg', requireAuth, addBoardMsg)
boardRoutes.delete('/:id/msg/:msgId', requireAuth, requireAdmin, removeBoardMsg)
