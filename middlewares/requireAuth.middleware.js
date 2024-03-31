import { logger } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'
import { log } from './logger.middleware.js'

export async function requireAuth(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }
    
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    req.loggedinUser = loggedinUser
    console.log(loggedinUser, 6666666666666666666666666);
    next()
}

export async function requireAdmin(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    next()
}