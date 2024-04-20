import { boardService } from './board.service.js'
import { logger } from '../../services/logger.service.js'

export async function getBoards(req, res) {
    console.log(req.query);
    try {
        // const filterBy = req.query.params.filterBy
        // const sortBy = req.query.params.sortBy

        // const filterBy = {
        //     txt: req.query.params.filterBy.txt || '',
        //     labels: req.query.params.filterBy.labels || '',
        //     inStock: req.query.params.filterBy.inStock || '',
        //     // pageIdx: req.query.params.filterBy.pageIdx || '',
        // }

        // const sortBy = {
        //     by: req.query.params.sortBy.by || '',
        //     asc: req.query.params.sortBy.asc || ''
        // }


        // logger.debug('Getting Boards', filterBy)
        logger.debug('Getting Boards')
        // const boards = await boardService.query(filterBy, sortBy)
        const boards = await boardService.query()
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        console.log(boardId);
        const board = await boardService.getById(boardId)
        res.json(board)
    } catch (err) {
        // console.log('err',err);
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

export async function addBoard(req, res) {
    // const { loggedinUser } = req
    // console.log(req);
    // console.log(loggedinUser, '🥰');
    // const {creator, inStock, price} = req.body

    try {
        const board = req.body
        // board.createdBy = loggedinUser
        // board.inStock = true
        // board.price = parseInt(board.price) || 0
        // console.log(typeof(board.price), board.price, '😍');
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}


export async function updateBoard(req, res) {
    try {
        const board = req.body
        console.log(board);
        // board.price = parseInt(board.price) || 0

        const updatedBoard = await boardService.update(board)
        res.json(updatedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

export async function removeBoard(req, res) {
    try {
        const boardId = req.params.id
        await boardService.remove(boardId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(500).send({ err: 'Failed to remove board' })
    }
}

export async function addBoardMsg(req, res) {
    const { loggedinUser } = req
    try {
        const boardId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await boardService.addBoardMsg(boardId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}


export async function removeBoardMsg(req, res) {
    const { loggedinUser } = req
    // console.log('fffffffffffffffffffffffff');
    try {
        const boardId = req.params.id
        const { msgId } = req.params

        const removedId = await boardService.removeBoardMsg(boardId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board msg', err)
        res.status(500).send({ err: 'Failed to remove board msg' })
    }
}

// function extractTimestamp(boardId) {
//     const timestamp = new Date(parseInt(boardId.substring(0, 8), 16) * 1000);
//     return timestamp;
// }