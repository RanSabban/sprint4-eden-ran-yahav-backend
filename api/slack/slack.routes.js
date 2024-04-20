// api/slack/slack.routes.js
import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { sendMessage } from './slack.controller.js'

export const slackRoutes = express.Router()

slackRoutes.post('/message', log, sendMessage)
